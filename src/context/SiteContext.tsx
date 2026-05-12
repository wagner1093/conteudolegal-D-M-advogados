"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Site {
  id: string;
  name: string;
  slug: string;
}

interface SiteContextType {
  sites: Site[];
  selectedSiteId: string | null;
  setSelectedSiteId: (id: string) => void;
  loading: boolean;
  refreshSites: () => Promise<void>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSites = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("painel_sites")
        .select("id, name, slug");

      if (error) throw error;

      if (data && data.length > 0) {
        setSites(data);
        
        // Tenta recuperar o site selecionado do localStorage
        const savedSiteId = localStorage.getItem("selectedSiteId");
        if (savedSiteId && data.find(s => s.id === savedSiteId)) {
          setSelectedSiteId(savedSiteId);
        } else {
          setSelectedSiteId(data[0].id);
          localStorage.setItem("selectedSiteId", data[0].id);
        }
      }
    } catch (err) {
      console.error("Erro ao buscar sites:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const handleSetSelectedSiteId = (id: string) => {
    setSelectedSiteId(id);
    localStorage.setItem("selectedSiteId", id);
  };

  return (
    <SiteContext.Provider 
      value={{ 
        sites, 
        selectedSiteId, 
        setSelectedSiteId: handleSetSelectedSiteId, 
        loading,
        refreshSites: fetchSites
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error("useSite must be used within a SiteProvider");
  }
  return context;
}
