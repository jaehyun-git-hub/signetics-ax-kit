/*
 * deck_kit.js — 보고서형 PPT를 일정한 디자인으로 만드는 PptxGenJS 도우미
 * 시그네틱스 AX 키트 doc-pptx 스킬용. 사용자 브랜드가 없을 때 기본 디자인으로 쓴다.
 *
 * 사용:
 *   const kit = require(process.env.KIT || "./deck_kit.js");
 *   const d = kit.create({ title: "10월 품질 리뷰", org: "품질팀", date: "2026-11-02", note: "교육용 가상 데이터" });
 *   d.cover({ kicker: "월간 품질 리뷰", title: "10월 품질 리뷰", subtitle: "...", meta: "2026-11-02 · 품질팀" });
 *   d.kpis({ title: "...", cards: [{ label: "월 수율", value: "99.12%", sub: "목표 99.0%", tone: "good" }] });
 *   d.chart({ title: "...", type: "line", categories: [...], series: [{ name: "A", values: [...] }], target: 99.0, unit: "%" });
 *   await d.save("결과.pptx");
 *
 * 모든 슬라이드 제목은 결론 문장(헤드라인)으로 쓴다. 예: "C라인 수율이 42~43주에 기준 근처까지 내려갔다"
 */
const PptxGenJS = require("pptxgenjs");

const C = {
  ink: "0F172A", text: "334155", sub: "64748B", line: "E2E8F0", soft: "F1F5F9", white: "FFFFFF",
  navy: "1E293B", blue: "2563EB", blue2: "93C5FD", teal: "0F766E", red: "DC2626", redSoft: "FEE2E2",
  green: "15803D", greenSoft: "DCFCE7", amber: "B45309", amberSoft: "FEF3C7",
  series: ["2563EB", "0F766E", "F59E0B", "7C3AED", "DB2777", "64748B"],
};
const FONT = "Malgun Gothic";
const W = 13.333, H = 7.5, MX = 0.6;

