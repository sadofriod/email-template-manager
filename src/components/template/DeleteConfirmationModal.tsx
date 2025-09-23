import type React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Box,
  CircularProgress,
} from "@mui/material";
import { Warning, Delete } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

interface Template {
  id: string;
  templateId: string;
  type: string;
  name: string;
  appEntry: string;
  version: string;
  from: string;
}

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  template: Template | null;
  loading?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  template,
  loading = false,
}) => {
  const { t } = useTranslation();
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  if (!template) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Warning color="warning" />
        {t('template.confirmDelete')}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          {t('template.deleteConfirmMessage')}
        </Typography>

        <Alert severity="warning" sx={{ my: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            <strong>{t('template.templateDetails')}:</strong>
          </Typography>
          <Box sx={{ ml: 2 }}>
            <Typography variant="body2">
              <strong>{t('template.id')}:</strong> {template.templateId}
            </Typography>
            <Typography variant="body2">
              <strong>{t('template.type')}:</strong> {template.type}
            </Typography>
            <Typography variant="body2">
              <strong>{t('template.appEntry')}:</strong> {template.appEntry}
            </Typography>
            <Typography variant="body2">
              <strong>{t('template.name')}:</strong> {template.name}
            </Typography>
            <Typography variant="body2">
              <strong>{t('template.version')}:</strong> {template.version}
            </Typography>
            <Typography variant="body2">
              <strong>{t('template.from')}:</strong> {template.from}
            </Typography>
          </Box>
        </Alert>

        <Typography variant="body2" color="error">
          <strong>{t('template.warning')}:</strong> {t('template.deleteWarningMessage')}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('template.cancel')}
        </Button>
        <Button
          onClick={handleConfirm}
          color="error"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <Delete />}
        >
          {loading ? t('template.deleting') : t('template.deleteTemplate')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
