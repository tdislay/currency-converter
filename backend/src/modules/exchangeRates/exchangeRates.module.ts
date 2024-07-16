import { Module } from "@nestjs/common";
import { ExchangeRatesApi } from "./adapters/exchangeRatesApi";
import { ExchangeRatesCache } from "./adapters/exchangeRatesCache";
import { ExchangeRatesController } from "./exchangeRates.controller";
import { ExchangeRatesService } from "./exchangeRates.service";

@Module({
  providers: [ExchangeRatesService, ExchangeRatesCache, ExchangeRatesApi],
  controllers: [ExchangeRatesController],
})
export class ExchangeRatesModule {}
