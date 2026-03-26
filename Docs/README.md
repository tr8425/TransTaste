# Transtaste - Claude Vision POC

메뉴 인식 품질 및 API 비용 검증용 테스트 스크립트

## 설치

```bash
npm install
```

## 실행

### 1. 텍스트 테스트 (한/중/일/태/혼합 메뉴 5종 자동 실행)
```bash
ANTHROPIC_API_KEY=sk-ant-... node test-menu.mjs
```

### 2. 이미지 파일 테스트
```bash
ANTHROPIC_API_KEY=sk-ant-... node test-menu.mjs ./menu.jpg
```

### 3. 이미지 URL 테스트
```bash
ANTHROPIC_API_KEY=sk-ant-... node test-menu.mjs https://example.com/menu.jpg
```

## 검증 포인트

| 항목 | 기준 |
|---|---|
| JSON 파싱 성공률 | 5/5 통과 목표 |
| 응답 시간 | 신규 분석 < 5초 목표 |
| 번역 품질 | literal + meaning 둘 다 정확한가 |
| fun_fact 품질 | 진짜 흥미로운가, 제네릭하지 않은가 |
| 알러지 정확도 | 오탐/누락 없는가 |
| 비용 | 회당 $0.02 이하 목표 |

## 테스트 메뉴 포함 언어

- 🇰🇷 한국어 (불도장, 삼겹살 등)
- 🇯🇵 일본어 (천ぷら, とんこつラーメン 등)
- 🇨🇳 중국어 (佛跳墙, 夫妻肺片 등)
- 🇹🇭 태국어 (ผัดไทย, ต้มยำกุ้ง 등)
- 🌍 혼합 (베트남/한국/태국/싱가포르 섞인 메뉴)
