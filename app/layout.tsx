import type { Metadata } from "next";
import "./globals.css";

// تعريف الـ Metadata لإصلاح معلومات المتصفح
export const metadata: Metadata = {
  title: "موقع عقار",
  description: "منصة تسويق وإدارة العقارات",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* السطر الأهم لحل مشكلة علامات الاستفهام */}
        <meta charSet="utf-8" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}