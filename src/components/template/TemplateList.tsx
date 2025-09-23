import type React from "react";
import { Box, Typography, List, ListItem } from "@mui/material";
import { Email } from "@mui/icons-material";

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
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        <Email sx={{ verticalAlign: "middle", mr: 1 }} />
        模板列表 ({templates.length})
      </Typography>

      {loading ? (
        <Typography color="text.secondary">加载中...</Typography>
      ) : templates.length === 0 ? (
        <Typography color="text.secondary">暂无模板</Typography>
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
