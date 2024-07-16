/* eslint-disable @typescript-eslint/naming-convention */
import { ExchangeRatesApi } from "./exchangeRatesApi";

describe("Exchange Rates Api", () => {
  // Mocking directly fetch as so is not a good practice
  // I'm doing it only because I'm using a free-tier API
  // I have limited requests per day
  beforeAll(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => ({
          forexList: [
            {
              ticker: "EUR/USD",
              bid: "1.08965",
              ask: "1.08968",
              date: "2024-07-16 07:14:45",
            },
            {
              ticker: "USD/EUR",
              bid: "0.9174",
              ask: "0.9177",
              date: "2024-07-16 07:14:45",
            },
            {
              ticker: "XDR/USD",
              bid: "1.32726",
              ask: null,
              date: "2024-07-16 07:14:45",
            },
            {
              ticker: "EUR/UGX",
              bid: null,
              ask: null,
              date: "2024-07-16 07:14:45",
            },
            {
              ticker: "AED/CAD",
              bid: null,
              ask: null,
              date: "2024-07-16 07:14:45",
            },
          ],
        }),
      }),
    ) as never;
  });

  it("should return available exchange rates", async () => {
    const exchangeRatesApi = new ExchangeRatesApi();
    const result = await exchangeRatesApi.getExchangeRates();

    expect(Object.fromEntries(result.entries())).toMatchObject({
      "EUR/USD": { value: 1.089665, date: "2024-07-16 07:14:45" },
      "USD/EUR": { value: 0.91755, date: "2024-07-16 07:14:45" },
      "XDR/USD": { value: 1.32726, date: "2024-07-16 07:14:45" },
    });
  });
});
