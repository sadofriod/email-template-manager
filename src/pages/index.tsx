import React, { useEffect } from 'react';
import Head from 'next/head';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuth } from '@/hooks/useAuth';
import { EmailTemplateLayout } from '@/components/layout/EmailTemplateLayout';
import LoginForm from '@/components/auth/LoginForm';
import { authService } from '@/services/auth';

const theme = createTheme();

export default function Home() {
  // 在应用启动时初始化认证服务
  useEffect(() => {
    authService.initialize();
  }, []);

  const AppContent: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user) {
      return <LoginForm />;
    }

    return <EmailTemplateLayout />;
  };

  return (
    <>
      <Head>
        <title>Email Template Manager</title>
        <meta name="description" content="Manage email templates for your applications" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </>
  );
}