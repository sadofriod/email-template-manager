# 实时 HTML 预览功能

## 功能概述

为邮件模板管理系统添加了实时 HTML 预览功能，在编辑模板时可以在右侧面板实时查看渲染效果。使用 Web Components 和 Shadow DOM 技术实现 CSS 隔离，确保预览内容的样式不会影响主应用。

## 功能特性

### 1. 实时渲染
- ✅ **即时更新**: 用户编辑 HTML 内容时，右侧预览面板立即更新
- ✅ **变量替换**: 自动使用变量的默认值替换模板中的占位符
- ✅ **未定义变量**: 高亮显示未定义的变量，便于识别
- ✅ **主题预览**: 同时显示邮件主题

### 2. CSS 隔离
- ✅ **Shadow DOM**: 使用 Web Components 的 Shadow DOM 实现样式隔离
- ✅ **安全渲染**: 基础的 HTML 清理，移除危险标签和脚本
- ✅ **默认样式**: 为邮件内容提供合理的默认样式
- ✅ **响应式**: 支持图片自适应和表格布局

### 3. 用户体验
- ✅ **分屏布局**: 左侧编辑器 + 右侧预览，工作效率更高
- ✅ **变量提示**: 底部显示所有使用的变量列表
- ✅ **实时标签**: 显示"实时"标签，提示用户这是动态预览
- ✅ **空状态**: 未输入内容时显示友好提示

## 技术实现

### 核心文件

#### 1. `src/components/layout/preview/EmailPreviewComponent.ts`
自定义 Web Component，使用 Shadow DOM 渲染 HTML 内容：

**主要功能**:
- 创建 Shadow DOM 实现 CSS 隔离
- 提供 `setContent(html)` 方法设置 HTML 内容
- 基础的 HTML 清理（移除 script、iframe、内联事件等）
- 默认邮件样式（字体、链接、表格等）
- 空状态处理

**安全措施**:
```typescript
// 移除危险的标签和属性
const dangerous = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /on\w+\s*=\s*["'][^"']*["']/gi, // 移除内联事件处理器
  /javascript:/gi,
];
```

#### 2. `src/components/layout/preview/LivePreviewPanel.tsx`
React 组件，集成 Web Component 并处理业务逻辑：

**主要功能**:
- 使用 `useRef` 引用 Web Component 实例
- 监听数据变化并更新预览内容
- 变量替换逻辑
- 显示主题和变量列表
- 国际化支持

**变量替换逻辑**:
```typescript
// 1. 使用变量的默认值替换
variables.forEach((variable) => {
  const pattern = new RegExp(`{{\\s*${variable.name}\\s*}}`, "g");
  const value = variable.defaultValue || `[${variable.name}]`;
  rendered = rendered.replace(pattern, String(value));
});

// 2. 高亮未定义的变量
rendered = rendered.replace(/{{(\w+)}}/g, (_match, varName) => {
  return `<span style="background: #ffeb3b; padding: 2px 4px;">
    [${varName}]
  </span>`;
});
```

#### 3. `src/components/template/TemplateEditor.tsx`
更新模板编辑器，添加内容变化回调：

**新增功能**:
- `onContentChange` 回调，通知父组件数据变化
- 使用 `useEffect` 监听表单状态变化
- 实时构建模板数据并传递给预览面板

#### 4. `src/components/layout/MainContent.tsx`
更新主内容区域布局：

**布局变化**:
- 左侧：编辑器区域（flex: 1）
- 右侧：实时预览面板（40% 宽度，400-600px）
- 只在编辑模式下显示预览面板

#### 5. `src/components/layout/EmailTemplateLayout.tsx`
更新布局管理器：

**状态管理**:
- 添加 `currentEditingData` 状态存储当前编辑的数据
- `handleContentChange` 处理内容变化
- 传递数据到预览面板

### 文件结构

```
src/components/layout/
├── preview/
│   ├── EmailPreviewComponent.ts   # Web Component 实现
│   ├── LivePreviewPanel.tsx       # React 包装组件
│   └── index.ts                   # 导出
├── AppHeader.tsx
├── EmailTemplateLayout.tsx        # 更新：添加预览数据管理
├── MainContent.tsx                # 更新：分屏布局
└── TemplateSidebar.tsx

src/types/
└── web-components.d.ts            # Web Component 类型声明
```

## UI 布局

