import type React from "react";
import { useState } from "react";
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
} from "@mui/material";
import { Save, Preview, Close } from "@mui/icons-material";

import type { TemplateData } from "@/types";
import {
  TEMPLATE_TYPES,
  TEMPLATE_TYPE_LABELS,
  APP_ENTRIES,
  APP_ENTRY_LABELS,
} from "@/constants";
import { useTemplateEditor } from "@/hooks/form";
import { VariableEditor } from "@/components/ui/VariableEditor";

interface TemplateEditorProps {
  templateData?: TemplateData;
  onSave: (template: TemplateData) => Promise<void>;
  onCancel: () => void;
  onPreview: (template: TemplateData) => void;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  templateData,
  onSave,
  onCancel,
  onPreview,
}) => {
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const { formState, variableState, validateForm, buildTemplateData } =
    useTemplateEditor(templateData);

  const { values, errors, setValue } = formState;

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
      setAlert({ type: "error", message: "请检查表单错误" });
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
      setAlert({ type: "success", message: "模板保存成功" });
    } catch (error) {
      setAlert({
        type: "error",
        message: error instanceof Error ? error.message : "保存失败",
      });
    } finally {
      setSaving(false);
    }
  };

  // 预览模板
  const handlePreview = () => {
    const { isValid } = validateForm();
    if (!isValid) {
      setAlert({ type: "error", message: "请先完善模板信息" });
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
          {templateData ? "编辑模板" : "新建模板"}
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            onClick={handlePreview}
            startIcon={<Preview />}
          >
            预览
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            startIcon={<Save />}
            disabled={saving}
          >
            {saving ? "保存中..." : "保存"}
          </Button>
          <Button variant="outlined" onClick={onCancel} startIcon={<Close />}>
            取消
          </Button>
        </Box>
      </Box>

      <Stack spacing={3}>
        {/* 基本信息 */}
        <Card>
          <CardContent>
            <Typography variant="h6" mb={2}>
              基本信息
            </Typography>

            <Stack spacing={2}>
              <Box display="flex" gap={2}>
                <TextField
                  label="模板ID"
                  value={values.templateId}
                  onChange={(e) => setValue("templateId", e.target.value)}
                  error={!!errors.templateId}
                  helperText={errors.templateId}
                  disabled={!!templateData}
                  fullWidth
                />
                <TextField
                  label="模板名称"
                  value={values.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  fullWidth
                />
              </Box>

              <Box display="flex" gap={2}>
                <FormControl fullWidth>
                  <InputLabel>模板类型</InputLabel>
                  <Select
                    value={values.type}
                    label="模板类型"
                    onChange={(e) => setValue("type", e.target.value)}
                  >
                    {TEMPLATE_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {TEMPLATE_TYPE_LABELS[type]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>应用入口</InputLabel>
                  <Select
                    value={values.appEntry}
                    label="应用入口"
                    onChange={(e) => setValue("appEntry", e.target.value)}
                  >
                    {APP_ENTRIES.map((entry) => (
                      <MenuItem key={entry} value={entry}>
                        {APP_ENTRY_LABELS[entry]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box display="flex" gap={2}>
                <TextField
                  label="发件人邮箱"
                  value={values.from}
                  onChange={(e) => setValue("from", e.target.value)}
                  error={!!errors.from}
                  helperText={errors.from}
                  fullWidth
                />
                <TextField
                  label="邮件主题"
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
              元数据
            </Typography>

            <Stack spacing={2}>
              <TextField
                label="描述"
                value={values.description}
                onChange={(e) => setValue("description", e.target.value)}
                multiline
                rows={3}
                fullWidth
              />
              <Box display="flex" gap={2}>
                <TextField
                  label="版本"
                  value={values.version}
                  onChange={(e) => setValue("version", e.target.value)}
                  fullWidth
                />
                <TextField
                  label="作者"
                  value={values.author}
                  onChange={(e) => setValue("author", e.target.value)}
                  fullWidth
                />
              </Box>
              <TextField
                label="标签"
                value={values.tags}
                onChange={(e) => setValue("tags", e.target.value)}
                helperText="多个标签用逗号分隔"
                fullWidth
              />
            </Stack>
          </CardContent>
        </Card>

        {/* HTML内容 */}
        <Card>
          <CardContent>
            <Typography variant="h6" mb={2}>
              HTML 内容
            </Typography>
            <TextField
              value={values.htmlContent}
              onChange={(e) => setValue("htmlContent", e.target.value)}
              multiline
              rows={10}
              fullWidth
              placeholder="输入HTML邮件内容，支持 {{变量名}} 语法"
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
              文本内容
            </Typography>
            <TextField
              value={values.textContent}
              onChange={(e) => setValue("textContent", e.target.value)}
              multiline
              rows={6}
              fullWidth
              placeholder="纯文本版本的邮件内容"
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
    </Box>
  );
};
