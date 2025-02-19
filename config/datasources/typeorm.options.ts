import { Injectable } from '@nestjs/common';
import { getMetadataArgsStorage } from 'typeorm';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TypeOrmOptions implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const entities = getMetadataArgsStorage().tables.map((tbl) => tbl.target);

    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      password: this.configService.get<string>('DB_PASSWORD'),
      username: this.configService.get<string>('DB_USERNAME'),
      entities,
      database: this.configService.get<string>('DB_DATABASE'),
      synchronize: true,
    };
  }
}
