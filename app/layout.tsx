import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://sottronnom.hacofood.vn'),
  title: 'Sốt Trộn Nộm Bếp Cô Hạ – Trộn 5 Phút, Giòn Sần Sật',
  description: 'Sốt Trộn Nộm Bếp Cô Hạ – nấu cô đặc, cân bằng vị sẵn. Trộn gỏi 5 phút là xong. Giao toàn quốc.',
  openGraph: {
    title: 'Sốt Trộn Nộm Bếp Cô Hạ – Trộn 5 Phút, Giòn Sần Sật',
    description: 'Sốt cô đặc, cân bằng vị sẵn. Trộn nộm 5 phút – giòn sần sật, đậm vị đúng chuẩn. Giao toàn quốc.',
    url: 'https://sottronnom.hacofood.vn',
    siteName: 'Bếp Cô Hạ – Hacofood.vn',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/images/sot-tron-nom/san-pham/76fcdf41-07da-4dbb-be19-f307061e418c.png',
        width: 1200,
        height: 630,
        alt: 'Sốt Trộn Nộm Bếp Cô Hạ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sốt Trộn Nộm Bếp Cô Hạ – Trộn 5 Phút, Giòn Sần Sật',
    description: 'Sốt cô đặc, cân bằng vị sẵn. Trộn nộm 5 phút – giòn sần sật, đậm vị đúng chuẩn.',
    images: ['/images/sot-tron-nom/san-pham/76fcdf41-07da-4dbb-be19-f307061e418c.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}
