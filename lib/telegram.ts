const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const GROUP_ID = process.env.TELEGRAM_ORDER_GROUP_ID || ''

// Escape ký tự đặc biệt để Telegram parse_mode=HTML không bị lỗi 400
// (vd khách nhập tên/địa chỉ có < > & sẽ làm hỏng tin nhắn → mất thông báo đơn)
function esc(s: unknown): string {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

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
    `🟡 <b>ĐƠN MỚI – CHƯA THANH TOÁN – Sốt Trộn Nộm</b>`,
    ``,
    `· <b>${esc(data.name)}</b> · ${esc(data.phone)}`,
    `· ${esc(data.product)} × ${data.quantity} = <b>${data.totalPrice.toLocaleString('vi-VN')}đ</b>`,
    `· ${esc(data.address)}`,
    data.note ? `· Ghi chú: ${esc(data.note)}` : '',
    ``,
    `· Mã CK: <code>${esc(data.refCode)}</code>`,
    data.pancakeOrderId ? `· POScake ID: <b>${esc(data.pancakeOrderId)}</b>` : `· POScake: chưa tạo được đơn`,
    ``,
    `Chờ khách chuyển khoản...`,
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
    `👤 <b>${esc(data.name)}</b> · ${esc(data.phone)}`,
    `📦 ${esc(data.product)} × ${data.quantity} = <b>${data.totalPrice.toLocaleString('vi-VN')}đ</b>`,
    `🔑 Mã CK: <code>${esc(data.refCode)}</code>`,
    data.pancakeOrderId ? `📋 POScake ID: <b>${esc(data.pancakeOrderId)}</b>` : '',
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
    `🔑 Mã: <code>${esc(data.refCode)}</code>`,
    `👤 ${esc(data.name)}`,
    `💰 Cần: <b>${data.expectedAmount.toLocaleString('vi-VN')}đ</b>`,
    `💸 Nhận: <b>${data.actualAmount.toLocaleString('vi-VN')}đ</b>`,
    ``,
    `→ Kiểm tra và xử lý thủ công`,
  ].join('\n')
  await sendTelegram(GROUP_ID, text)
}
