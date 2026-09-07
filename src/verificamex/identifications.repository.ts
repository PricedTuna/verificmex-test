import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import type { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../supabase/supabase.constants.js';

export interface IdentificationRow {
  id: number;
  created_at: string;
  name: string | null;
  verification_status: string | null;
  verification_uuid: string | null;
  verification_updated_at: string | null;
}

export interface NewIdentification {
  name?: string | null;
  verification_status: string;
  verification_uuid: string;
  verification_updated_at: string;
}

@Injectable()
export class IdentificationsRepository {
  private readonly table = 'identifications';

  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  async create(input: NewIdentification): Promise<IdentificationRow> {
    const { data, error } = await this.supabase
      .from(this.table)
      .insert(input)
      .select()
      .single();

    if (error)
      throw new InternalServerErrorException(`Failed to insert identification: ${error.message}`);

    return data as IdentificationRow;
  }

  async getByUuid(verificationUuid: string): Promise<IdentificationRow | null> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('verification_uuid', verificationUuid)
      .maybeSingle();

    if (error)
      throw new InternalServerErrorException(`Failed to fetch identification: ${error.message}`);

    return (data as IdentificationRow) ?? null;
  }

  async update(
    verificationUuid: string,
    patch: Partial<NewIdentification>,
  ): Promise<IdentificationRow> {
    const { data, error } = await this.supabase
      .from(this.table)
      .update(patch)
      .eq('verification_uuid', verificationUuid)
      .select()
      .single();

    if (error)
      throw new InternalServerErrorException(`Failed to update identification: ${error.message}`);

    return data as IdentificationRow;
  }
}