function create(opts = {}) {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.title = opts.title || "보고서";
  pptx.company = opts.org || "";
  const font = opts.font || FONT;
  let n = 0;

  function base(slide, { dark = false } = {}) {
    n += 1;
    slide.background = { color: dark ? C.navy : C.white };
    if (!dark) {
      slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 0.08, fill: { color: C.blue }, line: { color: C.blue } });
      const foot = [opts.title, opts.note].filter(Boolean).join("  ·  ");
      slide.addText(foot, { x: MX, y: H - 0.45, w: 9, h: 0.3, fontFace: font, fontSize: 9, color: C.sub });
      slide.addText(String(n), { x: W - MX - 1, y: H - 0.45, w: 1, h: 0.3, fontFace: font, fontSize: 9, color: C.sub, align: "right" });
    }
  }
  function head(slide, title, kicker) {
    if (kicker) slide.addText(kicker, { x: MX, y: 0.35, w: W - 2 * MX, h: 0.3, fontFace: font, fontSize: 11, bold: true, color: C.blue });
    slide.addText(title, { x: MX, y: kicker ? 0.62 : 0.45, w: W - 2 * MX, h: 0.8, fontFace: font, fontSize: 24, bold: true, color: C.ink, valign: "top", fit: "shrink" });
  }
  function source(slide, text) {
    if (text) slide.addText("출처: " + text, { x: MX, y: H - 0.8, w: W - 2 * MX, h: 0.28, fontFace: font, fontSize: 9, color: C.sub, italic: true });
  }
  function noteBox(slide, text, y, h = 0.7) {
    if (!text) return;
    slide.addShape(pptx.shapes.RECTANGLE, { x: MX, y, w: W - 2 * MX, h, fill: { color: C.soft }, line: { color: C.soft } });
    slide.addShape(pptx.shapes.RECTANGLE, { x: MX, y, w: 0.07, h, fill: { color: C.blue }, line: { color: C.blue } });
    slide.addText(text, { x: MX + 0.25, y, w: W - 2 * MX - 0.4, h, fontFace: font, fontSize: 13, color: C.text, valign: "middle", fit: "shrink" });
  }
  const tone = (t) => ({ good: [C.green, C.greenSoft], bad: [C.red, C.redSoft], warn: [C.amber, C.amberSoft] }[t] || [C.blue, C.soft]);

  return {
    pptx, C, font,

    cover({ kicker = "", title, subtitle = "", meta = "" }) {
      const s = pptx.addSlide(); base(s, { dark: true });
      s.addShape(pptx.shapes.RECTANGLE, { x: MX, y: 2.2, w: 0.12, h: 2.2, fill: { color: C.blue }, line: { color: C.blue } });
      if (kicker) s.addText(kicker, { x: MX + 0.4, y: 2.1, w: 11, h: 0.4, fontFace: font, fontSize: 16, bold: true, color: C.blue2 });
      s.addText(title, { x: MX + 0.4, y: 2.5, w: 11.5, h: 1.2, fontFace: font, fontSize: 40, bold: true, color: C.white, valign: "top", fit: "shrink" });
      if (subtitle) s.addText(subtitle, { x: MX + 0.4, y: 3.7, w: 11.5, h: 0.7, fontFace: font, fontSize: 18, color: "CBD5E1", valign: "top" });
      if (meta) s.addText(meta, { x: MX + 0.4, y: H - 1.1, w: 11.5, h: 0.4, fontFace: font, fontSize: 13, color: "94A3B8" });
      if (opts.note) s.addText(opts.note, { x: W - 4.6, y: H - 1.1, w: 4, h: 0.4, fontFace: font, fontSize: 11, color: "94A3B8", align: "right" });
      return s;
    },

    section({ number = "", title, subtitle = "" }) {
      const s = pptx.addSlide(); base(s, { dark: true });
      if (number) s.addText(number, { x: MX, y: 2.0, w: 3, h: 1.2, fontFace: font, fontSize: 60, bold: true, color: C.blue2 });
      s.addText(title, { x: MX, y: 3.2, w: 12, h: 0.9, fontFace: font, fontSize: 34, bold: true, color: C.white });
      if (subtitle) s.addText(subtitle, { x: MX, y: 4.1, w: 12, h: 0.6, fontFace: font, fontSize: 16, color: "CBD5E1" });
      return s;
    },

    // 큰 숫자 카드 2~4개. tone: good | bad | warn | (기본)
    kpis({ kicker, title, cards, note, src }) {
      const s = pptx.addSlide(); base(s); head(s, title, kicker);
      const k = cards.length, gap = 0.3, cw = (W - 2 * MX - gap * (k - 1)) / k, y = 1.75, ch = 2.6;
      cards.forEach((c, i) => {
        const x = MX + i * (cw + gap), [fg, bg] = tone(c.tone);
        s.addShape(pptx.shapes.RECTANGLE, { x, y, w: cw, h: ch, fill: { color: C.white }, line: { color: C.line, width: 1 } });
        s.addShape(pptx.shapes.RECTANGLE, { x, y, w: cw, h: 0.08, fill: { color: fg }, line: { color: fg } });
        s.addText(c.label, { x: x + 0.3, y: y + 0.3, w: cw - 0.6, h: 0.4, fontFace: font, fontSize: 14, color: C.sub, bold: true });
        s.addText(c.value, { x: x + 0.3, y: y + 0.75, w: cw - 0.6, h: 1.0, fontFace: font, fontSize: 40, bold: true, color: C.ink, fit: "shrink" });
        if (c.sub) {
          s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: x + 0.3, y: y + 1.85, w: cw - 0.6, h: 0.45, fill: { color: bg }, line: { color: bg }, rectRadius: 0.08 });
          s.addText(c.sub, { x: x + 0.4, y: y + 1.85, w: cw - 0.8, h: 0.45, fontFace: font, fontSize: 12, color: fg, bold: true, valign: "middle", fit: "shrink" });
        }
      });
      noteBox(s, note, 4.75, 1.0); source(s, src);
      return s;
    },

    // type: line | bar | barH | stacked. target: 기준선 값(선 차트에 점선 계열로 추가)
    chart({ kicker, title, type = "bar", categories, series, unit = "", target, targetLabel = "기준", min, max, note, src, side }) {
      const s = pptx.addSlide(); base(s); head(s, title, kicker);
      const data = series.map((sr) => ({ name: sr.name, labels: categories, values: sr.values }));
      const colors = series.map((sr, i) => sr.color || C.series[i % C.series.length]);
      if (target !== undefined && type === "line") { data.push({ name: targetLabel, labels: categories, values: categories.map(() => target) }); colors.push(C.red); }
      const cw = side ? 8.3 : W - 2 * MX;
      const t = { line: pptx.charts.LINE, bar: pptx.charts.BAR, barH: pptx.charts.BAR, stacked: pptx.charts.BAR }[type];
      const o = {
        x: MX, y: 1.6, w: cw, h: note ? 3.9 : 4.8, chartColors: colors, fontFace: font,
        catAxisLabelFontFace: font, valAxisLabelFontFace: font, legendFontFace: font, dataLabelFontFace: font,
        catAxisLabelFontSize: 12, valAxisLabelFontSize: 11, catAxisLabelColor: C.text, valAxisLabelColor: C.sub,
        valGridLine: { color: C.line, size: 0.75 }, catGridLine: { style: "none" },
        catAxisLineShow: true, valAxisLineShow: false,
        showLegend: data.length > 1, legendPos: "t", legendFontSize: 12, legendColor: C.text,
        valAxisLabelFormatCode: unit === "%" ? "0.0" : "#,##0",
      };
      if (min !== undefined) o.valAxisMinVal = min;
      if (max !== undefined) o.valAxisMaxVal = max;
      if (type === "line") Object.assign(o, { lineSize: 2.5, lineDataSymbol: "circle", lineDataSymbolSize: 7, showValue: false });
      if (type !== "line") Object.assign(o, { barDir: type === "barH" ? "bar" : "col", barGapWidthPct: 60, showValue: true, dataLabelFontSize: 11, dataLabelColor: C.text, dataLabelFormatCode: unit === "%" ? "0.00" : "#,##0" });
      if (type === "stacked") Object.assign(o, { barGrouping: "stacked", showValue: false });
      s.addChart(t, data, o);
      if (side) {
        const sx = MX + cw + 0.3, sw = W - MX - sx;
        s.addShape(pptx.shapes.RECTANGLE, { x: sx, y: 1.6, w: sw, h: note ? 3.9 : 4.8, fill: { color: C.soft }, line: { color: C.soft } });
        s.addText(side.title || "읽는 법", { x: sx + 0.25, y: 1.75, w: sw - 0.5, h: 0.4, fontFace: font, fontSize: 14, bold: true, color: C.ink });
        s.addText(side.bullets.map((b) => ({ text: b, options: { bullet: { indent: 14 }, breakLine: true } })), { x: sx + 0.25, y: 2.2, w: sw - 0.5, h: (note ? 3.9 : 4.8) - 0.8, fontFace: font, fontSize: 13, color: C.text, valign: "top", paraSpaceAfter: 6, fit: "shrink" });
      }
      noteBox(s, note, 5.65, 0.75); source(s, src);
      return s;
    },

    // columns: ["로트", "라인", ...], rows: [[...]], highlightRows: [index], align: ["left","center",...]
    table({ kicker, title, columns, rows, highlightRows = [], align = [], colW, note, src, fontSize = 13 }) {
      const s = pptx.addSlide(); base(s); head(s, title, kicker);
      const hdr = columns.map((c, i) => ({ text: c, options: { bold: true, color: C.white, fill: { color: C.navy }, align: align[i] || "left" } }));
      const body = rows.map((r, ri) => r.map((v, ci) => ({ text: String(v), options: { color: C.ink, fill: { color: highlightRows.includes(ri) ? C.redSoft : ri % 2 ? C.soft : C.white }, bold: highlightRows.includes(ri) && ci === 0, align: align[ci] || "left" } })));
      const rh = rows.length <= 5 ? 0.62 : rows.length <= 8 ? 0.48 : 0.4;
      const fs = rows.length <= 5 ? Math.max(fontSize, 16) : fontSize;
      s.addTable([hdr, ...body], { x: MX, y: 1.65, w: W - 2 * MX, colW, fontFace: font, fontSize: fs, border: { type: "solid", pt: 0.5, color: C.line }, rowH: rh, valign: "middle", margin: 0.1 });
      const y = Math.min(1.65 + rh * (rows.length + 1) + 0.35, 5.6);
      noteBox(s, note, y, 0.75); source(s, src);
      return s;
    },

    // 좌우 비교 또는 요점 2단. left/right: { heading, bullets, tone }
    twoCol({ kicker, title, left, right, note, src }) {
      const s = pptx.addSlide(); base(s); head(s, title, kicker);
      [left, right].forEach((c, i) => {
        const x = MX + i * 6.2, w = 5.9, [fg] = tone(c.tone);
        s.addShape(pptx.shapes.RECTANGLE, { x, y: 1.65, w, h: 3.9, fill: { color: C.white }, line: { color: C.line, width: 1 } });
        s.addShape(pptx.shapes.RECTANGLE, { x, y: 1.65, w, h: 0.08, fill: { color: fg }, line: { color: fg } });
        s.addText(c.heading, { x: x + 0.3, y: 1.9, w: w - 0.6, h: 0.5, fontFace: font, fontSize: 18, bold: true, color: C.ink });
        s.addText(c.bullets.map((b) => ({ text: b, options: { bullet: { indent: 16 }, breakLine: true } })), { x: x + 0.3, y: 2.5, w: w - 0.6, h: 2.9, fontFace: font, fontSize: 15, color: C.text, valign: "top", paraSpaceAfter: 8, fit: "shrink" });
      });
      noteBox(s, note, 5.8, 0.7); source(s, src);
      return s;
    },

    // 조치·할 일 목록. items: [{ text, owner, due, status }] status: 완료 | 진행 중 | 예정 | 지연
    actions({ kicker, title, items, note, src }) {
      const s = pptx.addSlide(); base(s); head(s, title, kicker);
      const st = { "완료": [C.green, C.greenSoft], "진행 중": [C.blue, "DBEAFE"], "예정": [C.sub, C.soft], "지연": [C.red, C.redSoft] };
      const rh = Math.min(0.62, 4.2 / items.length);
      items.forEach((it, i) => {
        const y = 1.7 + i * rh, [fg, bg] = st[it.status] || st["예정"];
        s.addShape(pptx.shapes.LINE, { x: MX, y: y + rh, w: W - 2 * MX, h: 0, line: { color: C.line, width: 0.75 } });
        s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: MX, y: y + 0.12, w: 1.2, h: rh - 0.24, fill: { color: bg }, line: { color: bg }, rectRadius: 0.06 });
        s.addText(it.status, { x: MX, y: y + 0.12, w: 1.2, h: rh - 0.24, fontFace: font, fontSize: 12, bold: true, color: fg, align: "center", valign: "middle" });
        s.addText(it.text, { x: MX + 1.45, y, w: 7.4, h: rh, fontFace: font, fontSize: 14, color: C.ink, valign: "middle", fit: "shrink" });
        s.addText(it.owner || "", { x: MX + 9.0, y, w: 1.8, h: rh, fontFace: font, fontSize: 13, color: C.text, valign: "middle" });
        s.addText(it.due || "", { x: MX + 10.8, y, w: 1.3, h: rh, fontFace: font, fontSize: 13, color: C.sub, valign: "middle", align: "right" });
      });
      noteBox(s, note, 5.95, 0.6); source(s, src);
      return s;
    },


    // 한 장 보고: 위쪽 숫자 카드 2~4개 + 아래 3단(상황 · 의미 · 다음 조치)
    onePager({ kicker, title, cards = [], columns = [], src }) {
      const s = pptx.addSlide(); base(s); head(s, title, kicker);
      const k = cards.length || 1, gap = 0.25, cw = (W - 2 * MX - gap * (k - 1)) / k, y = 1.6, ch = 1.55;
      cards.forEach((c, i) => {
        const x = MX + i * (cw + gap), [fg, bg] = tone(c.tone);
        s.addShape(pptx.shapes.RECTANGLE, { x, y, w: cw, h: ch, fill: { color: C.white }, line: { color: C.line, width: 1 } });
        s.addShape(pptx.shapes.RECTANGLE, { x, y, w: 0.08, h: ch, fill: { color: fg }, line: { color: fg } });
        s.addText(c.label, { x: x + 0.3, y: y + 0.15, w: cw - 0.5, h: 0.35, fontFace: font, fontSize: 12, bold: true, color: C.sub });
        s.addText(c.value, { x: x + 0.3, y: y + 0.45, w: cw - 0.5, h: 0.65, fontFace: font, fontSize: 30, bold: true, color: C.ink, fit: "shrink" });
        if (c.sub) s.addText(c.sub, { x: x + 0.3, y: y + 1.08, w: cw - 0.5, h: 0.35, fontFace: font, fontSize: 11, bold: true, color: fg, fit: "shrink" });
      });
      const n = columns.length || 1, g2 = 0.25, w2 = (W - 2 * MX - g2 * (n - 1)) / n, y2 = 3.4, h2 = 3.0;
      columns.forEach((c, i) => {
        const x = MX + i * (w2 + g2), [fg] = tone(c.tone);
        s.addShape(pptx.shapes.RECTANGLE, { x, y: y2, w: w2, h: h2, fill: { color: C.soft }, line: { color: C.soft } });
        s.addText(c.heading, { x: x + 0.25, y: y2 + 0.15, w: w2 - 0.5, h: 0.45, fontFace: font, fontSize: 16, bold: true, color: fg === C.blue ? C.ink : fg });
        s.addText(c.bullets.map((b) => ({ text: b, options: { bullet: { indent: 14 }, breakLine: true } })), { x: x + 0.25, y: y2 + 0.65, w: w2 - 0.5, h: h2 - 0.8, fontFace: font, fontSize: 15, color: C.text, valign: "top", paraSpaceAfter: 6, fit: "shrink" });
      });
      source(s, src);
      return s;
    },

    // 마지막 장: 요약 문장 2~4개
    closing({ title = "정리", points = [], ask }) {
      const s = pptx.addSlide(); base(s, { dark: true });
      s.addText(title, { x: MX, y: 0.9, w: 12, h: 0.8, fontFace: font, fontSize: 30, bold: true, color: C.white });
      points.forEach((p, i) => {
        const y = 2.0 + i * 1.0;
        s.addText(String(i + 1), { x: MX, y, w: 0.6, h: 0.6, fontFace: font, fontSize: 22, bold: true, color: C.blue2 });
        s.addText(p, { x: MX + 0.8, y, w: 11.2, h: 0.8, fontFace: font, fontSize: 18, color: C.white, valign: "top", fit: "shrink" });
      });
      if (ask) s.addText(ask, { x: MX, y: H - 1.3, w: 12, h: 0.6, fontFace: font, fontSize: 15, color: C.blue2, bold: true });
      return s;
    },

    async save(file) { await pptx.writeFile({ fileName: file }); return file; },
  };
}

module.exports = { create, C };
