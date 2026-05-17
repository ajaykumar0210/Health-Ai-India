import useAppStore from '../store/useAppStore';
import translations from './translations';

export default function useTranslation() {
  const language = useAppStore((s) => s.language);
  const dict = translations[language] || translations.en;
  const t = (key) => dict[key] || translations.en[key] || key;
  return { t, language, isHindi: language === 'hi' };
}
