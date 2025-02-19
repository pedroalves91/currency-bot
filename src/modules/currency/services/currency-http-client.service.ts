import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CustomHttpService } from '../../http/services/custom-http.service';
import { ConfigService } from '@nestjs/config';
import { CurrencyResponse } from '../interfaces/currency-response.interface';

@Injectable()
export class CurrencyHttpClientService {
  private readonly logger: Logger = new Logger(CurrencyHttpClientService.name);
  private readonly defaultOptions = {
    headers: {
      Accept: 'application/json',
    },
  };

  constructor(
    private readonly customHttpService: CustomHttpService,
    private readonly configService: ConfigService,
  ) {}

  async getCurrencyPrice(currencyPair: string): Promise<CurrencyResponse> {
    try {
      const response = await this.customHttpService.get<CurrencyResponse>(
        `/ticker/${currencyPair}`,
        {
          ...this.defaultOptions,
          baseURL: this.configService.getOrThrow<string>('CURRENCY_API_URL'),
        },
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch BTC price`, error);
      throw new InternalServerErrorException('Failed to fetch BTC price');
    }
  }
}
