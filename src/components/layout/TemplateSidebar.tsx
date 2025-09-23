import React from 'react';
import {
  Box,
  Drawer,
  Toolbar,
  Button,
  Divider
} from '@mui/material';
import { Add } from '@mui/icons-material';

import type { Template, TemplateType } from '@/types';
import { TemplateFilters } from '@/components/template/TemplateFilters';
import { TemplateList } from '@/components/template/TemplateList';

const DRAWER_WIDTH = 350;

interface TemplateSidebarProps {
  templates: Template[];
  loading: boolean;
  typeFilter: TemplateType | 'ALL';
  appEntryFilter: string;
  onCreateTemplate: () => void;
  onTypeFilterChange: (type: TemplateType | 'ALL') => void;
  onAppEntryFilterChange: (appEntry: string) => void;
  onEditTemplate: (template: Template) => void;
  onDeleteTemplate: (template: Template) => void;
  onPreviewTemplate: (template: Template) => void;
}

export const TemplateSidebar: React.FC<TemplateSidebarProps> = ({
  templates,
  loading,
  typeFilter,
  appEntryFilter,
  onCreateTemplate,
  onTypeFilterChange,
  onAppEntryFilterChange,
  onEditTemplate,
  onDeleteTemplate,
  onPreviewTemplate
}) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', p: 2 }}>
        {/* 新建模板按钮 */}
        <Button
          variant="contained"
          fullWidth
          startIcon={<Add />}
          onClick={onCreateTemplate}
          sx={{ mb: 2 }}
        >
          新建模板
        </Button>

        {/* 筛选器 */}
        <TemplateFilters
          typeFilter={typeFilter}
          appEntryFilter={appEntryFilter}
          onTypeFilterChange={onTypeFilterChange}
          onAppEntryFilterChange={onAppEntryFilterChange}
        />

        <Divider sx={{ my: 2 }} />

        {/* 模板列表 */}
        <TemplateList
          templates={templates}
          loading={loading}
          onEdit={onEditTemplate}
          onDelete={onDeleteTemplate}
          onPreview={onPreviewTemplate}
        />
      </Box>
    </Drawer>
  );
};