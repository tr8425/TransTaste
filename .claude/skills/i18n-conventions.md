---
name: i18n-conventions
description: TransTaste i18n 규칙. 키 네이밍 3단계, ko/en JSON 동기화, useTranslation 훅 사용법. i18n 작업 시 필수 참조.
---

# Skill: i18n Conventions

## 사용하는 에이전트
- i18n-worker — 번역 키 추가/수정/동기화
- dev-maintainer — UI 텍스트 변경 시 i18n 적용 확인

## i18n 시스템 구조

```
src/lib/i18n/
  index.ts    — useTranslation() 훅, 언어 감지, 중첩 키 해석
  ko.json     — 한국어 번역
  en.json     — 영어 번역
```

- 지원 언어: `ko`, `en`
- 사용자 언어 설정: `localStorage.transtaste_user_settings.output_language`
- 훅: `const { t } = useTranslation()` → `t('section.subsection.key')`
- 점 표기법 중첩 키 지원

## 키 네이밍 규칙 (3단계)

```
[페이지/컴포넌트].[섹션].[항목]

예시:
  home.hero.title          — 홈 페이지 히어로 타이틀
  results.dish.translation  — 결과 페이지 디쉬 번역
  common.button.cancel      — 공통 버튼
  nav.tab.scan              — 네비게이션 탭
  profile.settings.language — 프로필 설정 언어
```

## 필수 규칙

1. **하드코딩 금지** — UI에 표시되는 모든 텍스트는 `t()` 사용
2. **ko/en 동기화** — 한쪽에 키를 추가하면 반드시 다른 쪽에도 추가
3. **키 추가 순서** — ko.json 먼저 → en.json 동기화 (한국어가 원본)
4. **미번역 fallback** — 키가 없으면 키 문자열 자체가 표시됨 (에러 아님)
5. **labelKey 패턴** — 컴포넌트에서 `labelKey` prop으로 번역 키를 전달하는 패턴 사용

## 번역 키 추가 절차

```
1. ko.json에 키 추가 (한국어 값)
2. en.json에 같은 키 추가 (영어 값)
3. 컴포넌트에서 t('추가한.키') 사용
4. 빌드 확인 (npm run build)
```

## 관련 파일
| 파일 | 용도 |
|------|------|
| `src/lib/i18n/index.ts` | i18n 시스템 코어 |
| `src/lib/i18n/ko.json` | 한국어 번역 |
| `src/lib/i18n/en.json` | 영어 번역 |
| `src/lib/allergen-i18n.ts` | 알레르겐 이름 i18n |
| `src/lib/phrases/` | 레스토랑 회화 (별도 시스템, 5개 언어) |
