import postgres from 'postgres'

let sql: ReturnType<typeof postgres> | null = null

function getDb() {
  if (!sql) {
    sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' })
  }
  return sql
}

export async function initDb() {
  const db = getDb()
  await db`
    CREATE TABLE IF NOT EXISTS sot_tron_nom_orders (
      id            SERIAL PRIMARY KEY,
      ref_code      TEXT UNIQUE NOT NULL,
      pancake_order_id TEXT,
      name          TEXT NOT NULL,
      phone         TEXT NOT NULL,
      email         TEXT DEFAULT '',
      address       TEXT NOT NULL,
      product       TEXT NOT NULL,
      quantity      INTEGER NOT NULL,
      total_price   INTEGER NOT NULL,
      payment_status TEXT NOT NULL DEFAULT 'pending',
      paid_at       TIMESTAMPTZ,
      note          TEXT DEFAULT '',
      created_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `
}

export interface StnOrder {
  id: number
  ref_code: string
  pancake_order_id: string | null
  name: string
  phone: string
  email: string
  address: string
  product: string
  quantity: number
  total_price: number
  payment_status: string
  paid_at: string | null
  note: string
  created_at: string
}

export async function insertStnOrder(data: {
  refCode: string; pancakeOrderId?: string | null
  name: string; phone: string; email: string; address: string
  product: string; quantity: number; totalPrice: number; note?: string
}) {
  const db = getDb()
  const rows = await db`
    INSERT INTO sot_tron_nom_orders
      (ref_code, pancake_order_id, name, phone, email, address, product, quantity, total_price, note)
    VALUES
      (${data.refCode}, ${data.pancakeOrderId ?? null}, ${data.name}, ${data.phone},
       ${data.email}, ${data.address}, ${data.product}, ${data.quantity}, ${data.totalPrice},
       ${data.note ?? ''})
    RETURNING *
  `
  return rows[0] as StnOrder
}

export async function getStnOrderByRef(refCode: string): Promise<StnOrder | null> {
  const db = getDb()
  const rows = await db`SELECT * FROM sot_tron_nom_orders WHERE ref_code = ${refCode} LIMIT 1`
  return (rows[0] as StnOrder) ?? null
}

/**
 * Đánh dấu đơn đã thanh toán — atomic, chống race condition.
 * Chỉ cập nhật nếu đơn đang KHÁC 'paid'. Trả về true nếu CHÍNH lần gọi này
 * là người chuyển trạng thái (để chỉ gửi Telegram / cập nhật POScake đúng 1 lần).
 */
export async function confirmStnPayment(refCode: string): Promise<boolean> {
  const db = getDb()
  const rows = await db`
    UPDATE sot_tron_nom_orders
    SET payment_status = 'paid', paid_at = NOW()
    WHERE ref_code = ${refCode} AND payment_status != 'paid'
  `
  return rows.count > 0
}

export async function updateStnPancakeId(refCode: string, pancakeOrderId: string) {
  const db = getDb()
  await db`UPDATE sot_tron_nom_orders SET pancake_order_id = ${pancakeOrderId} WHERE ref_code = ${refCode}`
}
