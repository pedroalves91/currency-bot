import { mock, mockClear, MockProxy } from 'jest-mock-extended';
import { CurrencyHttpClientService } from './currency-http-client.service';
import { Repository } from 'typeorm';
import { CurrencyAlert } from '../entities/currency-alert.entity';
import { ConfigService } from '@nestjs/config';
import { CurrencyService } from './currency.service';
import { CurrencyPair } from '../interfaces/currency-pair.interface';

describe('CurrencyService spec', () => {
  let currencyHttpClientService: MockProxy<CurrencyHttpClientService>;
  let alertRepository: MockProxy<Repository<CurrencyAlert>>;
  let configService: MockProxy<ConfigService>;
  let service: CurrencyService;

  beforeEach(() => {
    currencyHttpClientService = mock<CurrencyHttpClientService>();
    configService = mock<ConfigService>();
    alertRepository = mock<Repository<CurrencyAlert>>();

    configService.getOrThrow.mockReturnValue({
      'BTC-USD': { threshold: 0.01 },
      'ETH-USD': { threshold: 0.01 },
    });

    service = new CurrencyService(
      currencyHttpClientService,
      configService,
      alertRepository,
    );
  });

  afterEach(() => {
    mockClear(alertRepository);
  });

  describe('initiateMonitor', () => {
    it('should check prices for all currency pairs', async () => {
      const checkPriceSpy = jest
        .spyOn(service, 'checkPrice')
        .mockResolvedValue(undefined);
      await service.initiateMonitor();
      expect(checkPriceSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('checkPrice', () => {
    it('should log the current price and save an alert if threshold is met', async () => {
      const currencyPair: CurrencyPair = {
        pair: 'BTC-USD',
        threshold: 0.01,
        lastAlertPrice: 100,
      };

      service['currencyPairs'].set('BTC-USD', currencyPair);
      currencyHttpClientService.getBtcPrice.mockResolvedValue({
        ask: '110',
        bid: '100',
        currency: 'USD',
      });

      await service.checkPrice(currencyPair);

      expect(alertRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          pair: 'BTC-USD',
          previous_alert_rate: '100',
          rate: '110',
          threshold: '0.01',
        }),
      );
    });

    it('should not save an alert if the price change is below the threshold', async () => {
      const currencyPair: CurrencyPair = {
        pair: 'BTC-USD',
        threshold: 0.01,
        lastAlertPrice: 100,
      };

      service['currencyPairs'].set('BTC-USD', currencyPair);
      currencyHttpClientService.getBtcPrice.mockResolvedValue({
        ask: '100',
        bid: '100',
        currency: 'USD',
      });

      await service.checkPrice(currencyPair);

      expect(alertRepository.save).not.toHaveBeenCalled();
    });
  });
});
