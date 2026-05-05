import type { Metadata } from "next";
import "./globals.css";
import { supabase } from "@/lib/supabaseClient";

export const metadata: Metadata = {
  title: "Dohmen & Matta Advogados Associados | Direito da Saúde e Erro Médico",
  description: "Escritório especializado em direito da saúde, com atuação estratégica voltada à resolução de conflitos complexos e suporte a profissionais.",
  keywords: "advogado saúde, erro médico, direito da saúde, lucas dohmen, alexandre matta, DMA advogados",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch active scripts and favicon from database
  let headScripts: any[] = [];
  let bodyScripts: any[] = [];
  let faviconUrl = "/favicon.ico";

  try {
    const { data: scriptsData } = await supabase
      .from("site_dm_advogados_integracoes")
      .select("head_script, body_script")
      .eq("status", "ativo");

    if (scriptsData) {
      scriptsData.forEach((s) => {
        if (s.head_script) headScripts.push(s.head_script);
        if (s.body_script) bodyScripts.push(s.body_script);
      });
    }

    const { data: configData } = await supabase
      .from("site_dm_advogados_configuracoes")
      .select("favicon_url")
      .limit(1)
      .maybeSingle();

    if (configData?.favicon_url) {
      faviconUrl = configData.favicon_url;
    }
  } catch (error) {
    console.error("Erro ao carregar dados dinâmicos:", error);
  }

  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href={faviconUrl} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet" />
        
        {headScripts.map((scriptContent, idx) => (
          <script
            key={`head-script-${idx}`}
            dangerouslySetInnerHTML={{ __html: scriptContent }}
          />
        ))}
      </head>
      <body>
        {children}

        {bodyScripts.map((scriptContent, idx) => (
          <div
            key={`body-script-${idx}`}
            dangerouslySetInnerHTML={{ __html: scriptContent }}
          />
        ))}
      </body>
    </html>
  );
}
