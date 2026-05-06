import type { Metadata } from "next";
import "./globals.css";
import { supabase } from "@/lib/supabaseClient";

export async function generateMetadata(): Promise<Metadata> {
  const defaultMetadata: Metadata = {
    title: "Dohmen & Matta Advogados Associados | Direito da Saúde e Erro Médico",
    description: "Escritório especializado em direito da saúde, com atuação estratégica voltada à resolução de conflitos complexos e suporte a profissionais.",
    keywords: "advogado saúde, erro médico, direito da saúde, lucas dohmen, alexandre matta, DMA advogados",
  };

  try {
    if (supabase) {
      const { data } = await supabase
        .from("site_dm_advogados_configuracoes")
        .select("seo_title, seo_description, seo_keywords, google_verify_id, favicon_url")
        .limit(1)
        .maybeSingle();

      if (data) {
        const title = data.seo_title || defaultMetadata.title;
        const description = data.seo_description || defaultMetadata.description;

        return {
          title,
          description,
          keywords: data.seo_keywords || defaultMetadata.keywords,
          icons: {
            icon: data.favicon_url || "/favicon.ico",
          },
          openGraph: {
            title,
            description,
            type: "website",
            locale: "pt_BR",
            url: "https://dmatta.com.br", // Could also be dynamic
          },
          verification: {
            google: data.google_verify_id || undefined,
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
  // Fetch active scripts from database
  let headScripts: any[] = [];
  let bodyScripts: any[] = [];

  try {
    if (supabase) {
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
