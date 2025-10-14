
import { useEffect } from "react";
import Head from "next/head";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useTranslation } from "react-i18next";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { EmailTemplateLayout } from "@/components/layout/EmailTemplateLayout";
import { authService } from "@/services/auth";

const theme = createTheme();

export default function Home() {
  const { t } = useTranslation();
  
  // 在应用启动时初始化认证服务
  useEffect(() => {
    authService.initialize();
  }, []);

  return (
    <>
      <Head>
        <title>{t('app.title')}</title>
        <meta
          name="description"
          content={t('app.description')}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ProtectedRoute>
          <EmailTemplateLayout />
        </ProtectedRoute>
      </ThemeProvider>
    </>
  );
}
