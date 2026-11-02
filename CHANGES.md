# 원본에서 바꾼 내용

원본: [modu-ai/moai-cowork](https://github.com/modu-ai/moai-cowork) v1.2.8 (Apache-2.0)

## 가져온 스킬
- moai-officer: doc-pptx, doc-xlsx, doc-docx, doc-pdf, doc-data-audit
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
