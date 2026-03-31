"use client";

import { MenuAnalysisResult } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";

interface ComboRecommendationProps {
  combo: MenuAnalysisResult["recommended_combo"];
}

export default function ComboRecommendation({
  combo,
}: ComboRecommendationProps) {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-brown-dark">
        {t("combo.title")}
      </h3>

      {/* Budget combo */}
      <div className="bg-cream-dark rounded-xl p-4 border border-brown-light/10">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm">💰</span>
          <h4 className="text-sm font-semibold text-brown-dark">
            {t("combo.bestValue")}
          </h4>
        </div>
        <p className="text-base font-medium text-coral mb-1">
          {combo.budget.items.join(" + ")}
        </p>
        <p className="text-xs text-brown-medium leading-relaxed">
          {combo.budget.reason}
        </p>
      </div>

      {/* Balanced combo */}
      <div className="bg-cream-dark rounded-xl p-4 border border-brown-light/10">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm">⚖️</span>
          <h4 className="text-sm font-semibold text-brown-dark">
            {t("combo.balanced")}
          </h4>
        </div>
        <p className="text-base font-medium text-coral mb-1">
          {combo.balanced.items.join(" + ")}
        </p>
        <p className="text-xs text-brown-medium leading-relaxed">
          {combo.balanced.reason}
        </p>
      </div>
    </div>
  );
}
