import { Injectable } from "@nestjs/common";
import { ExchangeRatesCache } from "./adapters/exchangeRatesCache";

@Injectable()
export class ExchangeRatesService {
  constructor(private readonly exchangeRatesCache: ExchangeRatesCache) {}

  async availableExchangeRates(): Promise<string[]> {
    return this.exchangeRatesCache.availableExchangeRates();
  }
}
