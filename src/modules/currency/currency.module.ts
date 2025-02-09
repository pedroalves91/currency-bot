import { Module } from '@nestjs/common';
import { CurrencyHttpClientService } from './services/currency-http-client.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CurrencyService } from './services/currency.service';
import { CustomHttpModule } from '../http/custom-http.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyAlert } from './entities/currency-alert.entity';
import { TypeOrmOptions } from '../../../config/datasources/typeorm.options';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmOptions,
    }),
    TypeOrmModule.forFeature([CurrencyAlert]),
    ScheduleModule.forRoot(),
    CustomHttpModule,
  ],
  providers: [CurrencyService, CurrencyHttpClientService],
})
export class CurrencyModule {}
