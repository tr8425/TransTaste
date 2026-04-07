---
name: i18n-audit
description: /i18n-audit 로 ko/en JSON 키 동기화 상태와 하드코딩 텍스트를 점검한다.
---

i18n-worker 에이전트를 사용하여 다음을 점검해줘:

1. `src/lib/i18n/ko.json`과 `src/lib/i18n/en.json`의 키 비교
   - ko에만 있는 키
   - en에만 있는 키
   - 값이 빈 문자열인 키
2. `src/app/` 및 `src/components/`에서 `t('` 를 사용하지 않고 하드코딩된 한국어/영어 텍스트 탐지
3. 결과를 테이블로 정리하고 우선 수정 대상 제시
