import type React from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  IconButton,
  Typography,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import type { Variable } from "@/types";
import { VARIABLE_TYPE_OPTIONS } from "@/constants";

interface VariableEditorProps {
  variables: Variable[];
  onAddVariable: () => void;
  onRemoveVariable: (index: number) => void;
  onUpdateVariable: (index: number, field: keyof Variable, value: any) => void;
}

export const VariableEditor: React.FC<VariableEditorProps> = ({
  variables,
  onAddVariable,
  onRemoveVariable,
  onUpdateVariable,
}) => {
  const { t } = useTranslation();
  
  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">{t('variables.variableManagement')}</Typography>
        <Button variant="outlined" onClick={onAddVariable}>
          {t('variables.addVariable')}
        </Button>
      </Box>

      {variables.map((variable, index) => (
        <Box
          key={index}
          border={1}
          borderColor="grey.300"
          borderRadius={1}
          p={2}
          mb={2}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="subtitle2">{t('variables.variable', { index: index + 1 })}</Typography>
            <IconButton
              size="small"
              onClick={() => onRemoveVariable(index)}
              color="error"
            >
              <Delete />
            </IconButton>
          </Box>

          <Box display="flex" gap={2} mb={2}>
            <TextField
              label={t('variables.variableName')}
              value={variable.name}
              onChange={(e) => onUpdateVariable(index, "name", e.target.value)}
              fullWidth
              size="small"
            />
            <FormControl fullWidth size="small">
              <InputLabel>{t('variables.variableType')}</InputLabel>
              <Select
                value={variable.type}
                label={t('variables.variableType')}
                onChange={(e) =>
                  onUpdateVariable(index, "type", e.target.value)
                }
              >
                {VARIABLE_TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TextField
            label={t('variables.description')}
            value={variable.description}
            onChange={(e) =>
              onUpdateVariable(index, "description", e.target.value)
            }
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          />

          <Box display="flex" gap={2} alignItems="center">
            <TextField
              label={t('variables.defaultValue')}
              value={variable.defaultValue || ""}
              onChange={(e) =>
                onUpdateVariable(index, "defaultValue", e.target.value)
              }
              fullWidth
              size="small"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={variable.required}
                  onChange={(e) =>
                    onUpdateVariable(index, "required", e.target.checked)
                  }
                />
              }
              label={t('variables.required')}
            />
          </Box>
        </Box>
      ))}

      {variables.length === 0 && (
        <Typography color="text.secondary" textAlign="center" py={4}>
          {t('variables.noVariables')}
        </Typography>
      )}
    </Box>
  );
};
