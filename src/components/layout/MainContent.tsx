import type React from "react";
import { Box, Toolbar, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import type { TemplateData } from "@/types";
import { TemplateEditor } from "@/components/template/TemplateEditor";
import { LivePreviewPanel } from "@/components/layout/preview";

interface MainContentProps {
  isEditing: boolean;
  selectedTemplate?: TemplateData;
  onSaveTemplate: (templateData: TemplateData) => Promise<void>;
  onCancelEdit: () => void;
  onPreviewTemplate: (templateData: TemplateData) => void;
  currentEditingData?: Partial<TemplateData>;
  onContentChange?: (data: Partial<TemplateData>) => void;
}

export const MainContent: React.FC<MainContentProps> = ({
  isEditing,
  selectedTemplate,
  onSaveTemplate,
  onCancelEdit,
  onPreviewTemplate,
  currentEditingData,
  onContentChange,
}) => {
  const { t } = useTranslation();
  return (
    <Box component="main" sx={{ flexGrow: 1, display: "flex", height: "100vh" }}>
      {/* 左侧编辑区域 */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <Toolbar />

        {isEditing ? (
          <TemplateEditor
            templateData={selectedTemplate}
            onSave={onSaveTemplate}
            onCancel={onCancelEdit}
            onPreview={onPreviewTemplate}
            onContentChange={onContentChange}
          />
        ) : (
          <Box p={3}>
            <Typography variant="body1">
              {t('app.selectTemplateMessage')}
            </Typography>
          </Box>
        )}
      </Box>

      {/* 右侧实时预览面板 */}
      {isEditing && (
        <Box
          sx={{
            width: "40%",
            minWidth: "400px",
            maxWidth: "600px",
            borderLeft: "1px solid #e0e0e0",
            bgcolor: "#f5f5f5",
          }}
        >
          <Toolbar />
          <LivePreviewPanel
            templateData={currentEditingData || selectedTemplate}
            htmlContent={currentEditingData?.htmlContent}
            variables={currentEditingData?.variables || selectedTemplate?.variables}
          />
        </Box>
      )}
    </Box>
  );
};
