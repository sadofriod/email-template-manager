// 用户相关类型 - Updated to match User API format
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 模板变量类型
export interface Variable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'url';
  description: string;
  required: boolean;
  defaultValue?: string;
}

// 模板元数据类型
export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  tags: string[];
}

// 数据库模板记录类型
export interface Template {
  id: string;
  templateId: string;
  type: TemplateType;
  name: string;
  appEntry: AppEntry;
  version: string;
  from: string;
  userId: string;
}

// 完整模板数据类型
export interface TemplateData {
  templateId: string;
  type: TemplateType;
  name: string;
  appEntry: AppEntry;
  from: string;
  metadata: TemplateMetadata;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: Variable[];
  userId?: string;
}

// 枚举类型
export type TemplateType = 
  | 'VERIFICATION'
  | 'WELCOME'
  | 'PASSWORD_RESET'
  | 'NOTIFICATION'
  | 'NEWSLETTER'
  | 'INVOICE'
  | 'REMINDER'
  | 'PROMOTIONAL'
  | 'TRANSACTIONAL'
  | 'SYSTEM'
  | 'CUSTOM';

export type AppEntry = 
  | 'WEB_APP'
  | 'MOBILE_APP'
  | 'ADMIN_PANEL'
  | 'API_SERVICE'
  | 'MARKETING';

export type VariableType = 'string' | 'number' | 'boolean' | 'date' | 'url';

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 认证相关类型
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}