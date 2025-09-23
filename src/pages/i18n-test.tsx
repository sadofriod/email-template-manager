import type React from 'react';
import Head from 'next/head';
import { Box, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { I18nDemo } from '@/components/demo/I18nDemo';

const I18nTestPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t('app.title')} - I18n Test</title>
        <meta name="description" content={t('app.description')} />
      </Head>
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          {t('app.title')}
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary">
          International Multilingual Support Demo
        </Typography>
        
        <I18nDemo />
        
        <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Quick Feature Test:
          </Typography>
          <Typography variant="body1" paragraph>
            • Use the language switcher to toggle between English, Japanese, and Chinese
          </Typography>
          <Typography variant="body1" paragraph>
            • All UI text should update immediately when language is changed
          </Typography>
          <Typography variant="body1" paragraph>
            • Language preference is saved in localStorage
          </Typography>
          <Typography variant="body1" paragraph>
            • Try refreshing the page - it should remember your language choice
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default I18nTestPage;