import type React from "react";
import { Box, Typography, List, ListItem } from "@mui/material";
import { Email } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

import type { Template } from "@/types";
import { TemplateCard } from "@/components/ui/TemplateCard";

interface TemplateListProps {
  templates: Template[];
  loading: boolean;
  onEdit: (template: Template) => void;
  onDelete: (template: Template) => void;
  onPreview: (template: Template) => void;
}

export const TemplateList: React.FC<TemplateListProps> = ({
  templates,
  loading,
  onEdit,
  onDelete,
  onPreview,
}) => {
  const { t } = useTranslation();
  
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        <Email sx={{ verticalAlign: "middle", mr: 1 }} />
        {t('template.templateList')} ({templates.length})
      </Typography>

      {loading ? (
        <Typography color="text.secondary">{t('auth.loading')}</Typography>
      ) : templates.length === 0 ? (
        <Typography color="text.secondary">{t('template.noTemplates')}</Typography>
      ) : (
        <List>
          {templates.map((template) => (
            <ListItem key={template.id} sx={{ px: 0 }}>
              <TemplateCard
                template={template}
                onEdit={onEdit}
                onDelete={onDelete}
                onPreview={onPreview}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};
