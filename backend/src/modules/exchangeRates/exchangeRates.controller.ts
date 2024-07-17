import { BadRequestException, Controller, Get, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { ExchangeRatesService } from "./exchangeRates.service";
import { ExchangeRate } from "./types";
import { config } from "src/config";

@Controller("exchange-rates")
export class ExchangeRatesController {
  constructor(private readonly exchangeRatesService: ExchangeRatesService) {}

  @Get("available")
  async getAvailableExchangeRates(
    @Res({ passthrough: true }) response: Response,
  ): Promise<string[]> {
    response.setHeader(
      "Cache-Control",
      `max-age=${config.exchangeRatesRefreshIntervalInSecs}`,
    );

    return this.exchangeRatesService.availableExchangeRates();
  }

  @Get(":from/:to")
  async getExchangeRate(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ExchangeRate> {
    response.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, max-age=0",
    );
    response.setHeader("Pragma", "no-cache");
    response.setHeader("Expires", "0");

    const exchangeRateKey = `${request.params.from}/${request.params.to}`;

    const availableExchangeRates =
      await this.exchangeRatesService.availableExchangeRates();

    if (!availableExchangeRates.includes(exchangeRateKey)) {
      throw new BadRequestException("Exchange rate not available");
    }

    return this.exchangeRatesService.getExchangeRate(exchangeRateKey);
  }
}
