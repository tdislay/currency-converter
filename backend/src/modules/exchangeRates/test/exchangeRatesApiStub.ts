import { ExchangeRatesApi } from "../adapters/exchangeRatesApi";
import { ExchangeRate } from "../types";

export class ExchangeRatesApiStub extends ExchangeRatesApi {
  async getExchangeRates(): Promise<Map<string, ExchangeRate>> {
    return new Map([
      ["EUR/USD", { value: 1.23, date: "" }],
      ["USD/EUR", { value: 0.81, date: "" }],
      ["GBP/USD", { value: 0.75, date: "" }],
      ["USD/GBP", { value: 1.33, date: "" }],
    ]);
  }
}
