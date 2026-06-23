import { NextRequest, NextResponse } from 'next/server'
import { getStnOrderByRef, confirmStnPayment } from '@/lib/db'
import { notifyStnPaid, notifyPaymentMismatch } from '@/lib/telegram'
import { updatePancakeOrderStatus } from '@/lib/pancake'
import type { SepayWebhookPayload } from '@/lib/sepay'

const WEBHOOK_TOKEN = process.env.SEPAY_WEBHOOK_TOKEN || ''

export async function POST(req: NextRequest) {
  try {
    // Fail-closed: thiếu token = từ chối luôn (KHÔNG cho chạy tiếp khi chưa cấu hình)
    if (!WEBHOOK_TOKEN) {
      console.error('[webhook] SEPAY_WEBHOOK_TOKEN chưa cấu hình — từ chối request')
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 503 })
    }
    const auth = req.headers.get('Authorization') || ''
    if (auth !== `Apikey ${WEBHOOK_TOKEN}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload: SepayWebhookPayload = await req.json()
    const content = (payload.content || payload.description || '').toUpperCase()

    const stnMatch = content.match(/STN[A-Z0-9]+/)
    if (!stnMatch) {
      return NextResponse.json({ message: 'not_stn' })
    }

    const refCode = stnMatch[0]
    const order = await getStnOrderByRef(refCode)

    if (!order) {
      console.warn('[webhook] Không tìm thấy đơn STN:', refCode)
      return NextResponse.json({ message: 'order_not_found' })
    }

    if (order.payment_status === 'paid') {
      return NextResponse.json({ message: 'already_paid' })
    }

    if (payload.transferAmount < order.total_price) {
      await notifyPaymentMismatch({
        refCode,
        expectedAmount: order.total_price,
        actualAmount: payload.transferAmount,
        name: order.name,
      })
      return NextResponse.json({ message: 'amount_mismatch' })
    }

    // Atomic: chỉ tiếp tục nếu CHÍNH request này chuyển đơn sang 'paid'
    // (chống race condition khi 2 webhook trùng refCode gọi đồng thời)
    const justConfirmed = await confirmStnPayment(refCode)
    if (!justConfirmed) {
      return NextResponse.json({ message: 'already_paid' })
    }

    let pancakeUpdated = false
    if (order.pancake_order_id) {
      const updated = await updatePancakeOrderStatus(order.pancake_order_id, 9)
      pancakeUpdated = !!updated
    }

    await notifyStnPaid({
      name: order.name,
      phone: order.phone,
      product: order.product,
      quantity: order.quantity,
      totalPrice: order.total_price,
      refCode,
      pancakeOrderId: order.pancake_order_id,
      pancakeUpdated,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[webhook] lỗi:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
