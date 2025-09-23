import type React from 'react';
import { useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Language } from '@mui/icons-material';

interface LanguageSwitcherProps {
  variant?: 'select' | 'menu';
  size?: 'small' | 'medium';
}

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
] as const;

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'select',
  size = 'small',
}) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setCurrentLanguage(languageCode);
    // 保存到本地存储
    localStorage.setItem('language', languageCode);
  };

  const getCurrentLanguage = () => {
    return LANGUAGES.find(lang => lang.code === currentLanguage) || LANGUAGES[0];
  };

  if (variant === 'select') {
    return (
      <FormControl size={size} sx={{ minWidth: 120 }}>
        <InputLabel id="language-select-label">
          <Box display="flex" alignItems="center" gap={1}>
            <Language fontSize="small" />
            Language
          </Box>
        </InputLabel>
        <Select
          labelId="language-select-label"
          value={currentLanguage}
          onChange={(e) => handleLanguageChange(e.target.value)}
          label="Language"
        >
          {LANGUAGES.map((lang) => (
            <MenuItem key={lang.code} value={lang.code}>
              <Box display="flex" alignItems="center" gap={1}>
                <span>{lang.flag}</span>
                <Typography variant="body2">{lang.name}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Language fontSize="small" />
      <Typography variant="body2" sx={{ mr: 1 }}>
        {getCurrentLanguage().flag} {getCurrentLanguage().name}
      </Typography>
    </Box>
  );
};

export default LanguageSwitcher;