import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PortfolioContent } from '../../shared/types';
import { defaultContent } from '../data/content';

interface ContentContextType {
  content: PortfolioContent;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType>({
  content: defaultContent,
  isLoading: false,
  error: null,
  refetch: async () => {},
});

export const useContent = () => useContext(ContentContext);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<PortfolioContent>(defaultContent);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/content');
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const data = await res.json();
      setContent(data);
      setError(null);
    } catch (err) {
      console.warn('[ContentProvider] Could not load /api/content, using offline fallback:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch content');
      setContent(defaultContent);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Dynamic SEO application
  useEffect(() => {
    if (content?.site) {
      // Document title
      if (content.site.title) {
        document.title = content.site.title;
      }

      // Meta Description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && content.site.description) {
        metaDesc.setAttribute('content', content.site.description);
      }

      // Meta Keywords
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords && content.site.keywords) {
        metaKeywords.setAttribute('content', content.site.keywords);
      }

      // OG Title
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle && content.site.title) {
        ogTitle.setAttribute('content', content.site.title);
      }

      // OG Description
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc && content.site.description) {
        ogDesc.setAttribute('content', content.site.description);
      }

      // OG Image
      const ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg && content.site.ogImage) {
        ogImg.setAttribute('content', content.site.ogImage);
      }

      // Favicon
      if (content.site.favicon) {
        const faviconLink = document.querySelector('link[rel="icon"]');
        if (faviconLink) {
          faviconLink.setAttribute('href', content.site.favicon);
        }
      }
    }
  }, [content]);

  return (
    <ContentContext.Provider value={{ content, isLoading, error, refetch: fetchContent }}>
      {children}
    </ContentContext.Provider>
  );
};
