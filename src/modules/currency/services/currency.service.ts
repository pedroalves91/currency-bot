import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CurrencyHttpClientService } from './currency-http-client.service';
import { ConfigService } from '@nestjs/config';
import { CurrencyPair } from '../interfaces/currency-pair.interface';
import { CurrencyConfigInterface } from '../interfaces/currency-config.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrencyAlert } from '../entities/currency-alert.entity';

@Injectable()
export class CurrencyService {
  private readonly logger: Logger = new Logger(CurrencyService.name);
  private currencyPairs: Map<string, CurrencyPair> = new Map();

  constructor(
    private readonly currencyHttpClientService: CurrencyHttpClientService,
    private readonly configService: ConfigService,
    @InjectRepository(CurrencyAlert)
    private alertRepository: Repository<CurrencyAlert>,
  ) {
    this.initializeCurrencyPairs();
  }

  private initializeCurrencyPairs(): void {
    const currencyPairsConfig =
      this.configService.getOrThrow<Map<string, CurrencyPair>>(
        'CURRENCY_PAIRS',
      );

    Object.entries(currencyPairsConfig).forEach(
      ([pair, config]: [string, CurrencyConfigInterface]) => {
        this.currencyPairs.set(pair, {
          pair,
          threshold: config.threshold,
          lastAlertPrice: 0,
        });
      },
    );
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async initiateMonitor(): Promise<void> {
    const pricePromises = Array.from(this.currencyPairs.values()).map((pair) =>
      this.checkPrice(pair),
    );

    try {
      await Promise.all(pricePromises);
    } catch (error) {
      this.logger.error('Error checking prices', error);
    }
  }

  async checkPrice(currencyPair: CurrencyPair): Promise<void> {
    const data = await this.currencyHttpClientService.getCurrencyPrice(
      currencyPair.pair,
    );

    const currentPrice = parseFloat(data.ask);
    this.logger.log(`Current ${currencyPair.pair} price: ${currentPrice}`);

    if (currencyPair.lastAlertPrice > 0) {
      const percentageDiff =
        ((currentPrice - currencyPair.lastAlertPrice) /
          currencyPair.lastAlertPrice) *
        100;

      // price undergoes a change of a specified threshold percent in either direction
      const alertPercentage = currencyPair.threshold;

      if (Math.abs(percentageDiff) >= alertPercentage) {
        this.logger.warn(
          `Price threshold change alert for ${currencyPair.pair}: ${currencyPair.lastAlertPrice} -> ${currentPrice}`,
        );
        const alert = new CurrencyAlert();
        alert.pair = currencyPair.pair;
        alert.previous_alert_rate = currencyPair.lastAlertPrice.toString();

        this.updateAlertPrice(currencyPair.pair, currentPrice);

        alert.rate = currentPrice.toString();
        alert.threshold = alertPercentage.toString();

        this.logger.log(`Storing alert for pair: ${currencyPair.pair}`);
        await this.alertRepository.save(alert);
      }
    } else {
      this.updateAlertPrice(currencyPair.pair, currentPrice);
      this.logger.log(
        `Initial price for ${currencyPair.pair} at: ${currencyPair.lastAlertPrice}`,
      );
    }
  }

  private updateAlertPrice(pair: string, price: number): void {
    const currencyPair = this.currencyPairs.get(pair);
    if (currencyPair) {
      currencyPair.lastAlertPrice = price;
      this.currencyPairs.set(pair, currencyPair);
    }
  }
}
