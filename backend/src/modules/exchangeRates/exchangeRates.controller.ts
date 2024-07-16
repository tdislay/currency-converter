import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import { ExchangeRatesService } from "./exchangeRates.service";

@Controller("exchange-rates")
export class ExchangeRatesController {
  constructor(private readonly exchangeRatesService: ExchangeRatesService) {}

  @Get("available")
  async getAvailableExchangeRates(
    @Res({ passthrough: true }) response: Response,
  ): Promise<string[]> {
    response.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, max-age=0",
    );
    response.setHeader("Pragma", "no-cache");
    response.setHeader("Expires", "0");

    return this.exchangeRatesService.availableExchangeRates();
  }
}
