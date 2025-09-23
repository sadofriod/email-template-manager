import type React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import type { Template } from "@/types";
import { format } from "@/utils";

interface TemplateCardProps {
  template: Template;
  onEdit: (template: Template) => void;
  onDelete: (template: Template) => void;
  onPreview: (template: Template) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onEdit,
  onDelete,
  onPreview,
}) => {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Typography variant="h6" component="h3">
            {template.name}
          </Typography>
          <Box>
            <IconButton size="small" onClick={() => onPreview(template)}>
              <Visibility />
            </IconButton>
            <IconButton size="small" onClick={() => onEdit(template)}>
              <Edit />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(template)}>
              <Delete />
            </IconButton>
          </Box>
        </Box>

        <Box display="flex" gap={1} mb={2}>
          <Chip
            label={format.templateType(template.type)}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Chip
            label={format.appEntry(template.appEntry)}
            size="small"
            color="secondary"
            variant="outlined"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" mb={1}>
          {t('template.id')}: {template.templateId}
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={1}>
          {t('template.version')}: {template.version}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {t('template.from')}: {template.from}
        </Typography>
      </CardContent>
    </Card>
  );
};
