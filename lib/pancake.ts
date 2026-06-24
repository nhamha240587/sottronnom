const PANCAKE_API_BASE = 'https://pos.pages.fm/api/v1'
const SHOP_ID = process.env.PANCAKE_SHOP_ID || ''
const API_KEY = process.env.PANCAKE_API_KEY || ''
const VARIATION_IDS: Record<string, string> = {
  '500g': process.env.PANCAKE_VAR_500G || '',
  '1kg':  process.env.PANCAKE_VAR_1KG  || '',
}

export async function createPancakeOrder(data: {
  name: string; phone: string; email: string; address: string
  product: '500g' | '1kg'; quantity: number; totalPrice: number; note?: string
}) {
  if (!API_KEY) { console.warn('[pancake] PANCAKE_API_KEY chưa được cấu hình'); return null }
  const variationId = VARIATION_IDS[data.product]
  if (!variationId) { console.warn(`[pancake] PANCAKE_VAR_${data.product.toUpperCase()} chưa cấu hình`); return null }
  const unitPrice = data.totalPrice / data.quantity
  const body = {
    bill_full_name: data.name,
    bill_phone_number: data.phone,
    bill_email: data.email || undefined,
    note: [data.note ? `Ghi chú: ${data.note}` : '', 'Đặt qua website sottronnom.hacofood.vn'].filter(Boolean).join(' | '),
    cod: data.totalPrice,
    shipping_address: { full_name: data.name, phone_number: data.phone, full_address: data.address },
    items: [{ variation_id: variationId, quantity: data.quantity, variation_info: { retail_price: unitPrice } }],
  }
  const url = `${PANCAKE_API_BASE}/shops/${SHOP_ID}/orders?api_key=${API_KEY}`
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  if (!res.ok) { console.error('[pancake] Tạo đơn thất bại:', res.status); return null }
  const json = await res.json()
  console.log('[pancake] Tạo đơn thành công, ID:', json?.data?.id || json?.id)
  return json
}

export async function updatePancakeOrderStatus(orderId: string, status: number) {
  if (!API_KEY) return null
  const url = `${PANCAKE_API_BASE}/shops/${SHOP_ID}/orders/${orderId}?api_key=${API_KEY}`
  const res = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
  if (!res.ok) {
    const errBody = await res.text().catch(() => '(no body)')
    console.warn('[pancake] updateOrderStatus thất bại:', res.status, errBody)
    return null
  }
  return await res.json()
}
