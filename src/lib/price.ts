// Menu prices arrive as the model read them off the menu: "6,50", "1.234,56",
// "1,234.56", "1,200", "HK$16 / HK$19". parseFloat("6,50") is 6, which once
// put EUR 6 (not 6.50) in the cart, so every price goes through here.

// Currencies with no minor unit: a single separator before three digits is a
// thousands mark there ("12.500" IDR, "1,200" JPY).
const ZERO_DECIMAL = new Set(["JPY", "KRW", "VND", "IDR", "CLP", "ISK", "HUF", "TWD", "PYG", "UGX"]);

export function parseMenuPrice(raw: unknown, currency?: string | null): number | null {
  if (typeof raw === "number") return Number.isFinite(raw) && raw >= 0 ? raw : null;
  if (typeof raw !== "string") return null;
  // First number only: "HK$16 / HK$19 (iced)" is 16. Spaces inside it are
  // thousands marks ("1 234,50").
  const match = raw.match(/\d[\d.,   ]*/);
  if (!match) return null;
  let s = match[0].replace(/[   ]/g, "").replace(/[.,]+$/, "");

  const lastComma = s.lastIndexOf(",");
  const lastDot = s.lastIndexOf(".");
  if (lastComma >= 0 && lastDot >= 0) {
    // Both marks: the later one is the decimal point.
    const decimal = lastComma > lastDot ? "," : ".";
    const thousands = decimal === "," ? "." : ",";
    s = s.split(thousands).join("").replace(decimal, ".");
  } else if (lastComma >= 0 || lastDot >= 0) {
    const mark = lastComma >= 0 ? "," : ".";
    const parts = s.split(mark);
    const tail = parts[parts.length - 1];
    const zeroDecimal = ZERO_DECIMAL.has((currency ?? "").toUpperCase());
    // "1,234,567" or "1.200" in JPY: thousands. "6,50" or "14.00": decimal.
    // A lone comma before three digits ("1,200") is thousands in any currency.
    const isThousands =
      parts.length > 2 || zeroDecimal || (mark === "," && tail.length === 3);
    s = isThousands ? parts.join("") : parts.join(".");
  }

  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : null;
}
