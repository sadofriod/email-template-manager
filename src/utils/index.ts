import { TemplateType, AppEntry, Variable, TemplateData, ApiResponse } from '@/types';
import { VALIDATION_RULES, API_CONFIG } from '@/constants';

// 验证工具函数
export const validation = {
  templateName: (name: string): string | null => {
    if (name.length < VALIDATION_RULES.TEMPLATE_NAME.minLength) {
      return '模板名称不能为空';
    }
    if (name.length > VALIDATION_RULES.TEMPLATE_NAME.maxLength) {
      return '模板名称不能超过100个字符';
    }
    return null;
  },

  templateId: (id: string): string | null => {
    if (id.length < VALIDATION_RULES.TEMPLATE_ID.minLength) {
      return '模板ID至少需要3个字符';
    }
    if (id.length > VALIDATION_RULES.TEMPLATE_ID.maxLength) {
      return '模板ID不能超过50个字符';
    }
    if (!VALIDATION_RULES.TEMPLATE_ID.pattern.test(id)) {
      return '模板ID只能包含字母、数字、下划线和短横线';
    }
    return null;
  },

  variableName: (name: string): string | null => {
    if (name.length < VALIDATION_RULES.VARIABLE_NAME.minLength) {
      return '变量名不能为空';
    }
    if (name.length > VALIDATION_RULES.VARIABLE_NAME.maxLength) {
      return '变量名不能超过50个字符';
    }
    if (!VALIDATION_RULES.VARIABLE_NAME.pattern.test(name)) {
      return '变量名必须以字母或下划线开头，只能包含字母、数字和下划线';
    }
    return null;
  },

  email: (email: string): string | null => {
    if (!VALIDATION_RULES.EMAIL.pattern.test(email)) {
      return '请输入有效的邮箱地址';
    }
    return null;
  }
};

// 格式化工具函数
export const format = {
  templateType: (type: TemplateType): string => {
    const labels: Record<TemplateType, string> = {
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
    return labels[type] || type;
  },

  appEntry: (entry: AppEntry): string => {
    const labels: Record<AppEntry, string> = {
      WEB_APP: 'Web应用',
      MOBILE_APP: '移动应用',
      ADMIN_PANEL: '管理面板',
      API_SERVICE: 'API服务',
      MARKETING: '营销活动'
    };
    return labels[entry] || entry;
  },

  date: (date: string | Date): string => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

// 模板处理工具函数
export const template = {
  generateId: (name: string): string => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-_]/g, '')
      .substring(0, 50);
  },

  validateVariables: (variables: Variable[]): string[] => {
    const errors: string[] = [];
    const names = new Set<string>();

    variables.forEach((variable, index) => {
      const nameError = validation.variableName(variable.name);
      if (nameError) {
        errors.push(`变量 ${index + 1}: ${nameError}`);
      } else if (names.has(variable.name)) {
        errors.push(`变量 ${index + 1}: 变量名 "${variable.name}" 重复`);
      } else {
        names.add(variable.name);
      }
    });

    return errors;
  },

  renderVariables: (content: string, variables: Record<string, any>): string => {
    return content.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
      return variables[varName] || match;
    });
  },

  extractVariableNames: (content: string): string[] => {
    const matches = content.match(/\{\{(\w+)\}\}/g);
    if (!matches) return [];
    
    return Array.from(new Set(
      matches.map(match => match.replace(/[{}]/g, ''))
    ));
  },

  createDefaultTemplate: (type: TemplateType): Partial<TemplateData> => {
    return {
      type,
      name: `新${format.templateType(type)}模板`,
      appEntry: 'WEB_APP',
      from: 'noreply@example.com',
      subject: '默认主题',
      htmlContent: '<html><body><h1>{{title}}</h1><p>{{content}}</p></body></html>',
      textContent: '{{title}}\n\n{{content}}',
      variables: [
        {
          name: 'title',
          type: 'string',
          description: '标题',
          required: true,
          defaultValue: '默认标题'
        },
        {
          name: 'content',
          type: 'string',
          description: '内容',
          required: true,
          defaultValue: '默认内容'
        }
      ]
    };
  }
};

// API 请求工具函数
export const api = {
  // 构建完整的 URL
  buildUrl: (path: string): string => {
    // 如果路径已经是完整 URL，直接返回
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    // 组合基础 URL 和路径
    return `${API_CONFIG.BASE_URL}${path}`;
  },

  // 获取认证头
  getAuthHeaders: (): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // 获取token
    const token = storage.get('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  },

  get: async <T>(url: string): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(api.buildUrl(url), {
        method: 'GET',
        headers: api.getAuthHeaders(),
        credentials: 'include', // Include cookies for CORS requests
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '请求失败'
      };
    }
  },

  post: async <T>(url: string, body: any): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(api.buildUrl(url), {
        method: 'POST',
        headers: api.getAuthHeaders(),
        credentials: 'include', // Include cookies for CORS requests
        body: JSON.stringify(body)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '请求失败'
      };
    }
  },

  put: async <T>(url: string, body: any): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(api.buildUrl(url), {
        method: 'PUT',
        headers: api.getAuthHeaders(),
        credentials: 'include', // Include cookies for CORS requests
        body: JSON.stringify(body)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '请求失败'
      };
    }
  },

  delete: async <T>(url: string): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(api.buildUrl(url), {
        method: 'DELETE',
        headers: api.getAuthHeaders(),
        credentials: 'include', // Include cookies for CORS requests
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '请求失败'
      };
    }
  }
};

// 存储工具函数
export const storage = {
  get: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  },

  set: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },

  getObject: <T>(key: string): T | null => {
    const value = storage.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  },

  setObject: <T>(key: string, value: T): void => {
    storage.set(key, JSON.stringify(value));
  }
};