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
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  if (!template) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Warning color="warning" />
        Confirm Delete
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Are you sure you want to delete this email template?
        </Typography>

        <Alert severity="warning" sx={{ my: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            <strong>Template Details:</strong>
          </Typography>
          <Box sx={{ ml: 2 }}>
            <Typography variant="body2">
              <strong>ID:</strong> {template.templateId}
            </Typography>
            <Typography variant="body2">
              <strong>Type:</strong> {template.type}
            </Typography>
            <Typography variant="body2">
              <strong>App Entry:</strong> {template.appEntry}
            </Typography>
            <Typography variant="body2">
              <strong>Name:</strong> {template.name}
            </Typography>
            <Typography variant="body2">
              <strong>Version:</strong> {template.version}
            </Typography>
            <Typography variant="body2">
              <strong>From:</strong> {template.from}
            </Typography>
          </Box>
        </Alert>

        <Typography variant="body2" color="error">
          <strong>Warning:</strong> This action cannot be undone. The template
          will be permanently deleted from both the database and S3 storage.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          color="error"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <Delete />}
        >
          {loading ? "Deleting..." : "Delete Template"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
