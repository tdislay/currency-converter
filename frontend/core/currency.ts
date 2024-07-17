import { config } from "../config";
import { locales } from "../locales/locales";

interface Currency {
  key: string;
  name: string;
}

export type AvailableCurrency = Currency & {
  exchangeCurrencies: Currency[];
};

export interface ExchangeRate {
  value: number;
  date: Date;
};

export async function getAvailableCurrencies(): Promise<{
  result: Map<string, AvailableCurrency> | null;
  error: Error | null;
}> {
  try {
    const url = new URL("/exchange-rates/available", config.BACKEND_URL);
    const response = await fetch(url, { method: "GET" });
    const data = (await response.json()) as string[];

    const uniqueCurrencies = new Map<string, AvailableCurrency>();
    for (const currency of data) {
      const [from, to] = currency.split("/");
      if (!uniqueCurrencies.has(from)) {
        const locale = locales[from as keyof typeof locales];
        uniqueCurrencies.set(from, {
          key: from,
          name: `${from}${locale ? ` (${locale})` : ""}`,
          exchangeCurrencies: [],
        });
      }

      const locale = locales[to as keyof typeof locales];
      uniqueCurrencies.get(from)?.exchangeCurrencies.push({
        key: to,
        name: `${to}${locale ? ` (${locale})` : ""}`,
      });
    }

    return { result: uniqueCurrencies, error: null };
  } catch (error) {
    return { error: error as Error, result: null };
  }
}

export async function getExchangeRate(
  fromCurrency: string,
  toCurrency: string
): Promise<{result: ExchangeRate | null; error: Error | null}> {
  try {
    const url = new URL(`/exchange-rates/${fromCurrency}/${toCurrency}`, config.BACKEND_URL);
    const response = await fetch(url, {
      method: "GET",
    });
    const result = await response.json();

    return { result: {...result, date: new Date(result.date)}, error: null };
  } catch (error) {
    return { error: error as Error, result: null };
  }
}
