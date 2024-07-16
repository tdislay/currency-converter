import { Injectable } from "@nestjs/common";
import { ExchangeRatesCache } from "./adapters/exchangeRatesCache";
import { ExchangeRate } from "./types";

@Injectable()
export class ExchangeRatesService {
  constructor(private readonly exchangeRatesCache: ExchangeRatesCache) {}

  async availableExchangeRates(): Promise<string[]> {
    return this.exchangeRatesCache.availableExchangeRates();
  }

  async getExchangeRate(exchangeRateKey: string): Promise<ExchangeRate> {
    return this.exchangeRatesCache.getExchangeRate(exchangeRateKey);
  }
}
