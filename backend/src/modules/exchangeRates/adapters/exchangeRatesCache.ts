import { Injectable } from "@nestjs/common";
import { ExchangeRate } from "../types";
import { ExchangeRatesApi } from "./exchangeRatesApi";
import { config } from "src/config";

/**
 * To avoid making requests to the exchange rate API
 * we cache the results directly in memory (it could be Redis)
 */
@Injectable()
export class ExchangeRatesCache {
  /**
   * Keys format: EUR/USD
   */
  private exchangeRates: Map<string, ExchangeRate> = new Map();
  private lastUpdate: Date = new Date(0); // 1970-01-01

  constructor(private readonly exchangeRatesApi: ExchangeRatesApi) {}

  /**
   * @returns Exchange Rates with format: EUR/USD
   */
  async availableExchangeRates(): Promise<string[]> {
    await this.updateExchangeRatesIfOldData();

    return [...this.exchangeRates.keys()];
  }

  private async updateExchangeRatesIfOldData(): Promise<void> {
    const TIME_ELAPSED_SINCE_LAST_REFRESH_IN_SECS =
      (Date.now() - this.lastUpdate.getTime()) / 1000;

    if (
      TIME_ELAPSED_SINCE_LAST_REFRESH_IN_SECS >
      config.exchangeRatesRefreshIntervalInSecs
    ) {
      const freshExchangeRates = await this.exchangeRatesApi.getExchangeRates();

      this.exchangeRates = freshExchangeRates;
      this.lastUpdate = new Date();
    }
  }
}
