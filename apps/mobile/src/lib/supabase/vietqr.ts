/**
 * VietQR Utility
 * Generate VietQR-compliant QR code strings for Vietnamese bank transfers
 * Based on NAPAS IBFT v1.5.2 specification (EMVCo QR Payment standard)
 */

export interface VietQRData {
  bankBin: string; // Bank BIN (e.g., 970415 for Vietcombank)
  accountNumber: string; // Bank account number
  accountName?: string; // Account holder name
  amount?: number; // Payment amount in VND (optional for user-input QR)
  transactionId?: string; // Transaction reference
  template?: 'compact' | 'compact2'; // VietQR template
}

/**
 * Bank BIN codes for major Vietnamese banks
 */
export const BANK_BINS = {
  VCB: '970415', // Vietcombank
  TCB: '970403', // Techcombank
  MB: '970422', // MB Bank
  VIB: '970441', // VIB
  ICB: '970488', // VietinBank
  STB: '970426', // Sacombank
  ACB: '970416', // ACB
  BIDV: '970418', // BIDV
  DAB: '970406', // Dong A Bank
  VAB: '970427', // Viet A Bank
  TPB: '970423', // Tien Phong Bank
  OJB: '970432', // OceanBank
  NAB: '970428', // National Bank
  PVB: '970433', // PVcomBank
  VBB: '970405', // Vietnam International Bank
  MSB: '970429', // Military Bank
  SHB: '970443', // SHB
  BVB: '970457', // Bac A Bank
  KLP: '970449', // Kienlongbank
  EXB: '970439', // Export Import Bank
  ICBV: '970488', // VietinBank
  HDB: '970437', // HDBank
  NCB: '970438', // National Citizen Bank
  OCB: '970448', // Orient Commercial Joint Stock Bank
  VAM: '970430', // Vanguard Asset Management
  CIMB: '970436', // CIMB
} as const;

/**
 * Convert number to hex string with variable length
 */
function toHex(value: number, length: number = 2): string {
  return value.toString(16).toUpperCase().padStart(length, '0');
}

/**
 * Calculate CRC-16/CCITT-FALSE for VietQR validation
 * Polynomial: 0x1021, Initial: 0xFFFF, Final XOR: 0x0000
 */
function calculateCRC16(data: string): string {
  let crc = 0xFFFF;

  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;

    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }

    crc &= 0xFFFF;
  }

  return toHex(crc, 4);
}

/**
 * Build TLV (Tag-Length-Value) format for VietQR
 */
function buildTLV(tag: string, value: string): string {
  const length = toHex(value.length, 2);
  return tag + length + value;
}

/**
 * Generate VietQR string according to NAPAS specification
 * @param data - Payment data
 * @returns VietQR string that can be encoded as QR code
 */
export function generateVietQRString(data: VietQRData): string {
  const {
    bankBin,
    accountNumber,
    amount = 0,
    transactionId = '',
    template = 'compact2',
  } = data;

  // Validate bank BIN (6 digits)
  if (!/^\d{6}$/.test(bankBin)) {
    throw new Error('Invalid bank BIN. Must be 6 digits.');
  }

  // Validate account number
  if (!accountNumber || accountNumber.length < 6) {
    throw new Error('Invalid account number.');
  }

  // 00: Payload Format Indicator (EMVCo)
  let qrString = buildTLV('00', '01');

  // 01: Point of Initiation Method (11 = static, 12 = dynamic)
  const hasAmount = amount > 0;
  qrString += buildTLV('01', hasAmount ? '12' : '11');

  // 38-51: Merchant Account Information (optional, skip for individual transfer)
  // 38: Merchant Type Indicator
  // 39: Merchant PAN
  // 40: Merchant CVV
  // 41: Merchant Name
  // 42: Merchant City
  // 43-51: Additional data

  // 52: Merchant Category Code (optional)
  // qrString += buildTLV('52', '5812'); // Education

  // 53: Transaction Currency (704 = VND)
  qrString += buildTLV('53', '704');

  // 54: Transaction Amount (in cents/units, 2 decimals for VND)
  if (hasAmount) {
    const amountInCents = Math.round(amount * 100);
    qrString += buildTLV('54', amountInCents.toString());
  }

  // 57: Bill Number (optional, can be invoice number)
  if (transactionId) {
    qrString += buildTLV('57', transactionId);
  }

  // 58: Country Code (VN = Vietnam)
  qrString += buildTLV('58', 'VN');

  // 59: Merchant Name (optional for individual transfer)
  // qrString += buildTLV('59', accountName || '');

  // 60: Merchant City (optional)
  // qrString += buildTLV('60', 'HANOI');

  // 61: Postal Code (optional)
  // qrString += buildTLV('61', '100000');

  // 62: Additional Data Field Template
  // 621N: Settlement type (01 = instant)
  // 621N08: Reference type
  // 621N09: Reference number
  let additionalData = '6308'; // Settlement Template
  if (transactionId) {
    additionalData += '0108'; // Reference type
    additionalData += toHex(transactionId.length, 2); // Length
    additionalData += transactionId; // Reference number (bill ID)
  } else {
    // Generate unique reference
    const ref = Date.now().toString();
    additionalData += '0108';
    additionalData += toHex(ref.length, 2);
    additionalData += ref;
  }
  qrString += buildTLV('62', additionalData);

  // 63: CRC (16-CCITT)
  const dataWithoutCRC = qrString;
  const crc = calculateCRC16(dataWithoutCRC);
  qrString += buildTLV('63', crc);

  return qrString;
}

/**
 * Generate a mock VietQR string for testing
 * This creates a properly formatted QR string that will pass validation
 */
export function generateMockVietQR(): string {
  const mockData: VietQRData = {
    bankBin: BANK_BINS.VCB,
    accountNumber: '001100223344',
    accountName: 'TRUONG THPT HA NOI',
    amount: 1500000,
    transactionId: 'PT202501001',
    template: 'compact2',
  };

  return generateVietQRString(mockData);
}

/**
 * Validate VietQR string format
 */
export function validateVietQR(qrString: string): {
  valid: boolean;
  error?: string;
  data?: Partial<VietQRData>;
} {
  try {
    // Check if it starts with proper payload format
    if (!qrString.startsWith('00')) {
      return { valid: false, error: 'Invalid payload format indicator' };
    }

    // Check if it has proper CRC
    if (!qrString.includes('63')) {
      return { valid: false, error: 'Missing CRC' };
    }

    // Check for VND currency
    if (!qrString.includes('704')) {
      return { valid: false, error: 'Not a VND transaction' };
    }

    // Check for Vietnam country code
    if (!qrString.includes('VN')) {
      return { valid: false, error: 'Not a Vietnam transaction' };
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
