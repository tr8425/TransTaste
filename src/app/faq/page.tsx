"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

interface FaqEntry {
  q: string;
  a: string;
}

const FAQ_EN: FaqEntry[] = [
  {
    q: "What does TransTaste actually do?",
    a: "Scan or paste a foreign menu and TransTaste analyses every dish — translation, allergens, flavor profile, estimated calories, and cultural dining context. It also bundles a restaurant phrasebook for 8 languages and tipping guides for 30+ countries.",
  },
  {
    q: "How much does it cost?",
    a: "TransTaste is currently validating 3-day, 7-day, and 30-day trip-pass concepts. The prices shown in the app are research hypotheses only: checkout is disabled and no payment is taken. Beta users receive a small cumulative scan allowance, which may change as analysis costs are measured.",
  },
  {
    q: "Can I trust the allergen warnings?",
    a: "Allergen flags are AI-generated estimates meant for reference. Always confirm with restaurant staff before ordering — especially if you have a life-threatening allergy. TransTaste is not a medical device.",
  },
  {
    q: "Does it work offline?",
    a: "Menu scanning requires an internet connection because analysis runs on Anthropic's Claude API. The phrasebook and country guides do work offline once you've opened them.",
  },
  {
    q: "Which languages are supported?",
    a: "The core product UI currently supports English, Korean, and Japanese as its launch-quality set. Additional menu and phrasebook languages remain available in beta and require language-specific review before public launch.",
  },
  {
    q: "How is my data used?",
    a: "In a real-analysis environment, menu images are sent to the configured AI provider for processing. TransTaste does not retain the original image by default. Structured results and essential operational logs follow separate retention rules; model-improvement use requires explicit opt-in.",
  },
];

const FAQ_KO: FaqEntry[] = [
  {
    q: "TransTaste는 어떤 서비스인가요?",
    a: "외국 식당 메뉴를 스캔하거나 붙여넣으면 AI가 요리별 번역, 알레르기, 맛 프로필, 칼로리 추정, 문화적 맥락을 분석해 드립니다. 8개 언어 회화집과 30개국 이상의 팁 가이드도 함께 제공됩니다.",
  },
  {
    q: "비용은 어떻게 되나요?",
    a: "현재 3일·7일·30일 여행 패스의 상품성을 검증하고 있습니다. 앱에 표시된 가격은 조사용 가설이며 결제 기능은 비활성화되어 실제 청구가 발생하지 않습니다. 베타 사용자에게는 분석 원가 측정에 따라 변경될 수 있는 소량의 누적 무료 스캔을 제공합니다.",
  },
  {
    q: "알레르기 경고를 신뢰해도 되나요?",
    a: "알레르기 표시는 AI가 생성한 참고용 정보입니다. 주문 전에는 반드시 식당 직원에게 확인하세요. 생명에 영향을 줄 수 있는 알레르기가 있는 경우 특히 중요합니다. TransTaste는 의료기기가 아닙니다.",
  },
  {
    q: "오프라인에서도 사용할 수 있나요?",
    a: "메뉴 분석은 Anthropic Claude API를 통해 이뤄지므로 인터넷 연결이 필요합니다. 회화집과 국가별 가이드는 한 번 열어둔 이후라면 오프라인에서도 확인할 수 있습니다.",
  },
  {
    q: "어떤 언어를 지원하나요?",
    a: "핵심 제품 UI는 영어·한국어·일본어를 우선 출시 품질 범위로 지원합니다. 그 밖의 메뉴·회화 언어는 베타로 제공하며 공개 출시 전 언어별 검수가 필요합니다.",
  },
  {
    q: "내 데이터는 어떻게 사용되나요?",
    a: "실제 분석 환경에서는 메뉴 이미지가 설정된 AI 제공자에게 전송되어 처리되며 TransTaste는 원본 이미지를 기본적으로 보존하지 않습니다. 구조화 결과와 필수 운영 로그는 별도 보존 정책을 따르고, 모델 개선 활용은 명시적 동의를 받은 경우에만 허용합니다.",
  },
];

function FaqList({ entries }: { entries: FaqEntry[] }) {
  return (
    <div className="space-y-4">
      {entries.map((entry, i) => (
        <details
          key={i}
          className="group bg-cream-dark rounded-xl px-4 py-3 open:pb-4"
        >
          <summary className="flex items-start justify-between gap-3 cursor-pointer list-none select-none">
            <span className="text-sm font-semibold text-brown-dark leading-snug">
              {entry.q}
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#A1825F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0 mt-0.5 transition-transform group-open:rotate-180"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </summary>
          <p className="text-sm text-brown-medium leading-relaxed mt-3">
            {entry.a}
          </p>
        </details>
      ))}
    </div>
  );
}

export default function FaqPage() {
  const { t, locale } = useTranslation();
  const entries = locale === "ko" ? FAQ_KO : FAQ_EN;

  return (
    <main className="min-h-screen bg-cream pb-28">
      <div className="mx-auto max-w-prose px-5 pb-8 pt-12">
        <p className="mengto-kicker mb-2 text-[10px] font-extrabold text-coral">Manual · questions</p>
        <h1 className="mb-2 text-3xl font-bold text-brown-dark">
          {t("faq.title")}
        </h1>
        <p className="text-sm text-brown-medium mb-8">
          {t("faq.subtitle")}
        </p>

        <FaqList entries={entries} />

        <div className="mt-8 pt-4 border-t border-brown-light/10 flex flex-wrap gap-x-4 gap-y-2">
          <Link href="/terms" className="text-sm text-coral hover:underline">
            {t("legal.linkToTerms")}
          </Link>
          <Link href="/privacy" className="text-sm text-coral hover:underline">
            {t("legal.linkToPrivacy")}
          </Link>
        </div>
      </div>
    </main>
  );
}
