'use client'

import { useState, useRef, useEffect } from 'react'

// â”€â”€â”€ Image paths â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const TP = '/images/sot-tron-nom/thanh-pham/'
const SP = '/images/sot-tron-nom/san-pham/'

const THANH_PHAM = [
  { src: TP + '671299716_1589635609552718_738029760491872038_n.jpg',  label: 'Ná»™m tai heo giÃ²n sáº§n sáº­t' },
  { src: TP + '671637717_1589635616219384_4262068307483531995_n.jpg',  label: 'Gá»i sá»©a trá»™n Ä‘áº­m vá»‹' },
  { src: TP + '671942824_1589635642886048_1414265597271821342_n.jpg',  label: 'Gá»i bÃ² tháº­p cáº©m' },
  { src: TP + '700499489_1617972563385689_2850552707033278554_n.jpg',  label: 'Ná»™m Ä‘u Ä‘á»§ cÃ  rá»‘t' },
  { src: TP + '709226382_1629084295607849_3557552685294265308_n.jpg',  label: 'Gá»i tháº­p cáº©m tÆ°Æ¡i ngon' },
  { src: TP + '709821489_1629084328941179_3825976979159012711_n.jpg',  label: 'Ná»™m rau cá»§ Ä‘áº§y mÃ u sáº¯c' },
  { src: TP + '710125751_1632698565246422_3160895450575285956_n.jpg',  label: 'Gá»i gÃ  xÃ© phay' },
  { src: TP + '710404276_1632696998579912_4738224190452480535_n.jpg',  label: 'Gá»i bÃ² lÃ¡ lá»‘t' },
  { src: TP + '714931363_1632696995246579_5643613255198374783_n.jpg',  label: 'Ná»™m váº¡n nÄƒng mÃ¢m cá»—' },
]

const SAN_PHAM = [
  { src: SP + '76fcdf41-07da-4dbb-be19-f307061e418c.png',  label: 'Sá»‘t Trá»™n Ná»™m Báº¿p CÃ´ Háº¡' },
  { src: SP + '341915de-b59c-4791-b5ed-abb0c84ce760.png', label: 'Sá»‘t cÃ´ Ä‘áº·c bÃ¡m cháº¯c nguyÃªn liá»‡u' },
]

// áº¢nh hero poster (dÃ¹ng riÃªng trong hero section)
const HERO_IMG = SP + '710331986_1632696845246594_3341255585345294524_n.jpg'

const PRICES = { '500g': 65000, '1kg': 105000 }

function fmt(n: number) { return n.toLocaleString('vi-VN') + 'Ä‘' }

// â”€â”€â”€ Order Form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface FormState {
  name: string; phone: string; email: string; address: string
  product: '500g' | '1kg'; quantity: number; note: string
}

interface PaymentData {
  refCode: string
  totalPrice: number
  productLabel: string
  qr: { bankAccount: string; bankCode: string; accountName: string; amount: number; content: string; qrUrl: string }
}

function Countdown({ seconds }: { seconds: number }) {
  const [left, setLeft] = useState(seconds)
  useEffect(() => {
    if (left <= 0) return
    const t = setTimeout(() => setLeft(l => l - 1), 1000)
    return () => clearTimeout(t)
  }, [left])
  const m = Math.floor(left / 60).toString().padStart(2, '0')
  const s = (left % 60).toString().padStart(2, '0')
  return <span className={left < 120 ? 'text-red-500 font-bold' : 'font-bold text-[#006400]'}>{m}:{s}</span>
}

