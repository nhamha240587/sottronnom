import { NextRequest, NextResponse } from 'next/server'
import { initDb, insertStnOrder } from '@/lib/db'
import { generateStnRef, buildQRPayload } from '@/lib/sepay'
import { notifyStnPending } from '@/lib/telegram'
import { createPancakeOrder } from '@/lib/pancake'

const PRICES: Record<string, number> = { '500g': 65000, '1kg': 105000 }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, email = '', address, product, quantity, note = '' } = body

    if (!name?.trim() || !phone?.trim() || !address?.trim()) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 })
    }
    if (!PRICES[product]) {
      return NextResponse.json({ error: 'Sản phẩm không hợp lệ' }, { status: 400 })
    }
    const qty = Math.max(1, Math.min(20, parseInt(quantity) || 1))
    const totalPrice = PRICES[product] * qty
    const productLabel = `Sốt Trộn Nộm ${product}`

    await initDb()

    const refCode = generateStnRef(phone)

    const pancakeRes = await createPancakeOrder({ name, phone, email, address, product, quantity: qty, totalPrice, note })
    const pancakeOrderId = pancakeRes?.data?.id ?? pancakeRes?.id ?? null

    await insertStnOrder({ refCode, pancakeOrderId, name, phone, email, address, product, quantity: qty, totalPrice, note })

    await notifyStnPending({ name, phone, address, product: productLabel, quantity: qty, totalPrice, refCode, pancakeOrderId, note })

    const qr = buildQRPayload(refCode, totalPrice)

    return NextResponse.json({ success: true, refCode, totalPrice, productLabel, qr })
  } catch (err) {
    console.error('[order] lỗi:', err)
    return NextResponse.json({ error: 'Lỗi hệ thống, vui lòng thử lại' }, { status: 500 })
  }
}
