import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 静态定义翻译资源
const resources = {
  en: {
    translation: {
      "auth": {
        "login": "Login",
        "logout": "Logout",
        "email": "Email",
        "password": "Password",
        "loading": "Loading...",
        "loginTitle": "Login to Email Template Manager",
        "loginButton": "Sign In",
        "logoutConfirm": "Sign Out",
        "authError": "Authentication failed",
        "adminRequired": "Administrator privileges required",
        "networkError": "Network error: {{message}}"
      },
      "template": {
        "templateId": "Template ID",
        "templateName": "Template Name",
        "templateType": "Template Type",
        "appEntry": "Application Entry",
        "subject": "Email Subject",
        "senderEmail": "Sender Email",
        "description": "Description",
        "version": "Version",
        "htmlContent": "HTML Content",
        "textContent": "Text Content",
        "basicInfo": "Basic Information",
        "metadata": "Metadata",
        "content": "Content",
        "preview": "Preview",
        "save": "Save",
        "saving": "Saving...",
        "cancel": "Cancel",
        "close": "Close",
        "delete": "Delete",
        "edit": "Edit",
        "create": "Create",
        "update": "Update",
        "allTypes": "All Types",
        "allEntries": "All Entries",
        "subjectPreview": "Subject",
        "htmlPreview": "HTML Preview",
        "textPreview": "Text Preview",
        "templateList": "Template List",
        "noTemplates": "No templates available",
        "createNew": "Create New Template",
        "addTemplate": "Add Template",
        "editTemplate": "Edit Template",
        "checkFormErrors": "Please check form errors",
        "completeTemplateInfo": "Please complete template information first",
        "author": "Author",
        "tags": "Tags",
        "tagsHelper": "Separate multiple tags with commas",
        "htmlPlaceholder": "Enter HTML email content, {{variableName}} syntax supported",
        "textPlaceholder": "Plain text version of email content",
        "templatePreview": "Template Preview",
        "confirmDelete": "Confirm Delete",
        "deleteConfirmMessage": "Are you sure you want to delete this email template?",
        "templateDetails": "Template Details",
        "id": "ID",
        "from": "From",
        "warning": "Warning",
        "deleteWarningMessage": "This action cannot be undone. The template will be permanently deleted from both the database and S3 storage.",
        "deleting": "Deleting...",
        "deleteTemplate": "Delete Template",
        "deleteConfirmWithName": "Are you sure you want to delete the template \"{{name}}\"? This action cannot be undone.",
        "createTemplate": "Create Template"
      },
      "templateTypes": {
        "VERIFICATION": "Email Verification",
        "WELCOME": "Welcome Email",
        "PASSWORD_RESET": "Password Reset",
        "NOTIFICATION": "Notification",
        "NEWSLETTER": "Newsletter",
        "INVOICE": "Invoice",
        "REMINDER": "Reminder",
        "PROMOTIONAL": "Promotional",
        "TRANSACTIONAL": "Transactional",
        "SYSTEM": "System",
        "CUSTOM": "Custom"
      },
      "appEntries": {
        "WEB_APP": "Web Application",
        "MOBILE_APP": "Mobile Application",
        "ADMIN_PANEL": "Admin Panel",
        "API_SERVICE": "API Service",
        "MARKETING": "Marketing Campaign"
      },
      "variables": {
        "variableManagement": "Variable Management",
        "addVariable": "Add Variable",
        "variableName": "Variable Name",
        "variableType": "Type",
        "description": "Description",
        "defaultValue": "Default Value",
        "required": "Required",
        "variable": "Variable {{index}}",
        "noVariables": "No variables configured. Click 'Add Variable' to create your first variable.",
        "types": {
          "string": "String",
          "number": "Number",
          "boolean": "Boolean",
          "date": "Date",
          "url": "URL"
        }
      },
      "common": {
        "confirm": "Confirm",
        "cancel": "Cancel",
        "yes": "Yes",
        "no": "No",
        "ok": "OK",
        "warning": "Warning",
        "error": "Error",
        "success": "Success",
        "info": "Information",
        "search": "Search",
        "filter": "Filter",
        "sort": "Sort",
        "actions": "Actions"
      },
      "app": {
        "title": "Email Template Manager",
        "description": "Manage email templates for your applications",
        "systemTitle": "Email Template Management System",
        "selectTemplateMessage": "Please select a template from the left sidebar to edit, or create a new template."
      },
      "messages": {
        "deleteConfirm": "Are you sure you want to delete this template?",
        "saveSuccess": "Template saved successfully",
        "deleteSuccess": "Template deleted successfully",
        "loadError": "Failed to load data",
        "saveError": "Failed to save template",
        "loadTemplateDetailsFailed": "Failed to load template details"
      }
    }
  },
  ja: {
    translation: {
      "auth": {
        "login": "ログイン",
        "logout": "ログアウト",
        "email": "メールアドレス",
        "password": "パスワード",
        "loading": "読み込み中...",
        "loginTitle": "メールテンプレート管理システムにログイン",
        "loginButton": "サインイン",
        "logoutConfirm": "サインアウト",
        "authError": "認証に失敗しました",
        "adminRequired": "管理者権限が必要です",
        "networkError": "ネットワークエラー: {{message}}"
      },
      "template": {
        "templateId": "テンプレートID",
        "templateName": "テンプレート名",
        "templateType": "テンプレートタイプ",
        "appEntry": "アプリケーションエントリ",
        "subject": "メール件名",
        "senderEmail": "送信者メールアドレス",
        "description": "説明",
        "version": "バージョン",
        "htmlContent": "HTMLコンテンツ",
        "textContent": "テキストコンテンツ",
        "basicInfo": "基本情報",
        "metadata": "メタデータ",
        "content": "コンテンツ",
        "preview": "プレビュー",
        "save": "保存",
        "saving": "保存中...",
        "cancel": "キャンセル",
        "close": "閉じる",
        "delete": "削除",
        "edit": "編集",
        "create": "作成",
        "update": "更新",
        "allTypes": "すべてのタイプ",
        "allEntries": "すべてのエントリ",
        "subjectPreview": "件名",
        "htmlPreview": "HTMLプレビュー",
        "textPreview": "テキストプレビュー",
        "templateList": "テンプレート一覧",
        "noTemplates": "テンプレートがありません",
        "createNew": "新しいテンプレートを作成",
        "addTemplate": "テンプレートを追加",
        "editTemplate": "テンプレートを編集",
        "checkFormErrors": "フォームエラーを確認してください",
        "completeTemplateInfo": "まずテンプレート情報を完成させてください",
        "author": "作成者",
        "tags": "タグ",
                "tagsHelper": "複数のタグはカンマで区切る",
        "htmlPlaceholder": "HTMLメールコンテンツを入力、{{variableName}} 構文サポート",
        "textPlaceholder": "メールのプレーンテキストバージョン",
        "templatePreview": "テンプレートプレビュー",
        "confirmDelete": "削除の確認",
        "deleteConfirmMessage": "このメールテンプレートを削除してもよろしいですか？",
        "templateDetails": "テンプレート詳細",
        "id": "ID",
        "from": "送信者",
        "warning": "警告",
        "deleteWarningMessage": "この操作は元に戻せません。テンプレートはデータベースとS3ストレージから完全に削除されます。",
        "deleting": "削除中...",
        "deleteTemplate": "テンプレートを削除",
        "deleteConfirmWithName": "テンプレート \"{{name}}\" を削除してもよろしいですか？この操作は元に戻せません。",
        "createTemplate": "テンプレートを作成"
      },
      "templateTypes": {
        "VERIFICATION": "メール認証",
        "WELCOME": "ウェルカムメール",
        "PASSWORD_RESET": "パスワードリセット",
        "NOTIFICATION": "通知",
        "NEWSLETTER": "ニュースレター",
        "INVOICE": "請求書",
        "REMINDER": "リマインダー",
        "PROMOTIONAL": "プロモーション",
        "TRANSACTIONAL": "トランザクション",
        "SYSTEM": "システム",
        "CUSTOM": "カスタム"
      },
      "appEntries": {
        "WEB_APP": "Webアプリケーション",
        "MOBILE_APP": "モバイルアプリ",
        "ADMIN_PANEL": "管理パネル",
        "API_SERVICE": "APIサービス",
        "MARKETING": "マーケティングキャンペーン"
      },
      "variables": {
        "variableManagement": "変数管理",
        "addVariable": "変数を追加",
        "variableName": "変数名",
        "variableType": "タイプ",
        "description": "説明",
        "defaultValue": "デフォルト値",
        "required": "必須",
        "variable": "変数 {{index}}",
        "noVariables": "変数が設定されていません。「変数を追加」をクリックして最初の変数を作成してください。",
        "types": {
          "string": "文字列",
          "number": "数値",
          "boolean": "真偽値",
          "date": "日付",
          "url": "URL"
        }
      },
      "common": {
        "confirm": "確認",
        "cancel": "キャンセル",
        "yes": "はい",
        "no": "いいえ",
        "ok": "OK",
        "warning": "警告",
        "error": "エラー",
        "success": "成功",
        "info": "情報",
        "search": "検索",
        "filter": "フィルター",
        "sort": "並び替え",
        "actions": "アクション"
      },
      "app": {
        "title": "メールテンプレート管理システム",
        "description": "アプリケーション用のメールテンプレートを管理",
        "systemTitle": "メールテンプレート管理システム",
        "selectTemplateMessage": "左側のサイドバーからテンプレートを選択して編集するか、新しいテンプレートを作成してください。"
      },
      "messages": {
        "deleteConfirm": "このテンプレートを削除してもよろしいですか？",
        "saveSuccess": "テンプレートを正常に保存しました",
        "deleteSuccess": "テンプレートを正常に削除しました",
        "loadError": "データの読み込みに失敗しました",
        "saveError": "テンプレートの保存に失敗しました",
        "loadTemplateDetailsFailed": "テンプレート詳細の読み込みに失敗しました"
      }
    }
  },
  zh: {
    translation: {
      "auth": {
        "login": "登录",
        "logout": "退出登录",
        "email": "邮箱",
        "password": "密码",
        "loading": "加载中...",
        "loginTitle": "登录邮件模板管理系统",
        "loginButton": "登录",
        "logoutConfirm": "退出登录",
        "authError": "认证失败",
        "adminRequired": "需要管理员权限",
        "networkError": "网络错误：{{message}}"
      },
      "template": {
        "templateId": "模板ID",
        "templateName": "模板名称",
        "templateType": "模板类型",
        "appEntry": "应用入口",
        "subject": "邮件主题",
        "senderEmail": "发件人邮箱",
        "description": "描述",
        "version": "版本",
        "htmlContent": "HTML内容",
        "textContent": "文本内容",
        "basicInfo": "基本信息",
        "metadata": "元数据",
        "content": "内容",
        "preview": "预览",
        "save": "保存",
        "saving": "保存中...",
        "cancel": "取消",
        "close": "关闭",
        "delete": "删除",
        "edit": "编辑",
        "create": "创建",
        "update": "更新",
        "allTypes": "所有类型",
        "allEntries": "所有入口",
        "subjectPreview": "主题",
        "htmlPreview": "HTML预览",
        "textPreview": "文本预览",
        "templateList": "模板列表",
        "noTemplates": "暂无模板",
        "createNew": "创建新模板",
        "addTemplate": "添加模板",
        "editTemplate": "编辑模板",
        "checkFormErrors": "请检查表单错误",
        "completeTemplateInfo": "请先完善模板信息",
        "author": "作者",
        "tags": "标签",
        "tagsHelper": "多个标签用逗号分隔",
        "htmlPlaceholder": "输入HTML邮件内容，支持 {{变量名}} 语法",
        "textPlaceholder": "纯文本版本的邮件内容",
        "templatePreview": "模板预览",
        "confirmDelete": "确认删除",
        "deleteConfirmMessage": "您确定要删除此邮件模板吗？",
        "templateDetails": "模板详情",
        "id": "ID",
        "from": "发件人",
        "warning": "警告",
        "deleteWarningMessage": "此操作无法撤销。模板将从数据库和S3存储中永久删除。",
        "deleting": "删除中...",
        "deleteTemplate": "删除模板",
        "deleteConfirmWithName": "确定要删除模板 \"{{name}}\" 吗？此操作无法撤销。",
        "createTemplate": "新建模板"
      },
      "templateTypes": {
        "VERIFICATION": "邮箱验证",
        "WELCOME": "欢迎邮件",
        "PASSWORD_RESET": "密码重置",
        "NOTIFICATION": "通知邮件",
        "NEWSLETTER": "邮件简报",
        "INVOICE": "发票邮件",
        "REMINDER": "提醒邮件",
        "PROMOTIONAL": "推广邮件",
        "TRANSACTIONAL": "交易邮件",
        "SYSTEM": "系统邮件",
        "CUSTOM": "自定义"
      },
      "appEntries": {
        "WEB_APP": "Web应用",
        "MOBILE_APP": "移动应用",
        "ADMIN_PANEL": "管理面板",
        "API_SERVICE": "API服务",
        "MARKETING": "营销活动"
      },
      "variables": {
        "variableManagement": "变量管理",
        "addVariable": "添加变量",
        "variableName": "变量名",
        "variableType": "类型",
        "description": "描述",
        "defaultValue": "默认值",
        "required": "必填",
        "variable": "变量 {{index}}",
        "noVariables": "未配置变量。点击\"添加变量\"创建第一个变量。",
        "types": {
          "string": "字符串",
          "number": "数字",
          "boolean": "布尔值",
          "date": "日期",
          "url": "链接"
        }
      },
      "common": {
        "confirm": "确认",
        "cancel": "取消",
        "yes": "是",
        "no": "否",
        "ok": "确定",
        "warning": "警告",
        "error": "错误",
        "success": "成功",
        "info": "信息",
        "search": "搜索",
        "filter": "筛选",
        "sort": "排序",
        "actions": "操作"
      },
      "app": {
        "title": "邮件模板管理系统",
        "description": "管理应用程序的邮件模板",
        "systemTitle": "邮件模板管理系统",
        "selectTemplateMessage": "请从左侧选择一个模板进行编辑，或创建一个新模板。"
      },
      "messages": {
        "deleteConfirm": "确定要删除此模板吗？",
        "saveSuccess": "模板保存成功",
        "deleteSuccess": "模板删除成功",
        "loadError": "数据加载失败",
        "saveError": "模板保存失败",
        "loadTemplateDetailsFailed": "加载模板详情失败"
      }
    }
  }
};

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

// Get initial language from localStorage if in browser, otherwise use fallback
const getInitialLanguage = () => {
  if (isBrowser) {
    return localStorage.getItem('i18nextLng') || 'en';
  }
  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false,
    },
    
    resources,
    
    // Disable react suspense mode to avoid hydration issues
    react: {
      useSuspense: false,
    },
  });

// Listen for language changes and persist to localStorage (client-side only)
if (isBrowser) {
  i18n.on('languageChanged', (lng) => {
    localStorage.setItem('i18nextLng', lng);
  });
}

export default i18n;