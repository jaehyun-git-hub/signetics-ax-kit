# 원본에서 바꾼 내용

원본: [modu-ai/moai-cowork](https://github.com/modu-ai/moai-cowork) v1.2.8 (Apache-2.0)

## 가져온 스킬
- moai-officer: doc-pptx, doc-xlsx, doc-docx, doc-pdf, doc-data-audit, doc-html-slide
- moai-analyst: data-explorer, data-visualizer
- moai-coworker: collab-status-report, collab-meeting, collab-exec-summary, ai-slop-reviewer, meta-skill-builder, meta-skill-tester

## 바꾼 점
- 18개 플러그인 가운데 위 13개 스킬만 골라 `signetics-ax-kit` 플러그인 하나로 묶었습니다.
- 이 플러그인에 없는 다른 moai 플러그인 스킬을 가리키는 문장과 목록을 지우거나, 이 플러그인 안의 스킬 이름으로 바꿨습니다.
- 일부 스킬의 description에 반도체 후공정 품질·테스트 업무 요청 예시를 추가했습니다.
- meta-skill-builder의 예시 요청을 시그네틱스 업무 예시로 바꿨습니다.
- kordoc MCP 연결과 ChatGPT용 매니페스트(.codex-plugin)는 넣지 않았습니다.

## 새로 만든 것
- `weekly-quality-report`: 주간 테스트 결과 CSV로 회사 양식 주간 품질보고 PPT 만들기 (4차시 실습 스킬)
- `fact-estimate-check`: 문장을 [사실]·[추정]으로 나누고 원인 단정 문장 고치기
- `examples/`: 시그네틱스 업무 활용 예제 10개와 교육용 가상 데이터

## 1.1.0 (2026-11-03)
- doc-pptx에 기본 디자인 키트 `scripts/deck_kit.js` 추가 (표지, 숫자 카드, 차트, 표, 조치 현황, 마무리 장)
- doc-docx에 기본 디자인 키트 `scripts/doc_kit.py` 추가 (제목 상자, 문서 정보, [사실]·[추정] 표시 줄, 안내 상자, 서명란)
- data-visualizer, doc-xlsx에 같은 색 체계의 기본 디자인 지침 추가
- moai-officer의 doc-html-slide 추가. 외부 브랜드 디자인 시스템은 넣지 않고 자체 기본 테마 3종(light-report, warm-editorial, dark-engineering)으로 바꿈
- 활용 예제를 7개로 다시 구성 (10월 품질 리뷰 PPT, HTML 발표 슬라이드, 8D 보고서 워드, 임원 보고 한 장, 대시보드, 엑셀 리포트, 내 업무 스킬)
