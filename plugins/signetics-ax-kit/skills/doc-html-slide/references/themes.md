# 기본 테마 3종

사용자 브랜드나 회사 디자인 가이드가 없을 때 고르는 기본 테마입니다. 특정 회사의 브랜드를 흉내 내지 않은 중립 테마이며, 한국어 서체는 Pretendard(OFL)를 씁니다. 회사 PC에서 웹 서체를 못 불러오면 맑은 고딕으로 대체됩니다.

`doc-pptx`의 deck_kit.js 기본 디자인과 `light-report` 테마는 같은 색을 써서, HTML 슬라이드와 PPT를 함께 만들어도 모양이 맞습니다.

## light-report (기본) — 회의실 프로젝터용 밝은 보고서

| 역할 | 값 |
|---|---|
| canvas | `#FFFFFF` |
| surface | `#F1F5F9` |
| ink | `#0F172A` |
| text | `#334155` |
| muted | `#64748B` |
| line | `#E2E8F0` |
| primary | `#2563EB` |
| dark (표지·구분 장) | `#1E293B` |
| good / warn / bad | `#15803D` / `#B45309` / `#DC2626` |
| 차트 계열 | `#2563EB` `#0F766E` `#F59E0B` `#7C3AED` `#DB2777` `#64748B` |

- 표지와 구분 장은 dark 배경, 나머지는 흰 배경에 위쪽 primary 띠 6px
- 제목은 결론 문장, 40px Bold. 본문 32px 이상(투사 기준 24pt)
- 숫자 카드: 흰 카드 + 위쪽 색 띠 + 상태 배지(good/warn/bad)
- 경고·미달 값만 bad 색. 나머지 강조는 primary 한 가지

## warm-editorial — 경영 보고·읽는 자료

| 역할 | 값 |
|---|---|
| canvas | `#FAFAF7` |
| surface | `#F2F0EA` |
| ink | `#1C1917` |
| text | `#44403C` |
| muted | `#78716C` |
| line | `#E7E5E4` |
| primary | `#166534` |
| accent | `#C2410C` |

- 넓은 여백, 큰 숫자, 얇은 구분선. 장식 도형 최소화
- 표지 제목 64px, 본문 32px

## dark-engineering — 데이터·기술 공유

| 역할 | 값 |
|---|---|
| canvas | `#0B1220` |
| surface | `#111A2E` |
| ink | `#F8FAFC` |
| text | `#CBD5E1` |
| muted | `#94A3B8` |
| line | `#1E293B` |
| primary | `#38BDF8` |
| accent | `#FACC15` |

- 조명을 낮출 수 있는 회의실이나 화면 공유용. 밝은 강의장 투사에는 light-report를 쓴다
- 차트 격자선은 line 색, 데이터 계열은 primary·accent·`#A78BFA`·`#34D399`
