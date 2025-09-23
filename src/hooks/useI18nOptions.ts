import { useTranslation } from 'react-i18next';
import type { TemplateType, AppEntry, VariableType } from '@/types';

// 获取模板类型选项（带国际化）
export const useTemplateTypeOptions = () => {
  const { t } = useTranslation();
  
  const TEMPLATE_TYPES: readonly TemplateType[] = [
    "VERIFICATION",
    "WELCOME", 
    "PASSWORD_RESET",
    "NOTIFICATION",
    "NEWSLETTER",
    "INVOICE",
    "REMINDER",
    "PROMOTIONAL",
    "TRANSACTIONAL",
    "SYSTEM",
    "CUSTOM",
  ] as const;
  
  return TEMPLATE_TYPES.map(type => ({
    value: type,
    label: t(`templateTypes.${type}`)
  }));
};

// 获取应用入口选项（带国际化）
export const useAppEntryOptions = () => {
  const { t } = useTranslation();
  
  const APP_ENTRIES: readonly AppEntry[] = [
    "WEB_APP",
    "MOBILE_APP", 
    "ADMIN_PANEL",
    "API_SERVICE",
    "MARKETING",
  ] as const;
  
  return APP_ENTRIES.map(entry => ({
    value: entry,
    label: t(`appEntries.${entry}`)
  }));
};

// 获取变量类型选项（带国际化）
export const useVariableTypeOptions = () => {
  const { t } = useTranslation();
  
  const VARIABLE_TYPES: readonly VariableType[] = [
    "string",
    "number",
    "boolean", 
    "date",
    "url",
  ] as const;
  
  return VARIABLE_TYPES.map(type => ({
    value: type,
    label: t(`variables.types.${type}`)
  }));
};

// 获取模板类型标签
export const useTemplateTypeLabel = (type: TemplateType) => {
  const { t } = useTranslation();
  return t(`templateTypes.${type}`);
};

// 获取应用入口标签
export const useAppEntryLabel = (entry: AppEntry) => {
  const { t } = useTranslation();
  return t(`appEntries.${entry}`);
};

// 获取变量类型标签
export const useVariableTypeLabel = (type: VariableType) => {
  const { t } = useTranslation();
  return t(`variables.types.${type}`);
};