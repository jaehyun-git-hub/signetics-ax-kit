"""doc_kit.py — 보고서형 워드 문서를 일정한 디자인으로 만드는 python-docx 도우미

시그네틱스 AX 키트 doc-docx 스킬용. 사용자 브랜드나 제출 양식이 없을 때 기본 디자인으로 쓴다.

사용:
    import sys; sys.path.insert(0, "<이 scripts 폴더>")
    from doc_kit import Report
    r = Report(title="8D 보고서", subtitle="SG261013C02 기능 불량", meta=[("문서 번호", "8D-2610-07"), ("작성일", "2026-11-03")])
    r.h1("D2 문제 정의")
    r.para("본문 문장")
    r.fact("로트 SG261013C02 수율 96.9%", source="테스트결과_week42_전체.csv")
    r.estimate("범프 접합 불량 가능성", check="불량 시료 단면 분석", owner="(담당자 입력)")
    r.table(["항목", "내용"], [["고객사", "고객사 K"]], widths=[4, 12])
    r.callout("고객 회신 전 원인 확정 여부를 확인한다.", tone="warn")
    r.save("8D_초안.docx")
"""
from docx import Document
from docx.enum.section import WD_ORIENT
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

FONT = "Malgun Gothic"
INK, TEXT, SUB, LINE, SOFT = "0F172A", "334155", "64748B", "E2E8F0", "F1F5F9"
BLUE, NAVY = "2563EB", "1E293B"
TONES = {"info": ("2563EB", "EFF6FF"), "good": ("15803D", "DCFCE7"), "warn": ("B45309", "FEF3C7"), "bad": ("DC2626", "FEE2E2")}


def _rgb(h):
    return RGBColor.from_string(h)


def _shade(cell, color):
    tcPr = cell._tc.get_or_add_tcPr()
    sh = OxmlElement("w:shd"); sh.set(qn("w:val"), "clear"); sh.set(qn("w:color"), "auto"); sh.set(qn("w:fill"), color)
    tcPr.append(sh)


def _borders(table, color=LINE, size=4, inside=True):
    tblPr = table._tbl.tblPr
    b = OxmlElement("w:tblBorders")
    for edge in ("top", "left", "bottom", "right") + (("insideH", "insideV") if inside else ()):
        e = OxmlElement(f"w:{edge}"); e.set(qn("w:val"), "single"); e.set(qn("w:sz"), str(size)); e.set(qn("w:color"), color)
        b.append(e)
    tblPr.append(b)


def _cell_margins(table, top=80, bottom=80, left=120, right=120):
    tblPr = table._tbl.tblPr
    m = OxmlElement("w:tblCellMar")
    for k, v in (("top", top), ("bottom", bottom), ("left", left), ("right", right)):
        e = OxmlElement(f"w:{k}"); e.set(qn("w:w"), str(v)); e.set(qn("w:type"), "dxa"); m.append(e)
    tblPr.append(m)


def _fullwidth(table, width_cm):
    table.autofit = False
    tblPr = table._tbl.tblPr
    w = tblPr.find(qn("w:tblW"))
    if w is None:
        w = OxmlElement("w:tblW"); tblPr.append(w)
    w.set(qn("w:w"), str(int(width_cm * 567))); w.set(qn("w:type"), "dxa")
    lay = OxmlElement("w:tblLayout"); lay.set(qn("w:type"), "fixed"); tblPr.append(lay)


def _font(run, size=None, bold=None, color=None, font=FONT):
    run.font.name = font
    rPr = run._element.get_or_add_rPr()
    rf = rPr.find(qn("w:rFonts"))
    if rf is None:
        rf = OxmlElement("w:rFonts"); rPr.append(rf)
    for a in ("w:ascii", "w:hAnsi", "w:eastAsia", "w:cs"):
        rf.set(qn(a), font)
    if size: run.font.size = Pt(size)
    if bold is not None: run.font.bold = bold
    if color: run.font.color.rgb = _rgb(color)
    return run


def _space(p, before=0, after=6, line=1.35):
    pf = p.paragraph_format
    pf.space_before = Pt(before); pf.space_after = Pt(after); pf.line_spacing = line
    return p


