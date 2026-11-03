# 시그네틱스 AX 키트

시그네틱스 심화과정에서 쓰는 Claude 업무 스킬 16개 모음입니다. 주간 품질보고 PPT, 보고서 숫자 검수, 사실·추정 점검, 불량 현황 보고, 설비 데이터 점검, 엑셀·워드·PPT·PDF 작성, 회의록, 임원 보고 요약, 문장 다듬기, 내 업무 스킬 만들기를 한 번에 설치할 수 있습니다.

[모두의 코워크(modu-ai/moai-cowork)](https://github.com/modu-ai/moai-cowork)의 스킬 일부를 골라 시그네틱스 업무에 맞게 고쳤고, 4차시 실습 스킬을 더했습니다. 바꾼 내용은 [CHANGES.md](CHANGES.md)에 있습니다.

## 설치

Claude 앱의 대화 화면(또는 Cowork)에서 쓰는 것을 권합니다. 문서를 클라우드에서 만들기 때문에 PC에 따로 설치할 프로그램이 없습니다.

### 방법 1. 저장소 주소로 설치

1. Claude 앱 왼쪽 메뉴에서 **Customize**를 엽니다.
2. **Plugins** → **Add** → **Add marketplace** → **Add from a repository**를 차례로 누릅니다.
3. 주소 칸에 `jaehyun-git-hub/signetics-ax-kit` 를 입력합니다.
4. 목록에 나온 **signetics-ax-kit** 플러그인을 **Add**(설치)합니다.
5. 새 대화를 열고 "주간 품질보고 PPT 만들어 줘"처럼 요청하거나, 입력창에 `/`를 쳐서 스킬 이름을 확인합니다.

회사망에서 GitHub 접속이 막혀 있거나 조직 설정으로 외부 저장소가 막혀 있으면 이 방법은 실패합니다. 그때는 방법 2를 쓰십시오.

### 방법 2. zip 파일 올리기

1. 이 저장소의 [`dist/signetics-ax-kit.zip`](dist/signetics-ax-kit.zip)을 내려받습니다.
2. **Customize** → **Plugins** → **Add**에서 플러그인 파일을 올리는 메뉴를 고르고 zip 파일을 선택합니다. 메뉴 이름은 앱 버전에 따라 다를 수 있습니다.

### Claude Code(터미널)에서 쓸 때

```
/plugin marketplace add jaehyun-git-hub/signetics-ax-kit
/plugin install signetics-ax-kit@signetics-ax
```

## 들어 있는 스킬

| 스킬 | 하는 일 | 요청 예 |
|---|---|---|
| `weekly-quality-report` | 테스트 결과 CSV로 회사 양식 주간 품질보고 PPT 만들기 | "/weekly-quality-report 테스트결과_week43_전체.csv" |
| `fact-estimate-check` | 문장을 [사실]·[추정]으로 나누고 원인 단정 문장 고치기 | "이 경위서에서 단정한 문장 찾아 줘" |
| `doc-data-audit` | 보고서·PPT·엑셀 숫자를 원자료와 대조 | "이 보고서 숫자가 원본 CSV와 맞는지 검수해 줘" |
| `data-explorer` | CSV·엑셀 구조, 빠진 값, 이상한 값 점검 | "설비 로그에 빠진 값이 있는지 확인해 줘" |
| `data-visualizer` | 차트·대시보드(HTML) 만들기 | "라인별 수율 추이 차트 만들어 줘" |
| `doc-pptx` | PPT 만들기 (기본 디자인 키트 포함) | "10월 품질 리뷰 PPT 만들어 줘" |
| `doc-html-slide` | 브라우저에서 여는 발표 슬라이드 HTML | "품질 리뷰를 HTML 발표 슬라이드로" |
| `doc-xlsx` | 엑셀 만들기 | "로트별 수율과 검산 시트를 엑셀로" |
| `doc-docx` | 워드 만들기 (기본 디자인 키트 포함) | "8D 보고서 1차 회신 초안을 워드로" |
| `doc-pdf` | PDF 만들기·변환 | "이 보고서를 PDF로" |
| `collab-status-report` | 주간·월간 현황 보고서 | "10월 공정별 불량 현황 보고서 써 줘" |
| `collab-meeting` | 회의 준비와 회의록 | "회의 메모를 회의록과 할 일 표로 정리해 줘" |
| `collab-exec-summary` | 임원 보고용 요약 | "임원 보고용으로 한 장 요약해 줘" |
| `ai-slop-reviewer` | AI 투 문장과 과장 표현 고치기 | "고객 회신 메일에서 AI 티 나는 부분 고쳐 줘" |
| `meta-skill-builder` | 내 반복 업무를 새 스킬로 만들기 | "내 업무를 스킬로 만들고 싶어, 질문해 줘" |
| `meta-skill-tester` | 만든 스킬 테스트 | "방금 만든 스킬을 테스트할 요청 예시 만들어 줘" |

## 활용 예제

[`examples/`](examples/README.md) 폴더에 예제 7개와 교육용 가상 데이터가 있습니다. 품질 리뷰 PPT, HTML 발표 슬라이드, 8D 보고서 워드, 임원 보고 한 장, 대시보드, 엑셀 리포트, 내 업무 스킬 만들기를 따라 할 수 있습니다. 예제 폴더의 파일을 대화에 첨부하고 `사용법.md`의 요청을 붙여 넣으면 됩니다.

## 쓰기 전에 확인할 것

- 예제 데이터는 모두 교육용 가상 데이터입니다. 실제 시그네틱스 숫자가 아닙니다.
- 실제 업무 파일을 올리기 전에 회사 보안 기준을 먼저 확인하십시오. 대화 화면과 Cowork는 파일을 클라우드에서 처리합니다.
- 고객에게 나가는 문서의 원인 확정, 담당자, 서명은 사람이 정합니다. 스킬은 초안과 점검까지만 돕습니다.

## 라이선스와 출처

- Apache License 2.0. [LICENSE](LICENSE), [NOTICE](NOTICE)를 보십시오.
- 원본: [modu-ai/moai-cowork](https://github.com/modu-ai/moai-cowork). 이 저장소는 modu-ai와 제휴하거나 보증받은 배포본이 아닙니다. "모두의 코워크"·"MoAI" 상표는 modu-ai의 것입니다.
- 이 플러그인으로 만든 문서의 권리는 사용자에게 있습니다. [LICENSE-OUTPUT.md](LICENSE-OUTPUT.md)를 보십시오.
