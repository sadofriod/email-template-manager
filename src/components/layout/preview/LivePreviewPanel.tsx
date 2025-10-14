'use client';
import type React from "react";
import { useEffect, useRef, createElement, useState } from "react";
import { Box, Paper, Typography, Divider, Chip } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import type { TemplateData, Variable } from "@/types";

interface LivePreviewPanelProps {
  templateData?: Partial<TemplateData>;
  htmlContent?: string;
  variables?: Variable[];
}

/**
 * 实时预览面板组件
 * 使用 Web Component 渲染 HTML 内容，实现 CSS 隔离
 */
export const LivePreviewPanel: React.FC<LivePreviewPanelProps> = ({
  templateData,
  htmlContent,
  variables = [],
}) => {
  const { t } = useTranslation();
  const previewRef = useRef<any>(null);
  const [isComponentLoaded, setIsComponentLoaded] = useState(false);

  // 动态导入 Web Component（仅在客户端）
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import("@/components/layout/preview/EmailPreviewComponent")
        .then(() => {
          setIsComponentLoaded(true);
        })
        .catch((err) => {
          console.error("Failed to load EmailPreviewComponent:", err);
        });
    }
  }, []);

  // 渲染 HTML 内容，替换变量
  const renderHtmlWithVariables = (html: string): string => {
    if (!html) return "";

    let rendered = html;

    // 使用变量的默认值替换
    variables.forEach((variable) => {
      const pattern = new RegExp(`{{\\s*${variable.name}\\s*}}`, "g");
      const value = variable.defaultValue || `[${variable.name}]`;
      rendered = rendered.replace(pattern, String(value));
    });

    // 替换未定义的变量为占位符
    rendered = rendered.replace(/{{(\w+)}}/g, (_match, varName) => {
      return `<span style="background: #ffeb3b; padding: 2px 4px; border-radius: 3px; font-family: monospace;">[${varName}]</span>`;
    });

    return rendered;
  };

  // 更新预览内容
  useEffect(() => {
    if (isComponentLoaded && previewRef.current && htmlContent) {
      const renderedHtml = renderHtmlWithVariables(htmlContent);
      previewRef.current.setContent(renderedHtml);
    } else if (isComponentLoaded && previewRef.current) {
      previewRef.current.clear();
    }
  }, [htmlContent, variables, isComponentLoaded]);

  // 从 templateData 中获取 htmlContent
  const _content = htmlContent || templateData?.htmlContent || "";
  const subject = templateData?.subject || "";

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f5f5f5",
      }}
    >
      {/* 头部 */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 0,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Box display="flex" alignItems="center" gap={1} mb={subject ? 1 : 0}>
          <Visibility color="primary" />
          <Typography variant="h6">{t("preview.livePreview")}</Typography>
          <Chip
            label={t("preview.realtime")}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>

        {/* 主题预览 */}
        {subject && (
          <>
            <Divider sx={{ my: 1 }} />
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                {t("template.subject")}:
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {subject}
              </Typography>
            </Box>
          </>
        )}
      </Paper>

      {/* 预览区域 */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          bgcolor: "#ffffff",
          position: "relative",
        }}
      >
        {/* 使用 Web Component - 只在客户端且组件加载后显示 */}
        {isComponentLoaded && createElement("email-preview", { ref: previewRef })}
        {!isComponentLoaded && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#999",
            }}
          >
            <Typography variant="body2">{t("preview.loading")}</Typography>
          </Box>
        )}
      </Box>

      {/* 变量提示 */}
      {variables.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            borderRadius: 0,
            borderTop: "1px solid #e0e0e0",
            bgcolor: "#fafafa",
          }}
        >
          <Typography variant="caption" color="text.secondary" display="block">
            {t("preview.variablesUsed")}:
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
            {variables.map((variable) => (
              <Chip
                key={variable.name}
                label={`{{${variable.name}}}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem", height: "20px" }}
              />
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
};
