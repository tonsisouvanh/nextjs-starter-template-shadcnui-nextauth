import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Noto_Sans_Lao } from 'next/font/google';
import ReactQueryProvider from '@/lib/provider/ReactQueryProvider';
import { Toaster } from '@/components/ui/toaster';
import Providers from '@/lib/provider/Provider';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});
const notoSansLao = Noto_Sans_Lao({
  subsets: ['lao'],
  display: 'swap',
  weight: ['400', '500', '700'],
});
export const metadata: Metadata = {
  title: 'Heineken',
  description: 'Heineken beer - Enjoy the best quality beer from Heineken.',
  icons: {
    icon: ['/favicon.ico?v=4'],
    // apple: ['/apple-touch-icon.png?v=4'],
    // shortcut: ['/apple-touch-icon.png'],
  },
  openGraph: {
    title: 'HEINEKEN | Wedding promotion 2024',
    description: 'Heineken beer - Enjoy the best quality beer from Heineken.',
    url: 'https://www.heinekenlaos.la/',
    images: [
      {
        url: 'https://www.heinekenlaos.la/assets/images/banner.png',
        width: 1200,
        height: 630,
        alt: 'Heineken beer pack',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HEINEKEN | Wedding promotion 2024',
    description: 'Heineken beer - Enjoy the best quality beer from Heineken.',
    images: 'https://www.heinekenlaos.la/assets/images/banner.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${notoSansLao.className} antialiased`}>
        <ReactQueryProvider>
          <Providers>
            <main className="">{children}</main>
          </Providers>
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
