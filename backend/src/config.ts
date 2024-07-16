type Config = {
  exchangeRatesApiKey: string;
  exchangeRatesRefreshIntervalInSecs: number;
};

export let config = {} as Config;

// Accessing process.env is pretty slow, so we cache the result
// The cleaner way would be to use a library like zod to validate the env variables
export async function loadConfig(): Promise<void> {
  await import("dotenv/config");

  config = {
    exchangeRatesApiKey: process.env.EXCHANGE_RATES_API_KEY as string,
    exchangeRatesRefreshIntervalInSecs: Number(
      process.env.EXCHANGE_RATES_REFRESH_INTERVAL_IN_SECS,
    ),
  };
}