function PaymentStep({ data, form }: { data: PaymentData; form: FormState }) {
  const [copied, setCopied] = useState<'ref' | 'amount' | null>(null)
  function copy(text: string, type: 'ref' | 'amount') {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    })
  }
  return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="text-[#006400] font-extrabold text-lg mb-0.5">BÆ°á»›c 2: Chuyá»ƒn khoáº£n Ä‘á»ƒ xÃ¡c nháº­n Ä‘Æ¡n</p>
        <p className="text-gray-500 text-sm">QuÃ©t QR hoáº·c chuyá»ƒn khoáº£n thá»§ cÃ´ng trong <Countdown seconds={30 * 60} /></p>
      </div>

      {/* QR code */}
      <div className="flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={data.qr.qrUrl} alt="QR chuyá»ƒn khoáº£n"
          className="w-52 h-52 rounded-2xl border-4 border-[#006400] shadow-lg object-contain bg-white" />
      </div>

      {/* Bank info */}
      <div className="bg-[#f0fff4] border border-green-200 rounded-2xl p-4 space-y-2.5 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">NgÃ¢n hÃ ng</span>
          <span className="font-bold">{data.qr.bankCode} â€“ {data.qr.accountName}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Sá»‘ tÃ i khoáº£n</span>
          <span className="font-bold font-mono">{data.qr.bankAccount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Sá»‘ tiá»n</span>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#D97706] text-base">{fmt(data.totalPrice)}</span>
            <button onClick={() => copy(String(data.totalPrice), 'amount')}
              className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-700 px-2 py-0.5 rounded-lg transition-colors">
              {copied === 'amount' ? 'âœ“ ÄÃ£ copy' : 'Copy'}
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center border-t border-green-100 pt-2.5">
          <span className="text-gray-500">Ná»™i dung CK <span className="text-red-500 font-bold">(báº¯t buá»™c)</span></span>
          <div className="flex items-center gap-2">
            <span className="font-extrabold font-mono text-[#006400]">{data.refCode}</span>
            <button onClick={() => copy(data.refCode, 'ref')}
              className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2 py-0.5 rounded-lg transition-colors">
              {copied === 'ref' ? 'âœ“ ÄÃ£ copy' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
        âš ï¸ Nháº­p <strong>Ä‘Ãºng ná»™i dung</strong> <code className="bg-amber-100 px-1 rounded">{data.refCode}</code> khi chuyá»ƒn khoáº£n â€” há»‡ thá»‘ng tá»± Ä‘á»™ng xÃ¡c nháº­n vÃ  Ä‘Æ¡n hÃ ng chuyá»ƒn ngay sang tráº¡ng thÃ¡i <strong>Chá» chuyá»ƒn hÃ ng</strong>.
      </div>

      <div className="text-center text-sm text-gray-400 pt-1">
        <p>ÄÆ¡n cá»§a <strong>{form.name}</strong> Â· {data.productLabel} Ã— {form.quantity}</p>
        <p className="mt-1">Sau khi chuyá»ƒn khoáº£n, Ä‘Æ¡n Ä‘Æ°á»£c xá»­ lÃ½ tá»± Ä‘á»™ng â€” khÃ´ng cáº§n chá» xÃ¡c nháº­n.</p>
      </div>
    </div>
  )
}

