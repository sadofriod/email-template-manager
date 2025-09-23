import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material';
import { FilterList } from '@mui/icons-material';

import type { TemplateType } from '@/types';
import { TEMPLATE_TYPES, TEMPLATE_TYPE_LABELS, APP_ENTRIES, APP_ENTRY_LABELS } from '@/constants';

interface TemplateFiltersProps {
  typeFilter: TemplateType | 'ALL';
  appEntryFilter: string;
  onTypeFilterChange: (type: TemplateType | 'ALL') => void;
  onAppEntryFilterChange: (appEntry: string) => void;
}

export const TemplateFilters: React.FC<TemplateFiltersProps> = ({
  typeFilter,
  appEntryFilter,
  onTypeFilterChange,
  onAppEntryFilterChange
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        <FilterList sx={{ verticalAlign: 'middle', mr: 1 }} />
        筛选器
      </Typography>
      
      <Stack spacing={2}>
        <FormControl fullWidth size="small">
          <InputLabel>模板类型</InputLabel>
          <Select
            value={typeFilter}
            label="模板类型"
            onChange={(e) => onTypeFilterChange(e.target.value as TemplateType | 'ALL')}
          >
            <MenuItem value="ALL">全部类型</MenuItem>
            {TEMPLATE_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {TEMPLATE_TYPE_LABELS[type]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>应用入口</InputLabel>
          <Select
            value={appEntryFilter}
            label="应用入口"
            onChange={(e) => onAppEntryFilterChange(e.target.value)}
          >
            <MenuItem value="ALL">全部入口</MenuItem>
            {APP_ENTRIES.map((entry) => (
              <MenuItem key={entry} value={entry}>
                {APP_ENTRY_LABELS[entry]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );
};