'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface ConfigContextType {
  config: any;
  loading: boolean;
}

const ConfigContext = createContext<ConfigContextType>({ config: null, loading: true });

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConfig() {
      const siteId = process.env.NEXT_PUBLIC_SITE_ID;
      if (!supabase || !siteId) {
        console.warn('ConfigProvider: Supabase client or Site ID not found');
        setLoading(false);
        return;
      }
      
      console.log('ConfigProvider: Fetching config for site:', siteId);
      const { data, error } = await supabase
        .from('painel_sites')
        .select('*, painel_configuracoes(*)')
        .eq('id', siteId)
        .maybeSingle();
      
      if (error) {
        console.error('ConfigProvider: Error fetching config:', error);
        setLoading(false);
        return;
      }

      if (data) {
        const configData = Array.isArray(data.painel_configuracoes) 
          ? data.painel_configuracoes[0] 
          : data.painel_configuracoes;

        const finalConfig = {
          ...data,
          ...(configData || {}),
          site_name: configData?.nome_fantasia || data.name,
          site_description: configData?.descricao_curta || data.description,
          address: configData?.endereco_completo || data.address,
          contact_email: configData?.email_contato || data.contact_email,
          contact_phone: configData?.whatsapp_telefone || data.contact_phone,
          instagram_url: configData?.instagram_url || data.instagram_url,
          linkedin_url: configData?.linkedin_url || data.linkedin_url,
          facebook_url: configData?.facebook_url || data.facebook_url,
          youtube_url: configData?.youtube_url || data.youtube_url,
          favicon_url: configData?.favicon_url || '/favicon.ico'
        };
        
        console.log('ConfigProvider: Final config applied:', finalConfig);
        setConfig(finalConfig);

        // Update favicon dynamically
        if (finalConfig.favicon_url) {
          const link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
          if (link) {
            link.href = `${finalConfig.favicon_url}${finalConfig.favicon_url.includes('?') ? '&' : '?'}v=${Date.now()}`;
          } else {
            const newLink = document.createElement('link');
            newLink.rel = 'icon';
            newLink.href = `${finalConfig.favicon_url}${finalConfig.favicon_url.includes('?') ? '&' : '?'}v=${Date.now()}`;
            document.head.appendChild(newLink);
          }
        }
      }
      setLoading(false);
    }
    loadConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, loading }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
