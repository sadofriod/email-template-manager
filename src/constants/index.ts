import { TemplateType, AppEntry } from '@/types';

// 模板类型配置
export const TEMPLATE_TYPES: readonly TemplateType[] = [
  'VERIFICATION',
  'WELCOME', 
  'PASSWORD_RESET',
  'NOTIFICATION',
  'NEWSLETTER',
  'INVOICE',
  'REMINDER',
  'PROMOTIONAL',
  'TRANSACTIONAL',
  'SYSTEM',
  'CUSTOM'
] as const;

export const TEMPLATE_TYPE_LABELS: Record<TemplateType, string> = {
  VERIFICATION: '验证邮件',
  WELCOME: '欢迎邮件',
  PASSWORD_RESET: '密码重置',
  NOTIFICATION: '通知邮件',
  NEWSLETTER: '邮件简报',
  INVOICE: '发票邮件',
  REMINDER: '提醒邮件',
  PROMOTIONAL: '推广邮件',
  TRANSACTIONAL: '交易邮件',
  SYSTEM: '系统邮件',
  CUSTOM: '自定义'
};

// 应用入口配置
export const APP_ENTRIES: readonly AppEntry[] = [
  'WEB_APP',
  'MOBILE_APP',
  'ADMIN_PANEL',
  'API_SERVICE',
  'MARKETING'
] as const;

export const APP_ENTRY_LABELS: Record<AppEntry, string> = {
  WEB_APP: 'Web应用',
  MOBILE_APP: '移动应用',
  ADMIN_PANEL: '管理面板',
  API_SERVICE: 'API服务',
  MARKETING: '营销活动'
};

// 变量类型配置
export const VARIABLE_TYPE_OPTIONS = [
  { value: 'string', label: '字符串' },
  { value: 'number', label: '数字' },
  { value: 'boolean', label: '布尔值' },
  { value: 'date', label: '日期' },
  { value: 'url', label: '链接' }
];

// API 配置
export const API_CONFIG = {
  // 在开发环境中，如果是内部 API 路由，使用相对路径；如果需要调用外部 API，使用完整 URL
  BASE_URL: process.env.NODE_ENV === 'development' 
    ? (process.env.NEXT_PUBLIC_API_BASE_URL || '') 
    : (process.env.NEXT_PUBLIC_API_BASE_URL || ''),
  TIMEOUT: 30000
} as const;

// API 路径
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/users/login',
    LOGOUT: '/api/users/logout',
    ME: '/api/users/me'
  },
  TEMPLATES: {
    BASE: '/api/email-templates',
    BY_ID: (id: string) => `/api/email-templates/${id}`,
    BY_TYPE: (type: TemplateType) => `/api/email-templates/${type}`,
    BY_TYPE_AND_ID: (type: TemplateType, id: string, appEntry: string) => `/api/email-templates/${type}/${id}?appEntry=${appEntry}`,
  }
} as const;

// 表单验证规则
export const VALIDATION_RULES = {
  TEMPLATE_NAME: {
    minLength: 1,
    maxLength: 100
  },
  TEMPLATE_ID: {
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9_-]+$/
  },
  VARIABLE_NAME: {
    minLength: 1,
    maxLength: 50,
    pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/
  },
  EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
} as const;

// UI 配置
export const UI_CONFIG = {
  COLORS: {
    PRIMARY: '#1976d2',
    SECONDARY: '#dc004e',
    SUCCESS: '#2e7d32',
    ERROR: '#d32f2f',
    WARNING: '#ed6c02',
    INFO: '#0288d1'
  },
  SPACING: {
    SECTION_GAP: 3,
    FORM_GAP: 2,
    CARD_PADDING: 3
  }
} as const;