import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
export enum PaymentChannel {
  PAYSTACK = 'PAYSTACK',
}

export class InitializePaymentDto {
  @ApiProperty({
    description: 'ID of the billing history record to initiate payment for',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'Payment channel to use',
    example: PaymentChannel.PAYSTACK,
  })
  @IsEnum(PaymentChannel)
  channel: PaymentChannel;

  @ApiProperty({
    description: 'Callback URL to redirect after payment completion',
    example: 'https://example.com/callback',
  })
  @IsOptional()
  @IsUrl()
  callbackUrl?: string;
}

export class ConfirmPaymentDTO {
  @ApiProperty({
    description: 'ID of the billing history record to initiate payment for',
  })
  @IsString()
  reference: string;

  @ApiProperty({
    description: 'just a check if customer what to save the card details',
    example: 'https://example.com/callback',
  })
  @IsOptional()
  @IsBoolean()
  savecard?: boolean;
}
