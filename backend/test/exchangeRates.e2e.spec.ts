import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { agent } from "supertest";
import { ExchangeRatesApi } from "../src/modules/exchangeRates/adapters/exchangeRatesApi";
import { ExchangeRatesCache } from "../src/modules/exchangeRates/adapters/exchangeRatesCache";
import { ExchangeRatesApiStub } from "./stubs/exchangeRatesApiStub";
import { AppModule } from "src/app.module";
import { config, loadConfig } from "src/config";

describe("Exchange Rates (E2E)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ExchangeRatesApi)
      .useClass(ExchangeRatesApiStub)
      .compile();

    app = moduleRef.createNestApplication();
    await loadConfig();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.spyOn(ExchangeRatesApiStub.prototype, "getExchangeRates");
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it("should return available exchange rates", async () => {
    await agent(app.getHttpServer())
      .get("/exchange-rates/available")
      .expect(200, ["EUR/USD", "USD/EUR", "GBP/USD", "USD/GBP"]);
  });

  it("should cache hit exchange rates", async () => {
    app.get(ExchangeRatesCache).flushCache();

    // The first request should cache miss, thus triggering a refresh
    await agent(app.getHttpServer()).get("/exchange-rates/available");
    expect(
      ExchangeRatesApiStub.prototype.getExchangeRates,
    ).toHaveBeenCalledTimes(1);

    // Cache hit
    await agent(app.getHttpServer()).get("/exchange-rates/available");
    expect(
      ExchangeRatesApiStub.prototype.getExchangeRates,
    ).toHaveBeenCalledTimes(1);
  });

  it("should refresh exchange rates when data is too old", async () => {
    app.get(ExchangeRatesCache).flushCache();

    // The first request should cache miss, thus triggering a refresh
    await agent(app.getHttpServer()).get("/exchange-rates/available");
    expect(
      ExchangeRatesApiStub.prototype.getExchangeRates,
    ).toHaveBeenCalledTimes(1);

    const currentTime = new Date().getTime();
    const currentTimePlusTreshold =
      currentTime + config.exchangeRatesRefreshIntervalInSecs * 1000 + 1;
    jest.useFakeTimers().setSystemTime(currentTimePlusTreshold);

    await agent(app.getHttpServer()).get("/exchange-rates/available");
    expect(
      ExchangeRatesApiStub.prototype.getExchangeRates,
    ).toHaveBeenCalledTimes(2);
  });
});
