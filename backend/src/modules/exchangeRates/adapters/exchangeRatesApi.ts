import { Injectable } from "@nestjs/common";
import { Big } from "big.js";
import { ExchangeRate } from "../types";
import { config } from "src/config";

type ExchangeRatesApiResponse = {
  forexList: {
    ticker: string;
    bid?: string | null;
    ask?: string | null;
    date: string;
  }[];
};

@Injectable()
export class ExchangeRatesApi {
  private apiUrl: string;

  constructor() {
    this.apiUrl = `https://financialmodelingprep.com/api/v3/forex?apikey=${config.exchangeRatesApiKey}`;
  }

  async getExchangeRates(): Promise<Map<string, ExchangeRate>> {
    const response = await fetch(this.apiUrl);
    const result = (await response.json()) as ExchangeRatesApiResponse;

    const exchangeRates = new Map<string, ExchangeRate>();

    for (const item of result.forexList) {
      if (item.ask == null && item.bid == null) {
        break;
      }

      // We use Big.js to avoid floating point errors
      // e.g. 0.1 + 0.2 = 0.30000000000000004
      const exchangeRate = Big(item.ask ?? (item.bid as string))
        .add(item.bid ?? (item.ask as string))
        .div(2);
      exchangeRates.set(item.ticker, {
        value: exchangeRate.toNumber(),
        date: new Date(item.date),
      });
    }

    return exchangeRates;
  }
}
