import type React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Save, Preview, Close, Restore } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

import type { TemplateData } from "@/types";
import { useTemplateEditor } from "@/hooks/form";
import { useTemplateTypeOptions, useAppEntryOptions } from "@/hooks/useI18nOptions";
import { VariableEditor } from "@/components/ui/VariableEditor";

interface TemplateEditorProps {
  templateData?: TemplateData;
  onSave: (template: TemplateData) => Promise<void>;
  onCancel: () => void;
  onPreview: (template: TemplateData) => void;
  onContentChange?: (data: Partial<TemplateData>) => void;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  templateData,
  onSave,
  onCancel,
  onPreview,
  onContentChange,
}) => {
  const { t } = useTranslation();
  const templateTypeOptions = useTemplateTypeOptions();
  const appEntryOptions = useAppEntryOptions();
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [draftData, setDraftData] = useState<Partial<TemplateData> | null>(null);

  const { formState, variableState, validateForm, buildTemplateData, draftManager } =
    useTemplateEditor(templateData);

  const { values, errors, setValue } = formState;

  // 通知父组件内容变化（用于实时预览）
  useEffect(() => {
    if (onContentChange) {
      const currentData: Partial<TemplateData> = {
        templateId: values.templateId,
        name: values.name,
        type: values.type,
        appEntry: values.appEntry,
        from: values.from,
        subject: values.subject,
        htmlContent: values.htmlContent,
        textContent: values.textContent,
        variables: variableState.variables,
        metadata: {
          id: values.templateId,
          name: values.name,
          description: values.description,
          version: values.version,
          author: values.author,
          tags: values.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0),
        },
      };
      onContentChange(currentData);
    }
  }, [values, variableState.variables, onContentChange]);

  // 检查是否有草稿
  useEffect(() => {
    if (draftManager.hasDraft()) {
      const draft = draftManager.loadDraft();
      const metadata = draftManager.getDraftMetadata();
      
      // 只在没有初始模板数据时提示恢复草稿，或者草稿是针对当前模板的
      if (draft && (!templateData || metadata?.templateId === templateData.templateId)) {
        setDraftData(draft);
        setShowDraftDialog(true);
      }
    }
  }, [draftManager, templateData]);

  // 恢复草稿
  const handleRestoreDraft = () => {
    if (draftData) {
      // 恢复表单数据
      if (draftData.templateId) setValue("templateId", draftData.templateId);
      if (draftData.name) setValue("name", draftData.name);
      if (draftData.type) setValue("type", draftData.type);
      if (draftData.appEntry) setValue("appEntry", draftData.appEntry);
      if (draftData.from) setValue("from", draftData.from);
      if (draftData.subject) setValue("subject", draftData.subject);
      if (draftData.htmlContent) setValue("htmlContent", draftData.htmlContent);
      if (draftData.textContent) setValue("textContent", draftData.textContent);
      if (draftData.metadata) {
        setValue("description", draftData.metadata.description || "");
        setValue("version", draftData.metadata.version || "1.0.0");
        setValue("author", draftData.metadata.author || "");
        setValue("tags", draftData.metadata.tags?.join(", ") || "");
      }
      
      // 恢复变量
      if (draftData.variables && variableState.setVariables) {
        variableState.setVariables(draftData.variables);
      }
      
      setAlert({ type: "success", message: t('template.draftRestored') });
    }
    setShowDraftDialog(false);
  };

  // 忽略草稿
  const handleIgnoreDraft = () => {
    draftManager.clearDraft();
    setShowDraftDialog(false);
  };

  // 生成模板ID
  const handleNameChange = (name: string) => {
    setValue("name", name);
    if (!templateData) {
      const generatedId = name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-_]/g, "")
        .substring(0, 50);
      setValue("templateId", generatedId);
    }
  };

  // 保存模板
  const handleSave = async () => {
    const { isValid, variableErrors } = validateForm();

    if (!isValid) {
      setAlert({ type: "error", message: t('template.checkFormErrors') });
      return;
    }

    if (variableErrors.length > 0) {
      setAlert({ type: "error", message: variableErrors.join("; ") });
      return;
    }

    setSaving(true);
    try {
      const template = buildTemplateData();
      await onSave(template);
      // 保存成功后清除草稿
      draftManager.clearDraft();
      setAlert({ type: "success", message: t('messages.saveSuccess') });
    } catch (error) {
      setAlert({
        type: "error",
        message: error instanceof Error ? error.message : t('messages.saveError'),
      });
    } finally {
      setSaving(false);
    }
  };

  // 取消编辑
  const handleCancel = () => {
    // 取消时清除草稿
    draftManager.clearDraft();
    onCancel();
  };

  // 预览模板
  const handlePreview = () => {
    const { isValid } = validateForm();
    if (!isValid) {
      setAlert({ type: "error", message: t('template.completeTemplateInfo') });
      return;
    }

    const template = buildTemplateData();
    onPreview(template);
  };

  return (
    <Box p={3}>
      {/* 头部 */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">
          {templateData ? t('template.editTemplate') : t('template.createNew')}
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            onClick={handlePreview}
            startIcon={<Preview />}
          >
            {t('template.preview')}
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            startIcon={<Save />}
            disabled={saving}
          >
            {saving ? t('template.saving') : t('template.save')}
          </Button>
          <Button variant="outlined" onClick={handleCancel} startIcon={<Close />}>
            {t('template.cancel')}
          </Button>
        </Box>
      </Box>

      <Stack spacing={3}>
        {/* 基本信息 */}
        <Card>
          <CardContent>
            <Typography variant="h6" mb={2}>
              {t('template.basicInfo')}
            </Typography>

            <Stack spacing={2}>
              <Box display="flex" gap={2}>
                <TextField
                  label={t('template.templateId')}
                  value={values.templateId}
                  onChange={(e) => setValue("templateId", e.target.value)}
                  error={!!errors.templateId}
                  helperText={errors.templateId}
                  disabled={!!templateData}
                  fullWidth
                />
                <TextField
                  label={t('template.templateName')}
                  value={values.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  fullWidth
                />
              </Box>

              <Box display="flex" gap={2}>
                <FormControl fullWidth>
                  <InputLabel>{t('template.templateType')}</InputLabel>
                  <Select
                    value={values.type}
                    label={t('template.templateType')}
                    onChange={(e) => setValue("type", e.target.value)}
                  >
                    {templateTypeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>{t('template.appEntry')}</InputLabel>
                  <Select
                    value={values.appEntry}
                    label={t('template.appEntry')}
                    onChange={(e) => setValue("appEntry", e.target.value)}
                  >
                    {appEntryOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box display="flex" gap={2}>
                <TextField
                  label={t('template.senderEmail')}
                  value={values.from}
                  onChange={(e) => setValue("from", e.target.value)}
                  error={!!errors.from}
                  helperText={errors.from}
                  fullWidth
                />
                <TextField
                  label={t('template.subject')}
                  value={values.subject}
                  onChange={(e) => setValue("subject", e.target.value)}
                  fullWidth
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* 元数据 */}
        <Card>
          <CardContent>
            <Typography variant="h6" mb={2}>
              {t('template.metadata')}
            </Typography>

            <Stack spacing={2}>
              <TextField
                label={t('template.description')}
                value={values.description}
                onChange={(e) => setValue("description", e.target.value)}
                multiline
                rows={3}
                fullWidth
              />
              <Box display="flex" gap={2}>
                <TextField
                  label={t('template.version')}
                  value={values.version}
                  onChange={(e) => setValue("version", e.target.value)}
                  fullWidth
                />
                <TextField
                  label={t('template.author')}
                  value={values.author}
                  onChange={(e) => setValue("author", e.target.value)}
                  fullWidth
                />
              </Box>
              <TextField
                label={t('template.tags')}
                value={values.tags}
                onChange={(e) => setValue("tags", e.target.value)}
                helperText={t('template.tagsHelper')}
                fullWidth
              />
            </Stack>
          </CardContent>
        </Card>

        {/* HTML内容 */}
        <Card>
          <CardContent>
            <Typography variant="h6" mb={2}>
              {t('template.htmlContent')}
            </Typography>
            <TextField
              value={values.htmlContent}
              onChange={(e) => setValue("htmlContent", e.target.value)}
              multiline
              rows={10}
              fullWidth
              placeholder={t('template.htmlPlaceholder')}
              sx={{
                "& .MuiInputBase-input": {
                  fontFamily: "monospace",
                },
              }}
            />
          </CardContent>
        </Card>

        {/* 文本内容 */}
        <Card>
          <CardContent>
            <Typography variant="h6" mb={2}>
              {t('template.textContent')}
            </Typography>
            <TextField
              value={values.textContent}
              onChange={(e) => setValue("textContent", e.target.value)}
              multiline
              rows={6}
              fullWidth
              placeholder={t('template.textPlaceholder')}
            />
          </CardContent>
        </Card>

        {/* 变量管理 */}
        <Card>
          <CardContent>
            <VariableEditor
              variables={variableState.variables}
              onAddVariable={variableState.addVariable}
              onRemoveVariable={variableState.removeVariable}
              onUpdateVariable={variableState.updateVariable}
            />
          </CardContent>
        </Card>
      </Stack>

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

      {/* 草稿恢复对话框 */}
      <Dialog open={showDraftDialog} onClose={handleIgnoreDraft}>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Restore />
            {t('template.draftFound')}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            {t('template.draftFoundMessage')}
          </Typography>
          {draftData && (
            <Box mt={2}>
              <Typography variant="body2" color="text.secondary">
                {t('template.draftInfo')}:
              </Typography>
              <Typography variant="body2">
                {t('template.templateName')}: {draftData.name || t('template.untitled')}
              </Typography>
              <Typography variant="body2">
                {t('template.templateId')}: {draftData.templateId || t('template.notSet')}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleIgnoreDraft} color="inherit">
            {t('template.ignoreDraft')}
          </Button>
          <Button onClick={handleRestoreDraft} variant="contained" autoFocus>
            {t('template.restoreDraft')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
