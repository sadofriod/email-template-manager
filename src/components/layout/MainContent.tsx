import type React from "react";
import { Box, Toolbar, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import type { TemplateData } from "@/types";
import { TemplateEditor } from "@/components/template/TemplateEditor";

interface MainContentProps {
  isEditing: boolean;
  selectedTemplate?: TemplateData;
  onSaveTemplate: (templateData: TemplateData) => Promise<void>;
  onCancelEdit: () => void;
  onPreviewTemplate: (templateData: TemplateData) => void;
}

export const MainContent: React.FC<MainContentProps> = ({
  isEditing,
  selectedTemplate,
  onSaveTemplate,
  onCancelEdit,
  onPreviewTemplate,
}) => {
  const { t } = useTranslation();
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />

      {isEditing ? (
        <TemplateEditor
          templateData={selectedTemplate}
          onSave={onSaveTemplate}
          onCancel={onCancelEdit}
          onPreview={onPreviewTemplate}
        />
      ) : (
        <Box>
          <Typography variant="body1">
            {t('app.selectTemplateMessage')}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
