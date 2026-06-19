const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const GROUP_ID = process.env.TELEGRAM_ORDER_GROUP_ID || ''

async function sendTelegram(chatId: string, text: string) {
  if (!BOT_TOKEN || !chatId) return
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  }).catch(e => console.warn('[telegram] lỗi gửi tin:', e))
}

export async function notifyStnPending(data: {
  name: string; phone: string; address: string
  product: string; quantity: number; totalPrice: number
  refCode: string; pancakeOrderId?: string | null; note?: string
}) {
  const lines = [
    `🟡 <b>ĐƠN MỚI – Sốt Trộn Nộm</b>`,
    ``,
    `👤 <b>${data.name}</b> · ${data.phone}`,
    `📦 ${data.product} × ${data.quantity} = <b>${data.totalPrice.toLocaleString('vi-VN')}đ</b>`,
    `📍 ${data.address}`,
    data.note ? `📝 ${data.note}` : '',
    ``,
    `🔑 Mã CK: <code>${data.refCode}</code>`,
    data.pancakeOrderId ? `📋 POScake ID: <b>${data.pancakeOrderId}</b>` : `⚠️ POScake: chưa tạo được đơn`,
    ``,
    `⏳ Chờ khách chuyển khoản...`,
  ].filter(l => l !== undefined)
  await sendTelegram(GROUP_ID, lines.join('\n'))
}

export async function notifyStnPaid(data: {
  name: string; phone: string; product: string; quantity: number
  totalPrice: number; refCode: string
  pancakeOrderId?: string | null; pancakeUpdated: boolean
}) {
  const lines = [
    `✅ <b>ĐÃ THANH TOÁN – Sốt Trộn Nộm</b>`,
    ``,
    `👤 <b>${data.name}</b> · ${data.phone}`,
    `📦 ${data.product} × ${data.quantity} = <b>${data.totalPrice.toLocaleString('vi-VN')}đ</b>`,
    `🔑 Mã CK: <code>${data.refCode}</code>`,
    data.pancakeOrderId ? `📋 POScake ID: <b>${data.pancakeOrderId}</b>` : '',
    ``,
    data.pancakeUpdated
      ? `🚀 POScake tự động → <b>Chờ chuyển hàng</b>`
      : `⚠️ POScake chưa cập nhật tự động — vui lòng chuyển đơn sang <b>Chờ chuyển hàng</b> thủ công`,
  ].filter(l => l !== undefined)
  await sendTelegram(GROUP_ID, lines.join('\n'))
}

export async function notifyPaymentMismatch(data: {
  refCode: string; expectedAmount: number; actualAmount: number; name: string
}) {
  const text = [
    `⚠️ <b>TIỀN KHÔNG KHỚP – Sốt Trộn Nộm</b>`,
    ``,
    `🔑 Mã: <code>${data.refCode}</code>`,
    `👤 ${data.name}`,
    `💰 Cần: <b>${data.expectedAmount.toLocaleString('vi-VN')}đ</b>`,
    `💸 Nhận: <b>${data.actualAmount.toLocaleString('vi-VN')}đ</b>`,
    ``,
    `→ Kiểm tra và xử lý thủ công`,
  ].join('\n')
  await sendTelegram(GROUP_ID, text)
}
