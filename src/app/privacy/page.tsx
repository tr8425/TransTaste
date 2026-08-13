"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

// Client component for locale-based body rendering. Metadata lives in layout.tsx.

function PrivacyEn() {
  return (
    <>
      <section>
        <h2 className="text-base font-semibold mb-2">1. What We Collect</h2>
        <h3 className="text-sm font-medium mt-3 mb-1">Data stored on your device (localStorage)</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Language preferences</strong> — your chosen output language</li>
          <li><strong>Allergen presets</strong> — allergens you selected (e.g., shellfish, peanuts)</li>
          <li><strong>Dietary preferences</strong> — dietary restrictions (e.g., halal, vegan)</li>
          <li><strong>Scan credits</strong> — remaining free scans and pass status</li>
        </ul>
        <p className="mt-2 text-brown-medium">
          This data is stored locally on your device and is not transmitted to our servers
          unless you initiate a scan.
        </p>

        <h3 className="text-sm font-medium mt-4 mb-1">Data sent during scans</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Menu images/text</strong> — sent to our API for AI analysis</li>
          <li><strong>Allergen presets</strong> — sent with scan requests to personalize warnings</li>
          <li><strong>Output language</strong> — sent to generate translations in your language</li>
        </ul>
      </section>

      <section>
        <h2 className="text-base font-semibold mb-2">2. Health-Related Data (Allergens)</h2>
        <p>
          Your allergen and dietary preferences are considered <strong>health-related sensitive
          data</strong> under GDPR (Article 9) and similar regulations.
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li><strong>Purpose:</strong> Solely to flag allergens in scanned menus and suggest safe alternatives</li>
          <li><strong>Storage:</strong> Stored locally on your device. Not stored on our servers beyond scan processing</li>
          <li><strong>Sharing:</strong> Allergen data is sent to AI providers (Anthropic) only during active scans, as part of the analysis prompt. It is not sold, shared with third parties, or used for marketing</li>
          <li><strong>Deletion:</strong> Clear your browser&apos;s site data to remove all locally stored preferences immediately</li>
        </ul>
      </section>

      <section>
        <h2 className="text-base font-semibold mb-2">3. Scan Data & Caching</h2>
        <p>
          Scan results may be cached (without personal identifiers) to improve response times
          for common menu items. Cache entries are retained for up to 30 days and contain only
          the menu analysis results — not your personal allergen presets or preferences.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold mb-2">4. Payment Data</h2>
        <p>
          Payments are processed entirely by <strong>Stripe</strong>. We do not store your
          credit card number, billing address, or other payment details. Stripe&apos;s privacy
          policy governs the handling of your payment information.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold mb-2">5. Third-Party Services</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Anthropic (Claude AI)</strong> — processes menu images and text for analysis</li>
          <li><strong>Stripe</strong> — handles payment processing</li>
          <li><strong>Vercel</strong> — hosts the application</li>
          <li><strong>Upstash</strong> — caches anonymized scan results</li>
        </ul>
      </section>

      <section>
        <h2 className="text-base font-semibold mb-2">6. Your Rights (GDPR / PIPA)</h2>
        <p>If you are in the EU, EEA, or South Korea, you have the right to:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li><strong>Access</strong> — request what data we hold about you</li>
          <li><strong>Rectification</strong> — correct inaccurate data</li>
          <li><strong>Erasure</strong> — request deletion of your data</li>
          <li><strong>Withdraw consent</strong> — stop processing of your health data</li>
          <li><strong>Data portability</strong> — receive your data in a portable format</li>
        </ul>
        <p className="mt-2">
          Since most data is stored locally on your device, you can exercise these rights
          by clearing your browser&apos;s site data at any time.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold mb-2">7. Children</h2>
        <p>
          TransTaste is not directed at children under 13. We do not knowingly collect
          personal data from children.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold mb-2">8. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Continued use of the Service
          after changes constitutes acceptance.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold mb-2">9. Contact</h2>
        <p>
          For privacy-related inquiries or to exercise your data rights, contact the
          TransTaste team via the app or website.
        </p>
      </section>
    </>
  );
}

