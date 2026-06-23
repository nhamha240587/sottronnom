export interface SepayWebhookPayload {
  id: number
  gateway: string
  transactionDate: string
  accountNumber: string
  code: string | null
  content: string
  transferType: string
  transferAmount: number
  accumulated: number
  subAccount: string | null
  referenceCode: string
  description: string
}

import { randomBytes } from 'crypto'

export function generateStnRef(phone: string): string {
  const ts = Date.now().toString().slice(-6)
  const phonePart = phone.replace(/\D/g, '').slice(-4)
  // 4 ký tự ngẫu nhiên để mã khó đoán + tránh trùng (ref_code là UNIQUE trong DB)
  const rand = randomBytes(2).toString('hex').toUpperCase()
  return `STN${phonePart}${ts}${rand}`
}

export function buildQRPayload(ref: string, amount: number) {
  const bankAccount = process.env.SEPAY_BANK_ACCOUNT || ''
  const bankCode = process.env.SEPAY_BANK_CODE || 'MB'
  const accountName = process.env.SEPAY_ACCOUNT_NAME || 'BEP CO HA'
  return {
    bankAccount,
    bankCode,
    accountName,
    amount,
    content: ref,
    qrUrl: `https://qr.sepay.vn/img?bank=${bankCode}&acc=${bankAccount}&template=compact&amount=${amount}&des=${encodeURIComponent(ref)}`,
  }
}
