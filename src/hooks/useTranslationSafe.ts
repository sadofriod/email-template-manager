import { useEffect, useState } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';

/**
 * A safe wrapper around useTranslation that prevents hydration mismatches
 * by ensuring translations are only rendered after client-side mount.
 * 
 * This hook is useful when you need to render translated content in a component
 * that is server-side rendered.
 */
export function useTranslationSafe() {
  const [isMounted, setIsMounted] = useState(false);
  const translation = useI18nTranslation();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return {
    ...translation,
    isMounted,
  };
}
