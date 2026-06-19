import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sốt Trộn Nộm Bếp Cô Hạ – Trộn 5 Phút, Giòn Sần Sật',
  description: 'Sốt Trộn Nộm đặc biệt từ Bếp Cô Hạ – nấu cô đặc, cân bằng vị sẵn. Trộn gỏi 5 phút là xong. Giao toàn quốc.',
  openGraph: {
    title: 'Sốt Trộn Nộm Bếp Cô Hạ',
    description: 'Trộn nộm 5 phút – giòn sần sật, đậm vị đúng chuẩn',
    locale: 'vi_VN',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}
