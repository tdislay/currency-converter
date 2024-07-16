import { Module } from "@nestjs/common";
import { ExchangeRatesModule } from "./modules/exchangeRates/exchangeRates.module";

@Module({
  imports: [ExchangeRatesModule],
})
export class AppModule {}
