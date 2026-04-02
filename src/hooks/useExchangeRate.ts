"use client";

import { useState, useEffect, useCallback } from "react";

interface ExchangeRateData {
  from: string;
  to: string;
  rate: number;
  updated_at: string;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  KRW: "₩", JPY: "¥", USD: "$", EUR: "€", GBP: "£", THB: "฿",
  CNY: "¥", VND: "₫", TWD: "NT$", SGD: "S$", HKD: "HK$",
  MYR: "RM", PHP: "₱", IDR: "Rp", INR: "₹", AUD: "A$",
  CAD: "C$", CHF: "CHF", SEK: "kr", NOK: "kr", DKK: "kr",
  MXN: "$", BRL: "R$", ARS: "$", CLP: "$", COP: "$",
};

function formatConverted(amount: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  // No decimal for large-unit currencies
  const noDecimal = ["KRW", "JPY", "VND", "IDR", "CLP", "COP"];
  if (noDecimal.includes(currency)) {
    return `${symbol}${Math.round(amount).toLocaleString()}`;
  }
  return `${symbol}${amount.toFixed(2)}`;
}

export function useExchangeRate() {
  const [homeCurrency, setHomeCurrency] = useState<string | null>(null);
  const [rateData, setRateData] = useState<ExchangeRateData | null>(null);
  const [showConverted, setShowConverted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Read user's home currency from settings
  useEffect(() => {
    try {
      const raw = localStorage.getItem("transtaste_user_settings");
      if (raw) {
        const settings = JSON.parse(raw);
        if (settings.home_currency) {
          setHomeCurrency(settings.home_currency);
        }
      }
    } catch { /* ignore */ }
  }, []);

  const fetchRate = useCallback(async (from: string, to: string) => {
    if (from === to) {
      setRateData({ from, to, rate: 1, updated_at: new Date().toISOString() });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/exchange-rate?from=${from}&to=${to}`);
      if (res.ok) {
        const data = await res.json();
        setRateData(data);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  const toggleConversion = useCallback(() => {
    setShowConverted((prev) => !prev);
  }, []);

  const convert = useCallback(
    (amount: number, fromCurrency: string): string | null => {
      if (!rateData || !showConverted || !homeCurrency) return null;
      if (fromCurrency.toUpperCase() === homeCurrency.toUpperCase()) return null;

      // We need rate from fromCurrency to homeCurrency
      // rateData is from one pair; for simplicity, re-fetch if needed
      const converted = amount * rateData.rate;
      return formatConverted(converted, homeCurrency);
    },
    [rateData, showConverted, homeCurrency]
  );

  return {
    homeCurrency,
    showConverted,
    loading,
    rateData,
    toggleConversion,
    fetchRate,
    convert,
  };
}
