import { Module } from '@nestjs/common';
import { VerificamexService } from './verificamex.service.js';
import { VerificamexController } from './verificamex.controller.js';
import { IdentificationsRepository } from './identifications.repository.js';

@Module({
  controllers: [VerificamexController],
  providers: [VerificamexService, IdentificationsRepository],
})
export class VerificamexModule {}
