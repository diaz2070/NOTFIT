import type { Metadata } from 'next';
import { Inter, Lemon } from 'next/font/google';
import '../styles/globals.css';
import ThemeProvider from '@/providers/ThemeProvider';
import { Toaster } from 'sonner';
import Header from '@/components/Header';

// How to: font-[family-name:var(--font-inter)]
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});
// How to: font-[family-name:var(--font-lemon)]
const lemon = Lemon({
  variable: '--font-lemon',
  subsets: ['latin'],
  weight: '400', // Lemon only comes in 400 weight
});

export const metadata: Metadata = {
  title: 'NOTFIT',
  description: 'Get fit with NOTFIT',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${lemon.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* <DarkModeToggle /> */}
          <div className="flex min-h-screen w-full flex-col">
            <Header />
            <main className="flex-1 flex-col px-4 pb-9 xl:px-8 font-[family-name:var(--font-inter)]">
              {children}
            </main>
          </div>
          <Toaster
            expand
            richColors
            position="bottom-right"
            toastOptions={{
              style: {
                fontFamily: 'var(--font-inter)',
                fontSize: '1rem',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
