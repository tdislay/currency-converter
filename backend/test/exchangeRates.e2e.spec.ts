import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { agent } from "supertest";
import { ExchangeRatesApi } from "../src/modules/exchangeRates/adapters/exchangeRatesApi";
import { ExchangeRatesApiStub } from "./stubs/exchangeRatesApiStub";
import { AppModule } from "src/app.module";
import { loadConfig } from "src/config";

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

  describe("GET /exchange-rates/available", () => {
    it("should return available exchange rates", async () => {
      await agent(app.getHttpServer())
        .get("/exchange-rates/available")
        .expect(200, ["EUR/USD", "USD/EUR", "GBP/USD", "USD/GBP"]);
    });
  });
});