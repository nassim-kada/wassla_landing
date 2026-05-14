import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Wassla - منصة بطاقات الأعمال الجزائرية',
  description: 'اكبر منصة جزائرية لجمع بطاقات الأعمال. حلاق، طبيب، ميكانيكي.. كلش كاين!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
