import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Nutrition Assistant',
  description: 'Get personalized nutrition recommendations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {children}
        </div>
      </body>
    </html>
  );
}
