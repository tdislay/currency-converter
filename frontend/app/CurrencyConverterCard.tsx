"use client";

import { useEffect, useMemo, useState } from "react";
import { Select } from "../components/forms/Select";
import {
  AvailableCurrency,
  ExchangeRate,
  getAvailableCurrencies,
  getExchangeRate,
} from "../core/currency";
import { Input } from "../components/forms/Input";
import Image from "next/image";
import { Big } from "big.js";

import swapSvg from "../public/swap.svg";
import { locales } from "../locales/locales";

export function CurrencyConverterCard() {
  const [availableCurrencies, setAvailableCurrencies] = useState<
    Map<string, AvailableCurrency>
  >(new Map());
  const [fromCurrency, setFromCurrency] = useState<string>("");
  const [toCurrency, setToCurrency] = useState<string>("");
  const [baseAmount, setBaseAmount] = useState<string>("1");
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate>();

  const currencyPairs = Array.from(availableCurrencies.values());

  useEffect(() => {
    getAvailableCurrencies().then(({ result, error }) => {
      if (error) {
        console.error(error);
        return;
      }

      setAvailableCurrencies(result ?? new Map());
    });
  }, []);

  useEffect(() => {
    if (!fromCurrency || !toCurrency) {
      return;
    }

    getExchangeRate(fromCurrency, toCurrency).then(({ result, error }) => {
      if (error) {
        console.error(error);
        return;
      }
      setExchangeRate(result as ExchangeRate);
    });
  }, [fromCurrency, toCurrency]);

  const exchangeAmount = useMemo(() => {
    if (!baseAmount || !exchangeRate) {
      return new Big(0);
    }

    try {
      return Big(baseAmount)
        .times(exchangeRate.value ?? 0)
        .toFixed(4);
    } catch {
      return new Big(0);
    }
  }, [baseAmount, exchangeRate]);

  function swapCurrencies() {
    if (!fromCurrency || !toCurrency) {
      return;
    }

    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);

    setBaseAmount(exchangeAmount.toString());
  }

  return (
    <div className="p-8 m-auto bg-white rounded-md shadow-xl w-1/3 flex flex-col space-y-8">
      <h1 className="text-3xl font-bold text-center">Currency Converter</h1>

      {exchangeRate && (
        <>
          <p>
            <span>
              {baseAmount} {locales[fromCurrency as keyof typeof locales]} égal
              à
            </span>
            <br />
            <span className="text-black text-4xl">
              {exchangeAmount.toString()}{" "}
              {locales[toCurrency as keyof typeof locales]}
            </span>
          </p>
          <p className="text-sm text-gray-500">
            Exchange rate:{" "}
            <span className="text-black">{exchangeRate.value}</span> (
            {exchangeRate.date.toLocaleString()})
          </p>
        </>
      )}

      <div className="flex items-center space-x-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            value={baseAmount?.toString()}
            placeholder="12.34"
            onChange={setBaseAmount}
          />
          <Select
            options={currencyPairs}
            placeholder="Choose a currency"
            option={fromCurrency}
            onChange={setFromCurrency}
          />
          <Input value={exchangeAmount.toString()} disabled />
          <Select
            options={
              availableCurrencies.get(fromCurrency)?.exchangeCurrencies ?? []
            }
            placeholder="Choose a currency"
            disabled={fromCurrency == ""}
            option={toCurrency}
            onChange={setToCurrency}
          />
        </div>

        <button title="Swap currencies" onClick={swapCurrencies}>
          <Image src={swapSvg} alt="swap" width={64} height={64} />
        </button>
      </div>
    </div>
  );
}
