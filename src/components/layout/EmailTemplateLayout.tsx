import type React from "react";
import { Box, Alert, Snackbar } from "@mui/material";

import type { Template, TemplateData } from "@/types";
import { API_ROUTES } from "@/constants";
import { api } from "@/utils";
import { useAuth } from "@/hooks/useAuth";
import { useTemplateManagement } from "@/hooks/useTemplateManagement";
import { AppHeader } from "@/components/layout/AppHeader";
import { TemplateSidebar } from "@/components/layout/TemplateSidebar";
import { MainContent } from "@/components/layout/MainContent";
import PreviewModal from "@/components/template/PreviewModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export const EmailTemplateLayout: React.FC = () => {
  const { user, logout } = useAuth();

  const {
    // 数据状态
    selectedTemplate,
    loading,

    // 筛选状态
    typeFilter,
    appEntryFilter,
    filteredTemplates,

    // 编辑状态
    isEditing,
    previewTemplate,
    deleteTemplate,

    // 提示状态
    alert,

    // 操作方法
    setTypeFilter,
    setAppEntryFilter,
    handleCreateTemplate,
    handleEditTemplate,
    handleSaveTemplate,
    handleDeleteTemplate,
    handlePreviewTemplate,
    setPreviewTemplate,
    setDeleteTemplate,
    setAlert,
    setIsEditing,
    setSelectedTemplate,
  } = useTemplateManagement();

  // 处理预览模板 - 需要包装以匹配接口
  const handlePreviewTemplateFromList = async (template: Template) => {
    try {
      const response = await api.get<TemplateData>(
        API_ROUTES.TEMPLATES.BY_TYPE_AND_ID(
          template.type,
          template.templateId,
          template.appEntry,
        ),
      );
      if (response.success && response.data) {
        handlePreviewTemplate(response.data);
      }
    } catch (_error) {
      setAlert({ type: "error", message: "加载模板详情失败" });
    }
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedTemplate(null);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* 顶部导航栏 */}
      <AppHeader user={user} onLogout={logout} />

      {/* 侧边栏 */}
      <TemplateSidebar
        templates={filteredTemplates}
        loading={loading}
        typeFilter={typeFilter}
        appEntryFilter={appEntryFilter}
        onCreateTemplate={handleCreateTemplate}
        onTypeFilterChange={setTypeFilter}
        onAppEntryFilterChange={setAppEntryFilter}
        onEditTemplate={handleEditTemplate}
        onDeleteTemplate={setDeleteTemplate}
        onPreviewTemplate={handlePreviewTemplateFromList}
      />

      {/* 主内容区域 */}
      <MainContent
        isEditing={isEditing}
        selectedTemplate={selectedTemplate || undefined}
        onSaveTemplate={handleSaveTemplate}
        onCancelEdit={handleCancelEdit}
        onPreviewTemplate={handlePreviewTemplate}
      />

      {/* 预览模态框 */}
      {previewTemplate && (
        <PreviewModal
          template={previewTemplate}
          open={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
        />
      )}

      {/* 删除确认对话框 */}
      {deleteTemplate && (
        <ConfirmDialog
          open={!!deleteTemplate}
          title="删除模板"
          message={`确定要删除模板 "${deleteTemplate.name}" 吗？此操作无法撤销。`}
          onConfirm={handleDeleteTemplate}
          onCancel={() => setDeleteTemplate(null)}
          variant="error"
        />
      )}

      {/* 提示信息 */}
      <Snackbar
        open={!!alert}
        autoHideDuration={4000}
        onClose={() => setAlert(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlert(null)}
          severity={alert?.type}
          sx={{ width: "100%" }}
        >
          {alert?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
