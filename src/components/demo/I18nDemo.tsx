import type React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

export const I18nDemo: React.FC = () => {
  const { t, i18n } = useTranslation();

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            {t('app.title')} - I18n Demo
          </Typography>
          <LanguageSwitcher />
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              Authentication
            </Typography>
            <Typography variant="body2" gutterBottom>
              {t('auth.login')}: {t('auth.login')}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {t('auth.email')}: {t('auth.email')}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {t('auth.password')}: {t('auth.password')}
            </Typography>
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              Template Actions
            </Typography>
            <Typography variant="body2" gutterBottom>
              {t('template.save')}: {t('template.save')}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {t('template.preview')}: {t('template.preview')}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {t('template.delete')}: {t('template.delete')}
            </Typography>
          </Box>
        </Box>
          
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Template Types
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="body2" component="span">
              {t('templateTypes.WELCOME')}
            </Typography>
            <Typography variant="body2" component="span">
              | {t('templateTypes.VERIFICATION')}
            </Typography>
            <Typography variant="body2" component="span">
              | {t('templateTypes.PASSWORD_RESET')}
            </Typography>
            <Typography variant="body2" component="span">
              | {t('templateTypes.NOTIFICATION')}
            </Typography>
          </Box>
        </Box>
          
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Current Language: {i18n.language}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Available Languages: English (en), 日本語 (ja), 中文 (zh)
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default I18nDemo;