class Report:
    def __init__(self, title, subtitle="", meta=None, note="교육용 가상 데이터", landscape=False, font=FONT):
        self.font = font
        self.doc = Document()
        sec = self.doc.sections[0]
        if landscape:
            sec.orientation = WD_ORIENT.LANDSCAPE; sec.page_width, sec.page_height = sec.page_height, sec.page_width
        sec.page_width, sec.page_height = (Cm(29.7), Cm(21.0)) if landscape else (Cm(21.0), Cm(29.7))
        for side in ("left_margin", "right_margin"): setattr(sec, side, Cm(2.0))
        sec.top_margin = Cm(1.8); sec.bottom_margin = Cm(1.8)
        st = self.doc.styles["Normal"]; st.font.name = font; st.font.size = Pt(10.5)
        st.element.rPr.rFonts.set(qn("w:eastAsia"), font)
        self.width_cm = (29.7 if landscape else 21.0) - 4.0
        self._footer(title, note)
        self._title(title, subtitle, meta)

    # ---- 머리글·바닥글 ----
    def _footer(self, title, note):
        f = self.doc.sections[0].footer.paragraphs[0]
        f.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        _font(f.add_run(" · ".join(x for x in (title, note) if x) + "    "), 8, color=SUB, font=self.font)
        r = f.add_run()
        for t, txt in (("begin", None), (None, "PAGE"), ("end", None)):
            if t:
                e = OxmlElement("w:fldChar"); e.set(qn("w:fldCharType"), t); r._r.append(e)
            else:
                e = OxmlElement("w:instrText"); e.set(qn("xml:space"), "preserve"); e.text = txt; r._r.append(e)
        _font(r, 8, color=SUB, font=self.font)

    def _title(self, title, subtitle, meta):
        t = self.doc.add_table(rows=1, cols=1); t.alignment = WD_TABLE_ALIGNMENT.CENTER; _fullwidth(t, self.width_cm)
        c = t.cell(0, 0); _shade(c, NAVY); _cell_margins(t, 260, 260, 300, 300)
        p = c.paragraphs[0]; _font(p.add_run(title), 22, True, "FFFFFF", self.font); _space(p, 0, 2)
        if subtitle:
            p2 = c.add_paragraph(); _font(p2.add_run(subtitle), 12, False, "CBD5E1", self.font); _space(p2, 0, 0)
        if meta:
            _space(self.doc.add_paragraph(), 0, 2)
            m = self.doc.add_table(rows=1, cols=len(meta)); _borders(m, LINE, 4); _cell_margins(m, 60, 60, 120, 120); _fullwidth(m, self.width_cm)
            for i, (k, v) in enumerate(meta):
                cell = m.cell(0, i); _shade(cell, SOFT)
                a = cell.paragraphs[0]; _font(a.add_run(k), 8, True, SUB, self.font); _space(a, 0, 0)
                b = cell.add_paragraph(); _font(b.add_run(v), 10, True, INK, self.font); _space(b, 0, 0)
        _space(self.doc.add_paragraph(), 0, 4)

    # ---- 본문 ----
    def h1(self, text, number=None):
        p = self.doc.add_paragraph(); _space(p, 14, 6, 1.1)
        if number: _font(p.add_run(f"{number}  "), 15, True, BLUE, self.font)
        _font(p.add_run(text), 15, True, INK, self.font)
        pPr = p._p.get_or_add_pPr(); bdr = OxmlElement("w:pBdr"); bt = OxmlElement("w:bottom")
        bt.set(qn("w:val"), "single"); bt.set(qn("w:sz"), "8"); bt.set(qn("w:color"), LINE); bt.set(qn("w:space"), "4")
        bdr.append(bt); pPr.append(bdr)
        return p

    def h2(self, text):
        p = self.doc.add_paragraph(); _space(p, 8, 4, 1.1); _font(p.add_run(text), 12, True, NAVY, self.font); return p

    def para(self, text, size=10.5, color=TEXT, bold=False):
        p = self.doc.add_paragraph(); _space(p); _font(p.add_run(text), size, bold, color, self.font); return p

    def bullets(self, items, size=10.5):
        for it in items:
            p = self.doc.add_paragraph(); _space(p, 0, 3)
            p.paragraph_format.left_indent = Cm(0.6); p.paragraph_format.first_line_indent = Cm(-0.4)
            _font(p.add_run("•  "), size, True, BLUE, self.font); _font(p.add_run(it), size, None, TEXT, self.font)

    def _tagline(self, tag, fg, bg, text, tail=None):
        t = self.doc.add_table(rows=1, cols=2); _cell_margins(t, 50, 50, 100, 100); _fullwidth(t, self.width_cm)
        t.columns[0].width = Cm(1.6)
        a, b = t.cell(0, 0), t.cell(0, 1)
        a.width = Cm(1.6); b.width = Cm(self.width_cm - 1.6)
        _shade(a, bg); a.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        pa = a.paragraphs[0]; pa.alignment = WD_ALIGN_PARAGRAPH.CENTER; _font(pa.add_run(tag), 9, True, fg, self.font); _space(pa, 0, 0)
        pb = b.paragraphs[0]; _font(pb.add_run(text), 10.5, None, INK, self.font); _space(pb, 0, 0)
        if tail:
            pc = b.add_paragraph(); _font(pc.add_run(tail), 9, None, SUB, self.font); _space(pc, 0, 0)
        _borders(t, LINE, 4, inside=False)
        _space(self.doc.add_paragraph(), 0, 0, 0.6)

    def fact(self, text, source=None):
        self._tagline("사실", "15803D", "DCFCE7", text, f"근거: {source}" if source else None)

    def estimate(self, text, check=None, owner=None):
        tail = " / ".join(x for x in (f"확인 방법: {check}" if check else "", f"확인 담당: {owner}" if owner else "") if x)
        self._tagline("추정", "B45309", "FEF3C7", text, tail or None)

    def callout(self, text, tone="info", title=None):
        fg, bg = TONES.get(tone, TONES["info"])
        t = self.doc.add_table(rows=1, cols=1); _fullwidth(t, self.width_cm); c = t.cell(0, 0); _shade(c, bg); _cell_margins(t, 120, 120, 200, 200)
        tcPr = c._tc.get_or_add_tcPr(); bd = OxmlElement("w:tcBorders"); l = OxmlElement("w:left")
        l.set(qn("w:val"), "single"); l.set(qn("w:sz"), "24"); l.set(qn("w:color"), fg); bd.append(l); tcPr.append(bd)
        p = c.paragraphs[0]; _space(p, 0, 0)
        if title: _font(p.add_run(title + "  "), 10.5, True, fg, self.font)
        _font(p.add_run(text), 10.5, None, INK, self.font)
        _space(self.doc.add_paragraph(), 0, 2)

    def table(self, columns, rows, widths=None, highlight=(), align=None, size=9.5):
        t = self.doc.add_table(rows=1, cols=len(columns)); t.alignment = WD_TABLE_ALIGNMENT.CENTER
        _borders(t, LINE, 4); _cell_margins(t); _fullwidth(t, self.width_cm)
        if not widths: widths = [1] * len(columns)
        for i, h in enumerate(columns):
            c = t.rows[0].cells[i]; _shade(c, NAVY)
            p = c.paragraphs[0]; _font(p.add_run(h), size, True, "FFFFFF", self.font); _space(p, 0, 0)
        for ri, r in enumerate(rows):
            cells = t.add_row().cells
            for ci, v in enumerate(r):
                c = cells[ci]
                if ri in highlight: _shade(c, "FEE2E2")
                elif ri % 2: _shade(c, SOFT)
                p = c.paragraphs[0]; _space(p, 0, 0)
                if align and align[ci] == "right": p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
                if align and align[ci] == "center": p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                _font(p.add_run(str(v)), size, ri in highlight and ci == 0, INK, self.font)
        if widths:
            tot = sum(widths)
            for i, w in enumerate(widths):
                t.columns[i].width = Cm(self.width_cm * w / tot)
            for row in t.rows:
                for i, w in enumerate(widths):
                    row.cells[i].width = Cm(self.width_cm * w / tot)
        _space(self.doc.add_paragraph(), 0, 2)
        return t

    def kv(self, pairs):
        """항목-내용 2열 표 (개요, 기본 정보)"""
        t = self.doc.add_table(rows=0, cols=2); _borders(t, LINE, 4); _cell_margins(t); _fullwidth(t, self.width_cm)
        for k, v in pairs:
            a, b = t.add_row().cells
            a.width = Cm(3.6); b.width = Cm(self.width_cm - 3.6); _shade(a, SOFT)
            pa = a.paragraphs[0]; _font(pa.add_run(k), 9.5, True, NAVY, self.font); _space(pa, 0, 0)
            pb = b.paragraphs[0]; _font(pb.add_run(v), 10, None, INK, self.font); _space(pb, 0, 0)
        t.columns[0].width = Cm(3.6); t.columns[1].width = Cm(self.width_cm - 3.6)
        _space(self.doc.add_paragraph(), 0, 2)
        return t

    def signoff(self, roles=("작성", "검토", "승인")):
        """서명란. 이름은 비워 두고 사람이 채운다."""
        t = self.doc.add_table(rows=2, cols=len(roles)); t.alignment = WD_TABLE_ALIGNMENT.RIGHT; _borders(t, LINE, 4)
        _fullwidth(t, 2.8 * len(roles))
        for i in range(len(roles)): t.columns[i].width = Cm(2.8)
        for i, r in enumerate(roles):
            h = t.cell(0, i); _shade(h, SOFT); p = h.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            _font(p.add_run(r), 9, True, NAVY, self.font); _space(p, 0, 0)
            b = t.cell(1, i); b.width = Cm(2.8); h.width = Cm(2.8)
            q = b.paragraphs[0]; _font(q.add_run("\n\n"), 9, font=self.font)
        return t

    def page_break(self):
        self.doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)

    def save(self, path):
        self.doc.save(path); return path
