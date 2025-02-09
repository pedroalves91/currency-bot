"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmOptions = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const config_1 = require("@nestjs/config");
let TypeOrmOptions = class TypeOrmOptions {
    constructor(configService) {
        this.configService = configService;
    }
    createTypeOrmOptions() {
        const entities = (0, typeorm_1.getMetadataArgsStorage)().tables.map((tbl) => tbl.target);
        return {
            type: 'postgres',
            host: this.configService.get('DB_HOST'),
            port: this.configService.get('DB_PORT'),
            password: this.configService.get('DB_PASSWORD'),
            username: this.configService.get('DB_USERNAME'),
            entities,
            database: this.configService.get('DB_DATABASE'),
            synchronize: true,
        };
    }
};
exports.TypeOrmOptions = TypeOrmOptions;
exports.TypeOrmOptions = TypeOrmOptions = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TypeOrmOptions);
//# sourceMappingURL=typeorm.options.js.map