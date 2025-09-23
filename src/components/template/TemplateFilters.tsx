import type React from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

import type { TemplateType } from "@/types";
import { useTemplateTypeOptions, useAppEntryOptions } from "@/hooks/useI18nOptions";

interface TemplateFiltersProps {
  typeFilter: TemplateType | "ALL";
  appEntryFilter: string;
  onTypeFilterChange: (type: TemplateType | "ALL") => void;
  onAppEntryFilterChange: (appEntry: string) => void;
}

export const TemplateFilters: React.FC<TemplateFiltersProps> = ({
  typeFilter,
  appEntryFilter,
  onTypeFilterChange,
  onAppEntryFilterChange,
}) => {
  const { t } = useTranslation();
  const templateTypeOptions = useTemplateTypeOptions();
  const appEntryOptions = useAppEntryOptions();

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        <FilterList sx={{ verticalAlign: "middle", mr: 1 }} />
        {t('common.filter')}
      </Typography>

      <Stack spacing={2}>
        <FormControl fullWidth size="small">
          <InputLabel>{t('template.templateType')}</InputLabel>
          <Select
            value={typeFilter}
            label={t('template.templateType')}
            onChange={(e) =>
              onTypeFilterChange(e.target.value as TemplateType | "ALL")
            }
          >
            <MenuItem value="ALL">{t('template.allTypes')}</MenuItem>
            {templateTypeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>{t('template.appEntry')}</InputLabel>
          <Select
            value={appEntryFilter}
            label={t('template.appEntry')}
            onChange={(e) => onAppEntryFilterChange(e.target.value)}
          >
            <MenuItem value="ALL">{t('template.allEntries')}</MenuItem>
            {appEntryOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );
};
