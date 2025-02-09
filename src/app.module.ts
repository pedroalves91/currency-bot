import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configs from '../config/configs';
import { CurrencyModule } from './modules/currency/currency.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configs],
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        CURRENCY_API_URL: Joi.string().required(),
        CURRENCY_PAIRS: Joi.object()
          .pattern(
            Joi.string(),
            Joi.object({
              threshold: Joi.number().required(),
            }),
          )
          .optional()
          .min(1),
      }),
    }),
    CurrencyModule,
  ],
})
export class AppModule {}
