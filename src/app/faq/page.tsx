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
    a: "Every new account gets 10 free scans. After that you can buy a Trip Pass (7 days for $2.99 or 30 days for $5.99 — unlimited scans during the trip) or a one-time 50-scan credit pack for $1.99. No subscription.",
  },
  {
    q: "Can I trust the allergen warnings?",
    a: "Allergen flags are AI-generated estimates meant for reference. Always confirm with restaurant staff before ordering — especially if you have a life-threatening allergy. TransTaste is not a medical device.",
  },
  {
    q: "Why does my Profile have an API key field?",
    a: "It's optional, for developers and power users. Paste your own Anthropic API key and your scans use that key directly instead of consuming credits. The key is stored locally in your browser and never sent to our servers.",
  },
  {
    q: "Does it work offline?",
    a: "Menu scanning requires an internet connection because analysis runs on Anthropic's Claude API. The phrasebook and country guides do work offline once you've opened them.",
  },
  {
    q: "Which languages are supported?",
    a: "Menu translation accepts photos in dozens of languages and renders results in English, Korean, Japanese, Chinese, Thai, Vietnamese, Spanish, French, or Italian. The restaurant phrasebook covers those 8 languages with pronunciation guides.",
  },
  {
    q: "How is my data used?",
    a: "Menu images are sent to Anthropic for analysis and cached briefly for performance. We don't sell or share personal data. Full details are in the Privacy Policy.",
  },
];

const FAQ_KO: FaqEntry[] = [
  {
    q: "TransTaste는 어떤 서비스인가요?",
    a: "외국 식당 메뉴를 스캔하거나 붙여넣으면 AI가 요리별 번역, 알레르기, 맛 프로필, 칼로리 추정, 문화적 맥락을 분석해 드립니다. 8개 언어 회화집과 30개국 이상의 팁 가이드도 함께 제공됩니다.",
  },
  {
    q: "비용은 어떻게 되나요?",
    a: "신규 가입 시 무료 스캔 10회를 드립니다. 이후에는 트립 패스(7일 $2.99 / 30일 $5.99 — 여행 기간 동안 무제한 스캔) 또는 50회 크레딧 팩($1.99)을 일회성으로 구매할 수 있습니다. 구독은 없습니다.",
  },
  {
    q: "알레르기 경고를 신뢰해도 되나요?",
    a: "알레르기 표시는 AI가 생성한 참고용 정보입니다. 주문 전에는 반드시 식당 직원에게 확인하세요. 생명에 영향을 줄 수 있는 알레르기가 있는 경우 특히 중요합니다. TransTaste는 의료기기가 아닙니다.",
  },
  {
    q: "프로필의 API 키 입력란은 무엇인가요?",
    a: "개발자나 파워 유저를 위한 선택 사항입니다. 본인의 Anthropic API 키를 입력하면 크레딧을 소모하지 않고 본인 키로 직접 스캔합니다. 키는 기기에만 저장되며 서버로 전송되지 않습니다.",
  },
  {
    q: "오프라인에서도 사용할 수 있나요?",
    a: "메뉴 분석은 Anthropic Claude API를 통해 이뤄지므로 인터넷 연결이 필요합니다. 회화집과 국가별 가이드는 한 번 열어둔 이후라면 오프라인에서도 확인할 수 있습니다.",
  },
  {
    q: "어떤 언어를 지원하나요?",
    a: "메뉴 사진은 수십 개 언어를 인식하며, 결과는 영어·한국어·일본어·중국어·태국어·베트남어·스페인어·프랑스어·이탈리아어로 표시할 수 있습니다. 레스토랑 회화집은 이 8개 언어에 대해 발음 가이드까지 제공합니다.",
  },
  {
    q: "내 데이터는 어떻게 사용되나요?",
    a: "메뉴 이미지는 분석을 위해 Anthropic으로 전송되며 성능을 위해 잠시 캐시됩니다. 개인정보를 판매하거나 외부와 공유하지 않습니다. 자세한 내용은 개인정보처리방침에서 확인하세요.",
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
      <div className="max-w-prose mx-auto px-5 pt-14 pb-8">
        <h1 className="text-2xl font-bold text-brown-dark mb-2">
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
