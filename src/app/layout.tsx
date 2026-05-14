import type { Metadata } from "next";
import "./globals.css";
import { supabase } from "@/lib/supabaseClient";
import { Providers } from "@/components/Providers";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const siteId = process.env.NEXT_PUBLIC_SITE_ID;
  const defaultMetadata: Metadata = {
    title: "Dohmen & Matta Advogados Associados | Direito da Saúde e Erro Médico",
    description: "Escritório especializado em direito da saúde, com atuação estratégica voltada à resolução de conflitos complexos e suporte a profissionais.",
    keywords: "advogado saúde, erro médico, direito da saúde, lucas dohmen, alexandre matta, DMA advogados",
  };

  try {
    if (supabase && siteId) {
      const { data, error } = await supabase
        .from("painel_sites")
        .select("*, painel_configuracoes(*)")
        .eq("id", siteId)
        .maybeSingle();

      console.log("Metadata Fetch - Site ID:", siteId);
      console.log("Metadata Fetch - Data:", data ? "Found" : "Not Found");
      if (error) console.error("Metadata Fetch - Error:", error);

      if (data) {
        const config = Array.isArray(data.painel_configuracoes) 
          ? data.painel_configuracoes[0] 
          : data.painel_configuracoes;
        
        const configData = config || {};
        const title = configData.seo_title || data.seo_title || defaultMetadata.title;
        const description = configData.seo_description || data.seo_description || defaultMetadata.description;
        const favicon = configData.favicon_url ? `${configData.favicon_url}?v=2` : "/favicon.ico";

        return {
          title,
          description,
          keywords: configData.seo_keywords || defaultMetadata.keywords,
          icons: {
            icon: [
              { url: favicon, rel: 'icon' },
              { url: favicon, rel: 'shortcut icon' },
            ],
            apple: [
              { url: favicon, rel: 'apple-touch-icon' },
            ],
          },
          openGraph: {
            title,
            description,
            type: "website",
            locale: "pt_BR",
            url: "https://dmatta.com.br",
          },
          verification: {
            google: configData.google_verify_id || undefined,
          },
        };
      }
    }
  } catch (error) {
    console.error("Erro ao gerar metadata:", error);
  }

  return defaultMetadata;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteId = process.env.NEXT_PUBLIC_SITE_ID;
  // Fetch active scripts from database
  let headScripts: any[] = [];
  let bodyScripts: any[] = [];

  try {
    if (supabase && siteId) {
      const { data: scriptsData } = await supabase
        .from("painel_integracoes")
        .select("head_script, body_script")
        .eq("site_id", siteId)
        .eq("status", "ativo");

      if (scriptsData) {
        scriptsData.forEach((s) => {
          if (s.head_script) headScripts.push(s.head_script);
          if (s.body_script) bodyScripts.push(s.body_script);
        });
      }
    }
  } catch (error) {
    console.error("Erro ao carregar scripts dinâmicos:", error);
  }

  return (
    <html lang="pt-BR">
      <head>
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
