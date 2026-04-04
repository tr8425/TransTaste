# TransTaste 개발 로그
> 2026-04-03 세션 7

---

## 세션 요약

세션 6 인계서 기반 3개 태스크 수행: 온보딩 통화 설정, 타입 통합, 회화 콘텐츠 확장.

**변경**: 8 modified files, +460 / -62 lines

---

## 작업 내역

### 1. 온보딩 `home_currency` 설정 추가
- `src/app/onboarding/page.tsx` — Step 2에 12개 통화 선택 그리드 (KRW, USD, EUR, GBP, JPY, CNY, THB, VND, TWD, SGD, AUD, CAD)
- `src/app/profile/page.tsx` — Language Settings 섹션에 홈 통화 드롭다운 추가, `UserSettings` 인터페이스에 `home_currency: string` 추가
- `src/lib/i18n/en.json`, `ko.json` — `onboarding.homeCurrency`, `onboarding.homeCurrencyHint`, `profile.homeCurrency`, `profile.homeCurrencyDesc`, `profile.noCurrency` 키 추가
- 환율 토글(`useExchangeRate`)이 `settings.home_currency`를 읽으므로, 이제 온보딩 완료 시 환율 변환 즉시 작동

### 2. Dish vs DishLite 타입 통합
- `src/lib/types.ts`:
  - `Dish` 인터페이스 삭제 (legacy, 40줄)
  - `MenuAnalysisResultLite` 인터페이스 삭제 (DishLite 기반, 이제 중복)
  - `MenuAnalysisResult.dishes` 타입: `Dish[]` → `DishLite[]`
  - `AnalysisResponse` 유니온에서 `MenuAnalysisResultLite` 제거
- `src/app/results/page.tsx` — `as unknown as DishLite` 캐스트 제거 → 직접 접근
- `src/app/api/analyze/route.ts` — `as unknown as MenuAnalysisResult` → `satisfies MenuAnalysisResult`
- 기술 부채 -57줄, 타입 안전성 향상

### 3. 회화 expectedResponses es/fr/it 추가
- `src/lib/phrases-data.ts` — 32개 phrase의 expectedResponses에 스페인어/프랑스어/이탈리아어 서버 응답 추가 (+354줄)
- 각 언어별 1-2개 자연스러운 레스토랑 응답 (colloquial, not textbook)
- 기존 ja/zh/th/vi/en 뒤에 es/fr/it 블록 추가

---

## 배포

- 로컬 빌드: 성공 (next build 통과)
- Vercel: `deploy_failed` 반복 — 빌드 시작 전 실패 (0ms), Vercel 플랫폼 이슈 추정
- 이전 성공 배포: 2026-03-28 (5일 전)
- **조치 필요**: Vercel 대시보드에서 빌드 로그 확인 필요

---

## Handoff — 미착수 항목

### 인프라
| 항목 | 설명 |
|------|------|
| Vercel 배포 에러 해결 | 대시보드에서 빌드 로그 확인, 무료 플랜 한도 또는 설정 문제 |
| `EXCHANGE_RATE_API_KEY` 환경변수 | 무료 fallback은 있지만 프로덕션에선 유료 키 권장 |
| 서버 크레딧 검증 | 현재 클라이언트 localStorage — Supabase Auth + RLS 필요 |

### Phase 4 (v3 장기)
| 항목 | 난이도 |
|------|--------|
| 영수증 번역 파이프라인 | 중 |
| 원문-번역 비교 split-view | 중 |
| 칼로리 추정치 | 하 |

### 기술 부채
| 항목 | 설명 |
|------|------|
| phrases-data.ts 1700줄+ | 언어별 JSON 분리 고려 (이번 세션에서 354줄 추가로 더 커짐) |
