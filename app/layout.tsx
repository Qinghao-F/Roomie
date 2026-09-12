import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://qinghao-f.github.io/Roomie/'),
  title: 'Roomie｜合租生活管家',
  description: '把合租中的账单、值日、物品和公约放进一个清晰的共享空间。',
  openGraph: {
    title: 'Roomie｜合租生活管家',
    description: '合租生活，轻松一点。',
    images: ['https://qinghao-f.github.io/Roomie/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Roomie｜合租生活管家',
    description: '合租生活，轻松一点。',
    images: ['https://qinghao-f.github.io/Roomie/og.png'],
  },
};

export const dynamic = 'force-static';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