function OrderForm() {
  const [form, setForm] = useState<FormState>({
    name: '', phone: '', email: '', address: '',
    product: '500g', quantity: 1, note: '',
  })
  const [step, setStep] = useState<'idle' | 'loading' | 'payment' | 'error'>('idle')
  const [error, setError] = useState('')
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)

  const total = PRICES[form.product] * form.quantity

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm(f => ({ ...f, [k]: v }))
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError('Vui lÃ²ng Ä‘iá»n Ä‘á»§: Há» tÃªn, Sá»‘ Ä‘iá»‡n thoáº¡i, Äá»‹a chá»‰')
      return
    }
    setStep('loading')
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Lá»—i')
      setPaymentData(data)
      setStep('payment')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'CÃ³ lá»—i xáº£y ra')
      setStep('error')
    }
  }

  if (step === 'payment' && paymentData) {
    return <PaymentStep data={paymentData} form={form} />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Product Selection */}
      <div>
        <p className="font-bold text-gray-700 mb-2">Chá»n loáº¡i sáº£n pháº©m *</p>
        <div className="grid grid-cols-2 gap-3">
          {(['500g', '1kg'] as const).map(p => (
            <button type="button" key={p}
              onClick={() => set('product', p)}
              className={`border-2 rounded-xl p-4 text-center transition-all ${
                form.product === p
                  ? 'border-[#006400] bg-[#f0fff4]'
                  : 'border-gray-200 hover:border-amber-300'
              }`}>
              <p className="font-extrabold text-lg text-[#006400]">{p}</p>
              <p className="text-[#D97706] font-bold text-base">{fmt(PRICES[p])}</p>
              {p === '1kg' && (
                <p className="text-xs text-green-600 font-semibold mt-0.5">Tiáº¿t kiá»‡m hÆ¡n 12%</p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <label className="font-bold text-gray-700 mb-2 block">Sá»‘ lÆ°á»£ng *</label>
        <div className="flex items-center gap-3">
          <button type="button"
            onClick={() => set('quantity', Math.max(1, form.quantity - 1))}
            className="w-10 h-10 rounded-full border-2 border-gray-200 text-xl font-bold hover:border-amber-400 transition-colors flex items-center justify-center">
            âˆ’
          </button>
          <span className="w-10 text-center font-bold text-xl text-[#006400]">{form.quantity}</span>
          <button type="button"
            onClick={() => set('quantity', Math.min(20, form.quantity + 1))}
            className="w-10 h-10 rounded-full border-2 border-gray-200 text-xl font-bold hover:border-amber-400 transition-colors flex items-center justify-center">
            +
          </button>
          <span className="ml-2 text-sm text-gray-500">Tá»•ng: <strong className="text-[#D97706] text-base">{fmt(total)}</strong></span>
        </div>
      </div>

      {/* Personal Info */}
      <div>
        <label className="font-bold text-gray-700 mb-2 block">Há» vÃ  tÃªn *</label>
        <input value={form.name} onChange={e => set('name', e.target.value)}
          placeholder="VÃ­ dá»¥: Nguyá»…n Thá»‹ Lan"
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#006400] focus:outline-none transition-colors" />
      </div>
      <div>
        <label className="font-bold text-gray-700 mb-2 block">Sá»‘ Ä‘iá»‡n thoáº¡i *</label>
        <input value={form.phone} onChange={e => set('phone', e.target.value)}
          placeholder="0912 345 678" type="tel"
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#006400] focus:outline-none transition-colors" />
      </div>
      <div>
        <label className="font-bold text-gray-700 mb-2 block">Email <span className="text-gray-400 font-normal">(khÃ´ng báº¯t buá»™c)</span></label>
        <input value={form.email} onChange={e => set('email', e.target.value)}
          placeholder="email@gmail.com" type="email"
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#006400] focus:outline-none transition-colors" />
      </div>
      <div>
        <label className="font-bold text-gray-700 mb-2 block">Äá»‹a chá»‰ giao hÃ ng chi tiáº¿t *</label>
        <textarea value={form.address} onChange={e => set('address', e.target.value)}
          placeholder="Sá»‘ nhÃ , ngÃµ/háº»m, Ä‘Æ°á»ng, phÆ°á»ng/xÃ£, quáº­n/huyá»‡n, tá»‰nh/thÃ nh phá»‘"
          rows={3}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#006400] focus:outline-none transition-colors resize-none" />
      </div>
      <div>
        <label className="font-bold text-gray-700 mb-2 block">Ghi chÃº <span className="text-gray-400 font-normal">(khÃ´ng báº¯t buá»™c)</span></label>
        <input value={form.note} onChange={e => set('note', e.target.value)}
          placeholder="Giao giá» nÃ o, yÃªu cáº§u Ä‘áº·c biá»‡t..."
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#006400] focus:outline-none transition-colors" />
      </div>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 rounded-xl py-2.5 px-4 text-center">{error}</p>
      )}

      <button type="submit" disabled={step === 'loading'}
        className="w-full py-4 rounded-2xl font-extrabold text-white text-lg bg-gradient-to-r from-[#D97706] to-[#B45309] hover:from-[#B45309] hover:to-[#D97706] transition-all active:scale-95 disabled:opacity-60 shadow-lg shadow-amber-200">
        {step === 'loading'
          ? <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>Äang gá»­i Ä‘Æ¡n...
            </span>
          : 'ðŸ›’ Äáº¶T HÃ€NG NGAY â€“ NHáº¬N QR CHUYá»‚N KHOáº¢N'}
      </button>
      <p className="text-xs text-gray-400 text-center">ðŸ”’ ThÃ´ng tin báº£o máº­t tuyá»‡t Ä‘á»‘i Â· XÃ¡c nháº­n Ä‘Æ¡n qua chuyá»ƒn khoáº£n</p>
    </form>
  )
}

// â”€â”€â”€ MAIN PAGE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function SotTronNom() {
  const orderRef = useRef<HTMLDivElement>(null)
  const scrollToOrder = () => orderRef.current?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="min-h-screen bg-[#F4FAF6] font-sans">

      {/* â•â• HERO â•â• */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#003200] via-[#006400] to-[#003200] text-white">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-14">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-2xl px-5 py-3 shadow-xl inline-flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo-bep-co-ha.png" alt="Báº¿p CÃ´ Háº¡"
                className="h-12 w-12 object-contain"
                onError={e => { (e.currentTarget as HTMLImageElement).style.display='none' }} />
              <div>
                <p className="text-[#006400] font-extrabold text-xl leading-tight tracking-tight">Báº¿p CÃ´ Háº¡</p>
                <p className="text-gray-400 text-xs">Hacofood.vn</p>
              </div>
            </div>
          </div>

          {/* Viral badge */}
          <div className="flex justify-center mb-5">
            <span className="bg-red-500 text-white text-sm font-bold px-5 py-1.5 rounded-full animate-bounce shadow">
              ðŸ”¥ Video viral â€“ Triá»‡u lÆ°á»£t xem
            </span>
          </div>

          {/* Headline */}
          <div className="text-center mb-6 max-w-3xl mx-auto">
            <p className="text-green-300 font-semibold text-base mb-2 italic">
              "CÃ³ cÃ¡i mÃ³n ná»™m mÃ  lÃ m khÃ´ng giÃ²n thÃ¬ lÃ m Ä‘Æ°á»£c gÃ¬ cho Ä‘á»i." â€“ Máº¹ em nÃ³i Ä‘áº¥y.
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              Trá»™n Ná»™m 5 PhÃºt,<br />
              <span className="text-[#90EE90]">GiÃ²n Sáº§n Sáº­t, Äáº­m Vá»‹ ÄÃºng Chuáº©n</span>
            </h1>
            <p className="mt-4 text-green-100 text-lg max-w-2xl mx-auto leading-relaxed">
              Sá»‘t Trá»™n Ná»™m Báº¿p CÃ´ Háº¡ â€” Ä‘Ã£ náº¥u cÃ´ Ä‘áº·c, cÃ¢n báº±ng vá»‹ sáºµn.<br className="hidden sm:block" />
              KhÃ´ng cáº§n Ä‘au Ä‘áº§u tra cÃ´ng thá»©c. KhÃ´ng lo máº·n nháº¡t khÃ´ng Ä‘á»u.
            </p>
          </div>

          {/* Product hero image */}
          <div className="flex justify-center mb-8">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 w-full max-w-sm sm:max-w-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={HERO_IMG} alt="Sá»‘t Trá»™n Ná»™m Báº¿p CÃ´ Háº¡"
                className="w-full h-auto object-contain" />
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { icon: 'ðŸŽ¬', text: 'Video triá»‡u lÆ°á»£t xem' },
              { icon: 'ðŸ†', text: 'CÃ´ng thá»©c Ä‘á»™c quyá»n' },
              { icon: 'ðŸŒ¿', text: 'NguyÃªn liá»‡u tá»± nhiÃªn' },
              { icon: 'âš¡', text: 'Trá»™n 5 phÃºt lÃ  xong' },
            ].map(s => (
              <div key={s.text} className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 text-sm border border-white/10">
                <span>{s.icon}</span><span className="font-medium">{s.text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button onClick={scrollToOrder}
              className="bg-gradient-to-r from-[#D97706] to-[#B45309] hover:from-[#B45309] hover:to-[#D97706] text-white font-extrabold text-lg px-10 py-4 rounded-2xl shadow-lg transition-all active:scale-95">
              Äáº·t HÃ ng Ngay â†’
            </button>
            <a href="#thanh-pham"
              className="bg-white/10 border border-white/20 text-white font-bold text-base px-8 py-4 rounded-2xl hover:bg-white/20 transition-colors text-center">
              Xem ThÃ nh Pháº©m
            </a>
          </div>
        </div>
      </section>

      {/* â•â• PAIN AGITATION â•â• */}
      <section className="py-14 px-4 sm:px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block border border-red-200 bg-red-50 text-red-600 font-bold text-xs px-4 py-1.5 rounded-full tracking-widest mb-4">
            Báº N CÃ“ ÄANG Máº®C NHá»®NG Lá»–I NÃ€Y?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-8">
            Táº¡i Sao ÄÄ©a Ná»™m NhÃ  Báº¡n<br />
            <span className="text-red-500">LÃºc Máº·n, LÃºc Nháº¡t, LÃºc Xáº¹p Xáº¹p?</span>
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 text-left">
            {[
              { icon: 'ðŸ˜©', t: 'Tra gia vá»‹ theo cáº£m giÃ¡c', d: 'Má»—i láº§n má»™t kiá»ƒu. KhÃ´ng bao giá» ra Ä‘Ãºng vá»‹ cÅ©. KhÃ¡ch khen má»™t hÃ´m, hÃ´m sau láº¡i báº£o nháº¡t.' },
              { icon: 'ðŸ’§', t: 'NÆ°á»›c trá»™n loÃ£ng, cháº£y háº¿t', d: 'Bá» cÃ´ng trá»™n xong, nÆ°á»›c trá»™n cháº£y xuá»‘ng Ä‘Ã¡y Ä‘Ä©a. NguyÃªn liá»‡u khÃ´ng ngáº¥m gia vá»‹. Ä‚n vÃ o nháº¡t tháº¿ch.' },
              { icon: 'ðŸ¥€', t: 'Rau xáº¹p, ná»™m khÃ´ng Ä‘áº¹p', d: 'BÃ³p muá»‘i xong váº¯t khÃ´ â€” rau teo láº¡i, Ä‘Ä©a ná»™m trÃ´ng xá»‰n xá»‹n. Dá»n lÃªn mÃ¢m ngáº¡i ngÃ¹ng vá»›i khÃ¡ch.' },
              { icon: 'â°', t: 'Máº¥t cáº£ tiáº¿ng Ä‘á»“ng há»“', d: 'TÃ­nh toÃ¡n tá»«ng gia vá»‹, nÃªm thá»­ Ä‘i thá»­ láº¡i nhiá»u láº§n. Káº¿t quáº£ váº«n khÃ´ng báº±ng ngoÃ i hÃ ng.' },
            ].map(item => (
              <div key={item.t} className="flex gap-4 bg-red-50 rounded-2xl p-5">
                <span className="text-3xl flex-shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <p className="font-bold text-gray-800 mb-1">{item.t}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.d}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-gray-600 text-base max-w-xl mx-auto">
            KhÃ´ng pháº£i lá»—i cá»§a báº¡n. CÃ´ng thá»©c trá»™n ná»™m chuáº©n cáº§n nhiá»u nÄƒm kinh nghiá»‡m Ä‘á»ƒ cÃ¢n báº±ng Ä‘Ãºng.
            <strong className="text-[#006400]"> Cho Ä‘áº¿n khi cÃ³ chai sá»‘t nÃ y.</strong>
          </p>
        </div>
      </section>

      {/* â•â• GALLERY THÃ€NH PHáº¨M â•â• */}
      <section id="thanh-pham" className="py-14 px-4 sm:px-6 bg-[#F4FAF6]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <span className="inline-block border border-[#90EE90] bg-[#f0fff4] text-[#006400] font-bold text-xs px-5 py-1.5 rounded-full tracking-widest mb-3">
              THÃ€NH PHáº¨M
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
              Chá»‰ 5 PhÃºt â€” Ra Ngay ÄÄ©a Ná»™m<br />
              <span className="text-[#D97706]">Äáº¹p NhÆ° NhÃ  HÃ ng, GiÃ²n NhÆ° NgoÃ i QuÃ¡n</span>
            </h2>
          </div>

          {/* Row 1: 3 images tall */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-2 sm:mb-3 h-52 sm:h-72">
            {THANH_PHAM.slice(0, 3).map(item => (
              <div key={item.label} className="relative rounded-xl sm:rounded-2xl overflow-hidden group shadow-md h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt={item.label}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <p className="absolute bottom-2 left-2 text-white text-xs sm:text-sm font-semibold drop-shadow leading-tight">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Row 2: 3 images medium */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-2 sm:mb-3 h-44 sm:h-56">
            {THANH_PHAM.slice(3, 6).map(item => (
              <div key={item.label} className="relative rounded-xl sm:rounded-2xl overflow-hidden group shadow-sm h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt={item.label}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <p className="absolute bottom-2 left-2 text-white text-xs font-semibold drop-shadow leading-tight">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Row 3: 3 images */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 h-44 sm:h-56">
            {THANH_PHAM.slice(6, 9).map(item => (
              <div key={item.label} className="relative rounded-xl sm:rounded-2xl overflow-hidden group shadow-sm h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt={item.label}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <p className="absolute bottom-2 left-2 text-white text-xs font-semibold drop-shadow leading-tight">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button onClick={scrollToOrder}
              className="bg-gradient-to-r from-[#D97706] to-[#B45309] text-white font-bold px-8 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95">
              TÃ´i Muá»‘n Thá»­ Ngay â†’
            </button>
          </div>
        </div>
      </section>

      {/* â•â• SOLUTION / MECHANISM â•â• */}
      <section className="py-14 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left: Product image */}
            <div className="relative flex justify-center">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl max-w-xs w-full" style={{ aspectRatio: '3/4' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/co-ha-portrait.png" alt="CÃ´ Háº¡ â€“ Báº¿p CÃ´ Háº¡"
                  className="w-full h-full object-cover object-top" />
              </div>
              <div className="absolute -top-3 -right-3 bg-[#D97706] text-white font-extrabold text-sm px-4 py-2 rounded-full shadow-lg rotate-6">
                CÃ´ng thá»©c<br />Ä‘á»™c quyá»n
              </div>
            </div>

            {/* Right: Copy */}
            <div>
              <span className="inline-block border border-[#90EE90] bg-[#f0fff4] text-[#006400] font-bold text-xs px-4 py-1.5 rounded-full tracking-widest mb-4">
                GIáº¢I PHÃP
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-4">
                Gáº·p CÃ´ Háº¡.<br />
                <span className="text-[#D97706]">Sá»‘t Trá»™n Ná»™m Váº¡n NÄƒng</span><br />
                ÄÃ£ Náº¥u CÃ´ Äáº·c Sáºµn Cho Báº¡n.
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Sau nhiá»u nÄƒm náº¥u nÆ°á»›ng vÃ  hÃ ng chá»¥c video viral vá» ná»™m gá»i,
                CÃ´ Háº¡ Ä‘Ã£ chiáº¿t xuáº¥t toÃ n bá»™ bÃ­ quyáº¿t gia vá»‹ vÃ o má»™t chai sá»‘t duy nháº¥t.
                <strong className="text-gray-800"> Báº¡n chá»‰ cáº§n Ä‘á»• vÃ o, trá»™n Ä‘á»u â€” lÃ  xong.</strong>
              </p>

              <div className="space-y-3">
                {[
                  { icon: 'ðŸ”‘', t: 'Náº¥u cÃ´ Ä‘áº·c â€” bÃ¡m cháº¯c nguyÃªn liá»‡u', d: 'KhÃ´ng nhÆ° nÆ°á»›c trá»™n thÃ´ng thÆ°á»ng. Sá»‘t sá»‡t, bÃ¡m vÃ o tá»«ng sá»£i rau, tá»«ng miáº¿ng thá»‹t. KhÃ´ng bá»‹ cháº£y loÃ£ng xuá»‘ng Ä‘Ã¡y Ä‘Ä©a.' },
                  { icon: 'âš–ï¸', t: 'CÃ¢n báº±ng vá»‹ sáºµn â€” khÃ´ng cáº§n tra thÃªm', d: 'Chua, máº·n, ngá»t, cay Ä‘Ã£ Ä‘Æ°á»£c tÃ­nh toÃ¡n chuáº©n xÃ¡c. Chá»‰ cáº§n 50â€“80ml cho 500g nguyÃªn liá»‡u lÃ  Ä‘á»§.' },
                  { icon: 'ðŸ¥—', t: 'Váº¡n nÄƒng â€” dÃ¹ng cho má»i loáº¡i gá»i', d: 'Tai heo, sá»©a, bÃ², gÃ , rau cá»§, tháº­p cáº©m. Gá»i chay láº«n máº·n Ä‘á»u dÃ¹ng Ä‘Æ°á»£c tá»‘t.' },
                  { icon: 'âš¡', t: '5 phÃºt lÃ  cÃ³ Ä‘Ä©a ná»™m Ä‘Ã£i khÃ¡ch', d: 'KhÃ´ng cáº§n Ä‘au Ä‘áº§u tÃ­nh cÃ´ng thá»©c. KhÃ´ng sá»£ sai vá»‹. CÃ³ khÃ¡ch báº¥t ngá» cÅ©ng tá»± tin lÃ m ngay.' },
                ].map(item => (
                  <div key={item.t} className="flex gap-3">
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{item.t}</p>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* â•â• USE CASES â•â• */}
      <section className="py-12 px-4 sm:px-6 bg-[#F4FAF6]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2">
            DÃ¹ng ÄÆ°á»£c Cho Táº¥t Cáº£ CÃ¡c Loáº¡i Gá»i
          </h2>
          <p className="text-gray-500 mb-8">Má»™t chai sá»‘t â€” trÄƒm mÃ³n ngon</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { icon: 'ðŸ·', name: 'Gá»i tai heo', sub: 'GiÃ²n sáº§n sáº­t' },
              { icon: 'ðŸ¦‘', name: 'Gá»i sá»©a', sub: 'Äáº­m Ä‘Ã  hÆ¡n' },
              { icon: 'ðŸ¥©', name: 'Gá»i bÃ²', sub: 'Tháº¥m vá»‹ nhanh' },
              { icon: 'ðŸ”', name: 'Gá»i gÃ  xÃ©', sub: 'Chuáº©n vá»‹ quÃ¡n' },
              { icon: 'ðŸ¥•', name: 'Ná»™m Ä‘u Ä‘á»§', sub: 'MÃ u sáº¯c tÆ°Æ¡i ngon' },
              { icon: 'ðŸŒ¿', name: 'Gá»i chay', sub: 'Thanh nháº¹, Ä‘á»§ vá»‹' },
            ].map(item => (
              <div key={item.name} className="bg-white rounded-2xl p-5 shadow-sm text-center">
                <span className="text-4xl">{item.icon}</span>
                <p className="font-bold text-gray-800 mt-2">{item.name}</p>
                <p className="text-sm text-[#006400]">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â•â• INGREDIENTS & USAGE â•â• */}
      <section className="py-14 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* ThÃ nh pháº§n */}
            <div className="bg-[#F4FAF6] rounded-3xl p-6 border border-green-100">
              <h3 className="font-extrabold text-xl text-[#006400] mb-4">ðŸŒ¿ ThÃ nh Pháº§n</h3>
              <p className="text-gray-600 leading-relaxed mb-3">
                NÆ°á»›c máº¯m ngon Â· ÄÆ°á»ng kÃ­nh Â· Quáº¥t (chanh) Â· Tá»i Â· á»št Â· Giáº¥m Â· Muá»‘i Â· Gia vá»‹ tá»•ng há»£p
              </p>
              <div className="bg-green-100 rounded-xl px-4 py-3">
                <p className="text-[#006400] font-bold text-sm">+ CÃ´ng thá»©c bÃ­ máº­t cá»§a Báº¿p CÃ´ Háº¡</p>
                <p className="text-green-800 text-xs mt-0.5">Chá»‰ cÃ³ 1 nÆ¡i sáº£n xuáº¥t, khÃ´ng nÆ¡i nÃ o khÃ¡c</p>
              </div>
            </div>

            {/* HÆ°á»›ng dáº«n */}
            <div className="bg-[#F0FFF4] rounded-3xl p-6 border border-green-100">
              <h3 className="font-extrabold text-xl text-[#006400] mb-4">ðŸ“‹ HÆ°á»›ng Dáº«n Sá»­ Dá»¥ng</h3>
              <ol className="space-y-2.5 text-gray-600 text-sm">
                <li className="flex gap-2.5"><span className="bg-[#006400] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span><span>NgÃ¢m rau cá»§ trong nÆ°á»›c Ä‘Ã¡ + muá»‘i + giáº¥m 15â€“20 phÃºt Ä‘á»ƒ giÃ²n (bÃ­ quyáº¿t tá»« video viral cá»§a CÃ´ Háº¡!)</span></li>
                <li className="flex gap-2.5"><span className="bg-[#006400] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span><span>Vá»›t rau ra, Ä‘á»ƒ rÃ¡o nÆ°á»›c</span></li>
                <li className="flex gap-2.5"><span className="bg-[#006400] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span><span>Cho <strong>50â€“80ml sá»‘t / 500g nguyÃªn liá»‡u</strong> vÃ o trá»™n Ä‘á»u</span></li>
                <li className="flex gap-2.5"><span className="bg-[#006400] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span><span>Äá»ƒ ngáº¥m 10â€“15 phÃºt trÆ°á»›c khi Äƒn</span></li>
                <li className="flex gap-2.5"><span className="bg-[#006400] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">5</span><span>Ráº¯c Ä‘áº­u phá»™ng rang, hÃ nh phi, rau thÆ¡m, á»›t sá»£i lÃªn trÃªn. HoÃ n thÃ nh!</span></li>
              </ol>
            </div>

            {/* Máº¹o */}
            <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100">
              <h3 className="font-extrabold text-xl text-blue-700 mb-4">ðŸ’¡ BÃ­ Quyáº¿t Ngon HÆ¡n</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex gap-2">âœ… <span>Sá»‘t Ä‘Ã£ cÃ¢n báº±ng vá»‹ â€” <strong>khÃ´ng cáº§n thÃªm gia vá»‹</strong></span></li>
                <li className="flex gap-2">ðŸŒ¶ï¸ <span>Muá»‘n cay hÆ¡n: thÃªm á»›t bÄƒm tÆ°Æ¡i</span></li>
                <li className="flex gap-2">ðŸ¥¬ <span>Rau, thá»‹t pháº£i <strong>rÃ¡o háº¿t nÆ°á»›c</strong> trÆ°á»›c khi trá»™n Ä‘á»ƒ gá»i khÃ´ng bá»‹ nhÃ£o</span></li>
                <li className="flex gap-2">ðŸ‘… <span>Trá»™n lÆ°á»£ng nhá» trÆ°á»›c, náº¿m thá»­ rá»“i Ä‘iá»u chá»‰nh theo kháº©u vá»‹ gia Ä‘Ã¬nh</span></li>
              </ul>
            </div>

            {/* Báº£o quáº£n */}
            <div className="bg-purple-50 rounded-3xl p-6 border border-purple-100">
              <h3 className="font-extrabold text-xl text-purple-700 mb-4">ðŸ§Š Báº£o Quáº£n</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">â„ï¸</span>
                  <div>
                    <p className="font-bold text-gray-800">NgÄƒn Ä‘Ã´ng</p>
                    <p className="text-gray-500 text-sm">DÃ¹ng Ä‘Æ°á»£c <strong>6 thÃ¡ng</strong></p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">ðŸŒ¡ï¸</span>
                  <div>
                    <p className="font-bold text-gray-800">NgÄƒn mÃ¡t</p>
                    <p className="text-gray-500 text-sm">DÃ¹ng Ä‘Æ°á»£c <strong>1 thÃ¡ng</strong></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* â•â• PRODUCT IMAGES (Social Proof tá»« video) â•â• */}
      <section className="py-14 px-4 sm:px-6 bg-[#F4FAF6]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <span className="inline-block border border-amber-300 bg-green-100 text-[#006400] font-bold text-xs px-4 py-1.5 rounded-full tracking-widest mb-3">
              VIRAL TRÃŠN Máº NG XÃƒ Há»˜I
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
              HÃ ng Triá»‡u NgÆ°á»i Xem Video CÃ´ Háº¡<br />
              <span className="text-[#D97706]">ÄÃ£ Biáº¿t BÃ­ Quyáº¿t NÃ y</span>
            </h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              Chai sá»‘t trá»™n ná»™m xuáº¥t hiá»‡n trong cÃ¡c video triá»‡u view â€” bÃ¢y giá» báº¡n cÃ³ thá»ƒ mua vá» dÃ¹ng ngay táº¡i nhÃ 
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {SAN_PHAM.map(img => (
              <div key={img.label} className="rounded-3xl overflow-hidden shadow-lg bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt={img.label}
                  className="w-full h-auto object-contain" />
                <p className="text-center text-sm font-semibold text-gray-700 py-3 px-4">{img.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-green-100 rounded-3xl p-6 text-center max-w-2xl mx-auto">
            <p className="text-[#006400] font-bold text-lg mb-2">
              "Chá»‰ cáº§n má»™t chai nhá» tháº¿ nÃ y thÃ´i lÃ  gia Ä‘Ã¬nh Ä‘Ã£ Äƒn Ä‘Æ°á»£c máº¥y bá»¯a rá»“i."
            </p>
            <p className="text-green-800 text-sm italic">â€” CÃ´ Háº¡, trong video viral triá»‡u lÆ°á»£t xem</p>
          </div>
        </div>
      </section>

      {/* â•â• PRICING + ORDER FORM â•â• */}
      <section ref={orderRef} id="dat-hang" className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block border border-[#90EE90] bg-[#f0fff4] text-[#006400] font-bold text-xs px-5 py-1.5 rounded-full tracking-widest mb-3">
              Äáº¶T HÃ€NG
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2">
              Mang Sá»‘t Trá»™n Ná»™m Báº¿p CÃ´ Háº¡<br />
              <span className="text-[#D97706]">Vá» Tá»§ Láº¡nh NhÃ  Báº¡n HÃ´m Nay</span>
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Giao táº­n nhÃ  toÃ n quá»‘c Â· Thanh toÃ¡n khi nháº­n hÃ ng Â· Äáº£m báº£o hÃ ng chÃ­nh hÃ£ng tá»« Báº¿p CÃ´ Háº¡
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Left: Value & Pricing */}
            <div>
              <div className="space-y-4 mb-8">
                {[
                  { size: '500g', price: 65000, sub: 'PhÃ¹ há»£p gia Ä‘Ã¬nh 3â€“4 ngÆ°á»i', icon: 'ðŸ¶', popular: false },
                  { size: '1kg',  price: 105000, sub: 'Tiáº¿t kiá»‡m 12% Â· DÃ¹ng cho tiá»‡c, Ä‘áº·t nhiá»u', icon: 'ðŸº', popular: true },
                ].map(item => (
                  <div key={item.size} className={`relative rounded-2xl p-5 border-2 ${
                    item.popular ? 'border-[#006400] bg-[#f0fff4]' : 'border-gray-200 bg-gray-50'
                  }`}>
                    {item.popular && (
                      <span className="absolute -top-3 left-4 bg-[#006400] text-white text-xs font-bold px-3 py-1 rounded-full">
                        Phá»• biáº¿n nháº¥t
                      </span>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{item.icon}</span>
                        <div>
                          <p className="font-extrabold text-gray-800 text-lg">Chai {item.size}</p>
                          <p className="text-gray-500 text-sm">{item.sub}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-2xl text-[#D97706]">{fmt(item.price)}</p>
                        <p className="text-gray-400 text-xs">/chai</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Guarantees */}
              <div className="space-y-3">
                {[
                  { icon: 'ðŸšš', t: 'Giao hÃ ng toÃ n quá»‘c', d: 'Ship táº­n nhÃ , Ä‘Ã³ng gÃ³i cháº¯c cháº¯n' },
                  { icon: 'ðŸ’³', t: 'COD â€“ Thanh toÃ¡n khi nháº­n hÃ ng', d: 'Nháº­n hÃ ng, kiá»ƒm tra á»•n má»›i tráº£ tiá»n' },
                  { icon: 'âœ…', t: 'HÃ ng chÃ­nh hÃ£ng Báº¿p CÃ´ Háº¡', d: 'Sáº£n xuáº¥t theo cÃ´ng thá»©c Ä‘á»™c quyá»n' },
                  { icon: 'ðŸ§Š', t: 'Giao hÃ ng Ä‘áº£m báº£o cháº¥t lÆ°á»£ng', d: 'ÄÃ³ng gÃ³i cáº©n tháº­n, khÃ´ng bá»‹ vá»¡, rÃ²' },
                ].map(item => (
                  <div key={item.t} className="flex gap-3 items-start">
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{item.t}</p>
                      <p className="text-gray-500 text-xs">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Order Form */}
            <div className="bg-[#F4FAF6] rounded-3xl p-6 sm:p-8 border border-green-200 shadow-lg">
              <h3 className="font-extrabold text-xl text-[#006400] mb-6 text-center">
                Äiá»n ThÃ´ng Tin Äáº·t HÃ ng
              </h3>
              <OrderForm />
            </div>
          </div>
        </div>
      </section>

      {/* â•â• P.S. / URGENCY â•â• */}
      <section className="py-10 px-4 sm:px-6 bg-gradient-to-r from-[#003200] to-[#006400] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-green-200 text-sm font-semibold mb-2">P.S.</p>
          <p className="text-lg leading-relaxed">
            Má»—i mÃ¢m cá»—, má»—i bá»¯a tiá»‡c Ä‘á»u xá»©ng Ä‘Ã¡ng cÃ³ má»™t Ä‘Ä©a ná»™m <strong>giÃ²n sáº§n sáº­t, Ä‘áº­m vá»‹ chuáº©n</strong>.
            Äá»«ng Ä‘á»ƒ khÃ¡ch khen báº¿p nhÃ  hÃ ng trong khi báº¡n Ä‘ang cÃ³ bÃ­ quyáº¿t trong tay.
          </p>
          <button onClick={scrollToOrder}
            className="mt-6 bg-[#D97706] hover:bg-[#B45309] text-white font-extrabold px-10 py-4 rounded-2xl transition-colors active:scale-95 text-lg">
            Äáº·t HÃ ng Ngay â†’
          </button>
        </div>
      </section>

      {/* â•â• FOOTER â•â• */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4 sm:px-6 text-center text-sm">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="flex justify-center">
            <div className="bg-white rounded-xl px-4 py-2 inline-flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo-bep-co-ha.png" alt="Báº¿p CÃ´ Háº¡"
                className="h-9 w-9 object-contain"
                onError={e => { (e.currentTarget as HTMLImageElement).style.display='none' }} />
              <div className="text-left">
                <p className="text-[#006400] font-extrabold text-base leading-tight">Báº¿p CÃ´ Háº¡</p>
                <p className="text-gray-400 text-xs">Hacofood.vn</p>
              </div>
            </div>
          </div>
          <p>Sá»‘t Trá»™n Ná»™m Báº¿p CÃ´ Háº¡ â€” Sáº£n xuáº¥t theo cÃ´ng thá»©c Ä‘á»™c quyá»n</p>
          <p>Má»i tháº¯c máº¯c liÃªn há»‡ qua: <strong className="text-gray-300">Facebook: Báº¿p CÃ´ Háº¡</strong> hoáº·c sá»‘ Ä‘iá»‡n thoáº¡i trÃªn bao bÃ¬</p>
          <p className="text-gray-600 text-xs">Â© 2025 Hacofood.vn Â· Báº¿p CÃ´ Háº¡. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}