function PrivacyKo() {
  return (
    <>
      <section>
        <h2 className="text-base font-semibold mb-2">1. 수집하는 정보</h2>
        <h3 className="text-sm font-medium mt-3 mb-1">기기에 저장되는 정보 (localStorage)</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>언어 설정</strong> — 사용자가 선택한 출력 언어</li>
          <li><strong>알레르기 정보</strong> — 사용자가 선택한 알레르기 항목 (예: 갑각류, 땅콩)</li>
          <li><strong>식이 선호도</strong> — 식이 제한 사항 (예: 할랄, 비건)</li>
          <li><strong>스캔 크레딧</strong> — 남은 무료 스캔 횟수 및 패스 상태</li>
        </ul>
        <p className="mt-2 text-brown-medium">
          이 정보는 사용자 기기에 로컬로 저장되며, 사용자가 스캔을 시작하기 전에는 당사 서버로
          전송되지 않습니다.
        </p>

        <h3 className="text-sm font-medium mt-4 mb-1">스캔 시 전송되는 정보</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>메뉴 이미지/텍스트</strong> — AI 분석을 위해 당사 API로 전송됩니다</li>
          <li><strong>알레르기 정보</strong> — 맞춤형 경고를 제공하기 위해 스캔 요청과 함께 전송됩니다</li>
          <li><strong>출력 언어</strong> — 사용자 언어로 번역을 생성하기 위해 전송됩니다</li>
        </ul>
      </section>

      <section>
        <h2 className="text-base font-semibold mb-2">2. 건강 관련 정보 (알레르기)</h2>
        <p>
          사용자의 알레르기 및 식이 선호도는 GDPR(제9조) 및 유사 규정에 따라
          <strong>건강 관련 민감정보</strong>로 간주됩니다.
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li><strong>이용 목적:</strong> 스캔된 메뉴에서 알레르기 유발 성분을 표시하고 안전한 대안을 제안하는 용도로만 사용됩니다</li>
          <li><strong>저장:</strong> 사용자 기기에 로컬로 저장됩니다. 스캔 처리 외에는 당사 서버에 저장되지 않습니다</li>
          <li><strong>제공:</strong> 알레르기 정보는 활성 스캔 중에만 분석 프롬프트의 일부로 AI 제공자(Anthropic)에게 전송됩니다. 판매되거나 제3자와 공유되거나 마케팅에 사용되지 않습니다</li>
          <li><strong>삭제:</strong> 브라우저의 사이트 데이터를 삭제하면 로컬에 저장된 모든 설정을 즉시 제거할 수 있습니다</li>
        </ul>
      </section>

      <section>
        <h2 className="text-base font-semibold mb-2">3. 스캔 데이터 및 캐시</h2>
        <p>
          공통적으로 사용되는 메뉴 항목의 응답 속도를 개선하기 위해, 스캔 결과는 개인 식별 정보 없이
          캐시될 수 있습니다. 캐시 항목은 최대 30일 동안 보관되며, 사용자의 알레르기 정보나 선호도가
          아닌 메뉴 분석 결과만 포함합니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold mb-2">4. 결제 정보</h2>
        <p>
          모든 결제는 <strong>Stripe</strong>를 통해 처리됩니다. 당사는 신용카드 번호, 청구지 주소,
          기타 결제 세부 정보를 저장하지 않습니다. 결제 정보의 처리는 Stripe의 개인정보처리방침을
          따릅니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold mb-2">5. 제3자 서비스</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Anthropic (Claude AI)</strong> — 분석을 위해 메뉴 이미지와 텍스트를 처리합니다</li>
          <li><strong>Stripe</strong> — 결제 처리를 담당합니다</li>
          <li><strong>Vercel</strong> — 애플리케이션을 호스팅합니다</li>
          <li><strong>Upstash</strong> — 익명화된 스캔 결과를 캐시합니다</li>
        </ul>
      </section>

      <section>
        <h2 className="text-base font-semibold mb-2">6. 정보주체의 권리 (GDPR / PIPA)</h2>
        <p>EU, EEA 또는 대한민국에 거주하는 정보주체는 다음 권리를 가집니다:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li><strong>열람권</strong> — 당사가 보유한 본인 정보의 열람 요청</li>
          <li><strong>정정·삭제권</strong> — 부정확한 정보의 정정 요청</li>
          <li><strong>삭제권</strong> — 본인 정보의 삭제 요청</li>
          <li><strong>동의 철회</strong> — 건강 정보 처리의 중단 요청</li>
          <li><strong>정보이동권</strong> — 본인 정보를 이동 가능한 형식으로 수령</li>
        </ul>
        <p className="mt-2">
          대부분의 정보가 사용자 기기에 로컬로 저장되므로, 언제든지 브라우저의 사이트 데이터를
          삭제함으로써 위 권리를 행사할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold mb-2">7. 아동 정보</h2>
        <p>
          TransTaste는 만 13세 미만 아동을 대상으로 하지 않습니다. 당사는 아동의 개인정보를
          고의로 수집하지 않습니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold mb-2">8. 처리방침의 변경</h2>
        <p>
          본 개인정보처리방침은 수시로 갱신될 수 있습니다. 변경 후에도 서비스를 계속 이용하는 경우
          변경된 내용에 동의한 것으로 간주됩니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold mb-2">9. 문의</h2>
        <p>
          개인정보 관련 문의 또는 정보주체의 권리 행사는 앱 또는 웹사이트를 통해 TransTaste 팀에
          연락해 주시기 바랍니다.
        </p>
      </section>
    </>
  );
}

export default function PrivacyPage() {
  const { t, locale } = useTranslation();

  return (
    <main id="page-top" className="min-h-screen bg-cream pb-28">
      <div className="max-w-prose mx-auto px-5 pt-14 pb-8">
        <p className="mengto-kicker mb-2 text-[9px] font-extrabold text-coral">Document · privacy</p>
        <h1 className="mb-6 text-3xl font-bold text-brown-dark">{t("legal.privacyTitle")}</h1>
        <p className="text-xs text-brown-medium mb-8">{t("legal.lastUpdated")}</p>

        <div className="prose-sm text-brown-dark space-y-6 text-sm leading-relaxed">
          {locale === "ko" ? <PrivacyKo /> : <PrivacyEn />}
        </div>

        <div className="mt-8 pt-4 border-t border-brown-light/10">
          <Link href="/terms" className="text-sm text-coral hover:underline">
            {t("legal.linkToTerms")}
          </Link>
          <a href="#page-top" className="float-right text-sm text-coral hover:underline">
            {locale === "ko" ? "맨 위로" : "Back to top"}
          </a>
        </div>
      </div>
    </main>
  );
}
