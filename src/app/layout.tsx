import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store/use-app-store';
import { RoleSwitcher } from '@/components/layout/RoleSwitcher';

export const metadata: Metadata = {
  title: 'Plateforme SaaS de Gestion Scolaire Multi-écoles',
  description: 'Logiciel tout-en-un pour la gestion des écoles privées et publiques au Sénégal et en Afrique francophone.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col">
        <AppProvider>
          <RoleSwitcher />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