```
┌─────────────────────────────────────────────────────────┐
│                      App Header                          │
├──────────┬──────────────────────────────────────────────┤
│          │  ┌────────────────────┬──────────────────┐   │
│          │  │   Template Editor  │  Live Preview    │   │
│ Sidebar  │  │                    │  ┌────────────┐  │   │
│          │  │   ┌──────────┐     │  │ Subject: ..│  │   │
│          │  │   │ Form     │     │  ├────────────┤  │   │
│          │  │   │ Fields   │     │  │            │  │   │
│          │  │   └──────────┘     │  │  Rendered  │  │   │
│          │  │                    │  │   HTML     │  │   │
│          │  │   ┌──────────┐     │  │            │  │   │
│          │  │   │ HTML     │     │  └────────────┘  │   │
│          │  │   │ Editor   │     │  Variables: ...  │   │
│          │  │   └──────────┘     │                  │   │
│          │  └────────────────────┴──────────────────┘   │
└──────────┴──────────────────────────────────────────────┘
```

## 变量处理

### 已定义变量
```html
<!-- 模板中 -->
<h1>{{title}}</h1>

<!-- 预览中（使用默认值） -->
<h1>欢迎使用我们的服务</h1>
```

### 未定义变量
```html
<!-- 模板中 -->
<p>Hello {{userName}}</p>

<!-- 预览中（高亮显示） -->
<p>Hello <span style="background: #ffeb3b;">[userName]</span></p>
```

## 国际化支持

已添加中文、英文、日文翻译：

### 中文
- `preview.livePreview`: "实时预览"
- `preview.realtime`: "实时"
- `preview.variablesUsed`: "使用的变量"
- `preview.noContent`: "暂无预览内容"

### 英文
- `preview.livePreview`: "Live Preview"
- `preview.realtime`: "Real-time"
- `preview.variablesUsed`: "Variables Used"
- `preview.noContent`: "No preview content"

### 日文
- `preview.livePreview`: "ライブプレビュー"
- `preview.realtime`: "リアルタイム"
- `preview.variablesUsed`: "使用されている変数"
- `preview.noContent`: "プレビューコンテンツがありません"

## 使用流程

1. **开始编辑**
   - 用户点击创建或编辑模板
   - 界面分为左右两栏

2. **实时预览**
   - 用户在左侧编辑 HTML 内容
   - 右侧预览面板实时更新
   - 变量自动替换为默认值

3. **变量管理**
   - 添加/修改变量
   - 预览面板立即使用新的默认值
   - 底部显示变量列表

4. **最终预览**
   - 点击预览按钮打开完整预览模态框
   - 可以查看 HTML 和纯文本版本

## 技术优势

### 1. Shadow DOM 的好处
- **样式隔离**: 预览内容的样式不会影响主应用
- **封装性**: Web Component 可独立开发和测试
- **复用性**: 可以在其他项目中重用

### 2. 性能优化
- **防抖更新**: 避免频繁渲染
- **选择性渲染**: 只在编辑模式下渲染预览
- **轻量级**: 使用原生 Web Components，无额外依赖

### 3. 安全性
- **HTML 清理**: 移除危险的脚本和标签
- **事件隔离**: 移除所有内联事件处理器
- **沙箱环境**: Shadow DOM 提供天然隔离

## 注意事项

1. **浏览器兼容性**
   - 现代浏览器都支持 Web Components
   - IE 不支持（需要 polyfill）

2. **HTML 清理**
   - 当前实现是基础版本
   - 生产环境建议使用专业的 sanitizer 库（如 DOMPurify）

3. **样式限制**
   - Shadow DOM 内的样式不会影响外部
   - 外部全局样式也不会影响 Shadow DOM
   - 需要在 Web Component 内部定义所有样式

4. **调试**
   - 可以在浏览器开发者工具中查看 Shadow DOM
   - 使用 `console.log` 追踪内容更新

## 后续优化建议

1. **增强安全性**
   - 集成 DOMPurify 进行专业的 HTML 清理
   - 添加 CSP（内容安全策略）

2. **增强功能**
   - 支持深色模式
   - 添加缩放功能
   - 移动设备预览模式
   - 打印样式预览

3. **性能优化**
   - 虚拟滚动（如果内容很长）
   - 懒加载图片
   - 缓存渲染结果

4. **用户体验**
   - 添加加载动画
   - 支持拖拽调整预览面板宽度
   - 全屏预览模式
   - 并排对比（HTML vs Text）

5. **开发工具**
   - 添加预览错误提示
   - HTML 语法高亮
   - 变量补全提示
