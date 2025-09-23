"use client";
import type React from "react";
import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";

const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();
  const { push } = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await login(email, password);
    // The main app will automatically redirect when user state changes
    // No need for manual navigation here
    push("/email-templates");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)",
            p: 2,
          }}
        >
          <CardContent>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  backgroundColor: "primary.main",
                  margin: "0 auto 16px",
                }}
              >
                <Email sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" gutterBottom>
                {t('app.title')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('auth.loginTitle')}
              </Typography>
            </Box>

            {/* Language Switcher */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <LanguageSwitcher />
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                type="email"
                label={t('auth.email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <Email sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
              />
              <TextField
                fullWidth
                type="password"
                label={t('auth.password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <Lock sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? t('auth.loading') : t('auth.loginButton')}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginForm;
