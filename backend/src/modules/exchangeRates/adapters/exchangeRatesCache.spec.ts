import { ExchangeRatesCache } from "./exchangeRatesCache";
import { config, loadConfig } from "src/config";
import { ExchangeRatesApiStub } from "test/stubs/exchangeRatesApiStub";

describe("Exchange Rates Cache", () => {
  let exchangeRatesCache: ExchangeRatesCache;
  let exchangeRatesApi: ExchangeRatesApiStub;

  beforeAll(async () => {
    await loadConfig();
  });

  beforeEach(() => {
    jest.spyOn(ExchangeRatesApiStub.prototype, "getExchangeRates");
    exchangeRatesApi = new ExchangeRatesApiStub();

    exchangeRatesCache = new ExchangeRatesCache(exchangeRatesApi);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it("should cache hit exchange rates", async () => {
    // The first request should cache miss, thus triggering a refresh
    await exchangeRatesCache.availableExchangeRates();
    expect(exchangeRatesApi.getExchangeRates).toHaveBeenCalledTimes(1);

    // Cache hit
    await exchangeRatesCache.availableExchangeRates();
    expect(exchangeRatesApi.getExchangeRates).toHaveBeenCalledTimes(1);
  });

  it("should refresh exchange rates when data is too old", async () => {
    // The first request should cache miss, thus triggering a refresh
    await exchangeRatesCache.availableExchangeRates();
    expect(exchangeRatesApi.getExchangeRates).toHaveBeenCalledTimes(1);

    const currentTime = new Date().getTime();
    const currentTimePlusTreshold =
      currentTime + config.exchangeRatesRefreshIntervalInSecs * 1000 + 1;
    jest.useFakeTimers().setSystemTime(currentTimePlusTreshold);

    await exchangeRatesCache.availableExchangeRates();
    expect(exchangeRatesApi.getExchangeRates).toHaveBeenCalledTimes(2);
  });
});
