import { ExchangeRatesApi } from "src/modules/exchangeRates/adapters/exchangeRatesApi";
import { ExchangeRate } from "src/modules/exchangeRates/types";

export class ExchangeRatesApiStub extends ExchangeRatesApi {
  async getExchangeRates(): Promise<Map<string, ExchangeRate>> {
    return new Map([
      ["EUR/USD", { value: 1.23, date: "2024-07-16 07:14:45" }],
      ["USD/EUR", { value: 0.81, date: "2024-07-16 07:14:45" }],
      ["GBP/USD", { value: 0.75, date: "2024-07-16 07:14:45" }],
      ["USD/GBP", { value: 1.33, date: "2024-07-16 07:14:45" }],
    ]);
  }
}
