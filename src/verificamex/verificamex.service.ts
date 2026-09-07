import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IdentificationsRepository, type IdentificationRow, type NewIdentification } from './identifications.repository.js';
import type { VerificationWebhook } from './dto/verification.dto.js';

export interface Response201 {
  uuid: string
  status: string
  created_at: string
  updated_at: string
  verification_url: string
  webhook: string
  with_webhook_binaries: boolean
  custom_branding: CustomBranding
  redirect_url: string
  result: any
}

export interface CustomBranding {
  primary_color: string
  secondary_color: string
  logo: string
}

// ================================================
export interface Response422 {
  message: string
  errors: object
}

// ================================================
export interface ResponseError {
  message: string
}

@Injectable()
export class VerificamexService {

  private readonly baseUrl = 'https://api.verificamex.com/';

  constructor(
    private readonly config: ConfigService,
    private readonly identifications: IdentificationsRepository,
  ) {}

  async createVerificationSession(): Promise<Response201 | Response422 | ResponseError> {
    const token = this.config.get<string>('BEARER_TOKEN');
    if (!token) throw new InternalServerErrorException('No token in setup');

    const response = await fetch(`${this.baseUrl}/identity/v3/identity/sessions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        validations: ["INE"],
        redirect_url: "https://talent.towasoftware.com/",
        webhook: "https://tu-api.com/webhooks/verificamex",
      })
    })

    if (!response.ok)
      throw new InternalServerErrorException('Error creating the validation session')

    const verificationSession = (await response.json()) as Response201 | Response422 | ResponseError;

    if (response.status === 201) {
      await this.identifications.create(this.toNewIdentification(verificationSession as Response201));
    }

    return verificationSession;
  }

  async getVerification(verificationId: string): Promise<IdentificationRow | null> {
    return this.identifications.getByUuid(verificationId);
  }

  async handleWebhook(newVerification: VerificationWebhook): Promise<void> {
    const { id, status, updated_at, ocr } = newVerification.data;

    const stored = await this.identifications.getByUuid(id);
    if (!stored) throw new NotFoundException(`Verification ${id} not found`);

    // No hay cambios
    if (stored.verification_status === status) return;

    await this.identifications.update(id, {
      verification_status: status,
      verification_updated_at: String(updated_at),
      name: ocr?.ocr_frontal?.nombre_completo ?? stored.name,
    });
  }

  private toNewIdentification(session: Response201): NewIdentification {
    return {
      verification_uuid: session.uuid,
      verification_status: session.status,
      verification_updated_at: session.updated_at,
    };
  }

}