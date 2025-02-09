import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { HttpOptions } from '../interfaces/http-options.interface';
import { HttpResponse } from '../interfaces/http-response.interface';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CustomHttpService {
  private readonly logger: Logger = new Logger(CustomHttpService.name);

  constructor(private readonly httpService: HttpService) {}

  async get<T>(url: string, options?: HttpOptions): Promise<HttpResponse<T>> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<T>(url, {
          baseURL: options?.baseURL,
          headers: options?.headers,
        }),
      );

      return {
        data: response.data,
        status: response.status,
        headers: response.headers as Record<string, string>,
      };
    } catch (error) {
      this.logger.error('HTTP GET request failed', error);
      throw error;
    }
  }
}
