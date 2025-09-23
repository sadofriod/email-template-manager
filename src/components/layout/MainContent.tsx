import type React from "react";
import { Box, Toolbar, Typography } from "@mui/material";

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
            请从左侧选择一个模板进行编辑，或创建一个新模板。
          </Typography>
        </Box>
      )}
    </Box>
  );
};
