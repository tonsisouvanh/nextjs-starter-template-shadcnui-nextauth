import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Noto_Sans_Lao } from 'next/font/google';
import ReactQueryProvider from '@/lib/provider/ReactQueryProvider';
import { Toaster } from '@/components/ui/toaster';

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
  title: 'TransMemo - Translate and Memorize',
  description: 'Translate and memorize your favorite texts',
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
          {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange> */}
            {/* <Header /> */}
            <main className="flex min-h-screen flex-col justify-between px-3">{children}</main>
            {/* <Footer /> */}
          {/* </ThemeProvider> */}
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
