# TransTaste 세션 9 — 전체 QA + 수정
> 2026-04-08

---

## 세션 요약

에이전트 3종 병렬 QA (빌드/린트, i18n, 코드품질/보안) 실행 후 우선도순 수정 완료.

---

## QA 결과 요약

| 영역 | 결과 |
|------|------|
| TypeScript 타입 에러 | 0건 |
| ESLint 에러 | 1건 → 수정 완료 |
| 빌드 | 실패 → **통과** |
| ko/en JSON 동기화 | 완벽 (483줄 일치) |
| 하드코딩 텍스트 | 높음 2건 (privacy/terms), 중간 1건 (FlavorRadar) → FlavorRadar 수정 완료 |
| 보안 | API 키 localStorage 평문 저장 (Phase 1 한계, 인지) |
| console.log | 24건 중 디버그용 8건 제거 |
| any 타입 | 0건 |
| TODO/FIXME | 0건 |

---

## 수정 내역

### 1. 빌드 차단 해소 — `SYSTEM_PROMPT` 제거
- `src/lib/ai/claude.ts` — 미사용 `SYSTEM_PROMPT` 변수 (~236줄) 삭제
- 2-Phase 분리 후 남아있던 dead code, 유일한 ESLint 에러이자 빌드 실패 원인

### 2. 민감 데이터 로깅 제거
- `src/lib/ai/claude.ts` — 디버그용 `console.log` 8건 제거
  - API 응답 본문 출력 (first 500, last 200, length)
  - stop_reason, streaming 시작/완료 로그
- `console.error` (파서 에러, API 에러 등)는 운영 디버깅용으로 유지

### 3. FlavorRadar i18n 적용
- `src/components/dish/FlavorRadar.tsx` — `FLAVOR_LABELS` 하드코딩 → `t('flavor.*')` i18n 키 사용
- `src/lib/constants.ts` — 미사용 `FLAVOR_LABELS` export 삭제
- ko.json `flavor.*` 키 활용: 단맛/짠맛/매운맛/신맛/감칠맛/고소함

### 4. `validateDishDetail()` 함수 추가
- `src/lib/ai/claude.ts` — DishDetail 필수 필드(flavor_profile, ingredients.core) 검증
- 워킹 카피에 호출 코드만 있고 함수 정의가 누락된 상태였음

---

## 미수정 (인지 항목)

| 항목 | 상태 | 비고 |
|------|------|------|
| privacy/terms 페이지 영어 하드코딩 | 보류 | 법률 텍스트 i18n 여부 결정 필요 |
| tip-culture-data 영어 콘텐츠 | 보류 | i18n Phase 2 범위 |
| API 키 localStorage 평문 저장 | 인지 | Phase 1 한계, 서버사이드 세션 저장으로 개선 예정 |
| results/page.tsx exhaustive-deps 억제 3건 | 인지 | 리팩터링 시 검토 |

---

## 세션 8 미커밋 변경 (같이 포함)

- `src/app/travel/page.tsx` — menu_language 키 수정
- `src/app/tip-culture/page.tsx` — menu_language 키 수정
- `.claude/skills/i18n-conventions.md` — 2단계 네이밍 정정
- `public/manifest.json` — PWA 설정 업데이트
- `src/app/sitemap.ts` — sitemap 업데이트
- `src/app/icon.tsx`, `apple-icon.tsx`, `opengraph-image.tsx`, `twitter-image.tsx` — 동적 이미지 생성
