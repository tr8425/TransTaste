---
name: build-check
description: /build-check 로 빌드 + 린트 + 페이지 크기를 빠르게 점검한다.
---

다음을 순서대로 실행하고 결과를 요약해줘:

1. `npm run lint` — ESLint 경고/에러 확인
2. `npm run build` — 프로덕션 빌드 성공 여부 + 페이지별 크기 확인
3. 문제가 있으면 원인과 수정 방향 제시, 없으면 "빌드 정상" 한 줄 요약
