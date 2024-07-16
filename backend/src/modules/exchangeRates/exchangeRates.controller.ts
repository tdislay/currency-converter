import { Controller, Get } from "@nestjs/common";
import { ExchangeRatesService } from "./exchangeRates.service";

@Controller("exchange-rates")
export class ExchangeRatesController {
  constructor(private readonly exchangeRatesService: ExchangeRatesService) {}

  @Get("available")
  async getAvailableExchangeRates(): Promise<string[]> {
    return this.exchangeRatesService.availableExchangeRates();
  }
}
