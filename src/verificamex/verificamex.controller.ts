import { Body, Controller, Post } from '@nestjs/common';
import { VerificamexService } from './verificamex.service.js';
import type { VerificationWebhook } from './dto/verification.dto.js';

@Controller('verificamex')
export class VerificamexController {
  constructor(private readonly verificamexService: VerificamexService) {}

  @Post()
  async create() {
    return this.verificamexService.createVerificationSession();
  }

  @Post('webhook')
  async webhook(@Body() newVerification: VerificationWebhook) {
    await this.verificamexService.handleWebhook(newVerification);
  }
}