import { AppProvider } from '@/contexts/AppContext'
import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "CoEditor3",
  description: "一个简单的在线笔记应用",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="zh">
      <body className="min-h-screen bg-stone-900">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
};

export default RootLayout;
