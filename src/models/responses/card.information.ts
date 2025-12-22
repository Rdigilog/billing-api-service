import { ApiProperty } from '@nestjs/swagger';

export class CardInformationDto {
  @ApiProperty({
    description: 'Card ID (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Company ID the card belongs to',
    example: 'company-uuid-123',
  })
  companyId: string;

  @ApiProperty({
    description: 'Authorization code from payment provider',
    example: 'AUTH_abc123',
  })
  authorizationCode: string;

  @ApiProperty({ description: 'Last 4 digits of the card', example: '4242' })
  last4: string;

  @ApiProperty({ description: 'Card expiration month', example: '12' })
  expMonth: string;

  @ApiProperty({ description: 'Card expiration year', example: '2026' })
  expYear: string;

  @ApiProperty({ description: 'Card type', example: 'debit' })
  cardType: string;

  @ApiProperty({ description: 'Card brand', example: 'Visa' })
  brand: string;

  @ApiProperty({ description: 'Bank name', example: 'First Bank of Nigeria' })
  bank: string;

  @ApiProperty({ description: 'Payment channel', example: 'card' })
  channel: string;

  @ApiProperty({ description: 'Currency of the card', example: 'NGN' })
  currency: string;

  @ApiProperty({ description: 'Whether the card is reusable', example: true })
  reusable: boolean;

  @ApiProperty({
    description: 'Date the card was created',
    example: '2025-12-22T12:34:56.789Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date the card was last updated',
    example: '2025-12-22T12:34:56.789Z',
  })
  updatedAt: Date;
}
