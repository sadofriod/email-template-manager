# 国际化 (Internationalization) 实施文档

## 概述

邮件模板管理器现已支持多语言国际化，当前支持：
- 英语 (English) - `en`
- 日语 (日本語) - `ja`  
- 中文 (中文) - `zh`

## 技术实现

### 1. 依赖包
- `react-i18next`: React国际化核心库
- `i18next`: 国际化基础库
- `i18next-browser-languagedetector`: 浏览器语言检测

### 2. 核心文件结构
```
src/
├── i18n/
│   ├── index.ts          # i18n配置和初始化
│   └── locales/
│       ├── en.json       # 英语翻译资源
│       └── ja.json       # 日语翻译资源
├── hooks/
│   └── useI18nOptions.ts # 国际化选项hooks
└── components/
    └── common/
        └── LanguageSwitcher.tsx # 语言切换组件
```

### 3. 翻译资源结构
翻译资源按功能模块组织：
- `auth`: 认证相关文本
- `template`: 模板相关文本  
- `templateTypes`: 模板类型标签
- `appEntries`: 应用入口标签
- `variables`: 变量管理相关文本
- `common`: 通用文本
- `app`: 应用信息
- `messages`: 消息提示

### 4. 主要组件更新

#### 应用入口 (`src/pages/_app.tsx`)
```typescript
import "@/i18n"; // 初始化i18n

// ...rest of app setup
```

#### 语言切换器 (`LanguageSwitcher`)
提供两种展示模式：
- `select`: 下拉选择器（默认）
- `menu`: 菜单模式

#### 应用头部 (`AppHeader`)
集成了语言切换器，并使用国际化文本

#### 登录表单 (`LoginForm`)
完全国际化，包括标签、按钮文本和错误消息

## 使用方法

### 1. 基本使用
```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('app.title')}</h1>
      <button>{t('common.confirm')}</button>
    </div>
  );
};
```

### 2. 带参数的翻译
```typescript
// 对于包含变量的文本（如：变数 1, 变数 2等）
const variableText = t('variables.variable', { index: 1 });

// 对于错误消息
const errorText = t('auth.networkError', { message: 'Connection failed' });
```

### 3. 使用预定义选项
```typescript
import { useTemplateTypeOptions, useAppEntryOptions } from '@/hooks/useI18nOptions';

const MyForm = () => {
  const templateTypeOptions = useTemplateTypeOptions();
  const appEntryOptions = useAppEntryOptions();
  
  return (
    <Select>
      {templateTypeOptions.map(option => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
};
```

### 4. 添加语言切换器
```typescript
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

// 下拉选择器模式
<LanguageSwitcher variant="select" size="small" />

// 菜单模式  
<LanguageSwitcher variant="menu" />
```

## 添加新语言

### 1. 创建翻译文件
在 `src/i18n/index.ts` 中添加新语言资源：

```typescript
const resources = {
  // 现有语言...
  zh: {
    translation: {
      // 中文翻译资源
    }
  }
};
```

### 2. 更新语言切换器
在 `LanguageSwitcher.tsx` 中添加新语言选项：

```typescript
const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' }, // 新增
];
```

## 翻译关键字段

### 认证模块
- `auth.login`: 登录
- `auth.email`: 邮箱
- `auth.password`: 密码
- `auth.loading`: 加载中

### 模板模块  
- `template.save`: 保存
- `template.preview`: 预览
- `template.templateType`: 模板类型
- `template.appEntry`: 应用入口

### 通用操作
- `common.confirm`: 确认
- `common.cancel`: 取消
- `common.delete`: 删除

## 语言检测和存储

系统按以下优先级检测语言：
1. localStorage中保存的语言设置
2. 浏览器cookie
3. 浏览器语言设置
4. HTML标签语言属性

选择的语言会自动保存到localStorage，下次访问时会记住用户的选择。

## 测试

可以使用 `I18nDemo` 组件测试国际化功能：

```typescript
import { I18nDemo } from '@/components/demo/I18nDemo';

// 在任何页面中使用
<I18nDemo />
```

该组件展示了各种翻译文本的效果，并提供语言切换测试功能。

## 注意事项

1. **性能**: 翻译资源直接内嵌在主包中，适合中小型应用
2. **扩展性**: 如需支持更多语言，考虑使用动态加载
3. **命名规范**: 翻译key使用点分法，按模块层级组织
4. **类型安全**: 可考虑添加TypeScript类型定义以获得更好的开发体验

## 故障排除

1. **翻译不显示**: 检查翻译key是否正确，以及是否正确导入useTranslation
2. **语言切换无效**: 确认localStorage中的语言设置，检查i18n初始化
3. **缺少翻译**: 会回退到英语（fallback语言），检查翻译资源是否完整