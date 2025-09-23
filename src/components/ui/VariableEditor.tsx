import React from 'react';
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
  Typography
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { Variable } from '@/types';
import { VARIABLE_TYPE_OPTIONS } from '@/constants';

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
  onUpdateVariable
}) => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">变量管理</Typography>
        <Button variant="outlined" onClick={onAddVariable}>
          添加变量
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
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="subtitle2">变量 {index + 1}</Typography>
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
              label="变量名"
              value={variable.name}
              onChange={(e) => onUpdateVariable(index, 'name', e.target.value)}
              fullWidth
              size="small"
            />
            <FormControl fullWidth size="small">
              <InputLabel>类型</InputLabel>
              <Select
                value={variable.type}
                label="类型"
                onChange={(e) => onUpdateVariable(index, 'type', e.target.value)}
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
            label="描述"
            value={variable.description}
            onChange={(e) => onUpdateVariable(index, 'description', e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          />

          <Box display="flex" gap={2} alignItems="center">
            <TextField
              label="默认值"
              value={variable.defaultValue || ''}
              onChange={(e) => onUpdateVariable(index, 'defaultValue', e.target.value)}
              fullWidth
              size="small"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={variable.required}
                  onChange={(e) => onUpdateVariable(index, 'required', e.target.checked)}
                />
              }
              label="必填"
            />
          </Box>
        </Box>
      ))}

      {variables.length === 0 && (
        <Typography color="text.secondary" textAlign="center" py={4}>
          暂无变量，点击"添加变量"开始添加
        </Typography>
      )}
    </Box>
  );
};