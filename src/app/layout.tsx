export const metadata = {
  title: "Tikko - Plataforma de Eventos",
  description: "Descubra, crie e viva experiências inesquecíveis. Tikko é sua plataforma moderna para gerenciar e vender ingressos para diversos eventos.",
  icons: [
    { url: "https://storage.googleapis.com/gpt-engineer-file-uploads/VR5yHcRBkNV0kAV6uidodYLUM0p2/uploads/1757940449261-mark.png", rel: "icon" },
  ],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};


import ClientLayout from './client-layout';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <ClientLayout htmlAttrs={{"lang":"en"}} >{children}</ClientLayout>;
}