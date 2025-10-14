'use client';

/**
 * 邮件预览 Web Component
 * 使用 Shadow DOM 实现 CSS 隔离
 * 
 * 注意：此组件只能在客户端使用，不支持 SSR
 */

// 只在浏览器环境中定义和注册 Web Component
if (typeof window !== 'undefined' && typeof HTMLElement !== 'undefined') {
  class EmailPreviewComponent extends HTMLElement {
    private shadow: ShadowRoot;
    private contentContainer: HTMLDivElement;

    constructor() {
      super();
      
      // 创建 Shadow DOM
      this.shadow = this.attachShadow({ mode: 'open' });
      
      // 创建样式
      const style = document.createElement('style');
      style.textContent = `
        :host {
          display: block;
          width: 100%;
          height: 100%;
          background: #ffffff;
          overflow: auto;
        }

        .preview-container {
          padding: 20px;
          min-height: 100%;
          box-sizing: border-box;
        }

        /* 默认邮件样式 */
        .preview-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: #333;
        }

        .preview-container h1,
        .preview-container h2,
        .preview-container h3,
        .preview-container h4,
        .preview-container h5,
        .preview-container h6 {
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }

        .preview-container p {
          margin: 1em 0;
        }

        .preview-container a {
          color: #1976d2;
          text-decoration: none;
        }

        .preview-container a:hover {
          text-decoration: underline;
        }

        .preview-container img {
          max-width: 100%;
          height: auto;
        }

        .preview-container table {
          border-collapse: collapse;
          width: 100%;
        }

        .preview-container th,
        .preview-container td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        /* 空状态样式 */
        .empty-state {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          color: #999;
          font-size: 16px;
          text-align: center;
          padding: 40px;
        }
      `;
      
      // 创建内容容器
      this.contentContainer = document.createElement('div');
      this.contentContainer.className = 'preview-container';
      
      // 添加到 Shadow DOM
      this.shadow.appendChild(style);
      this.shadow.appendChild(this.contentContainer);
    }

    /**
     * 设置 HTML 内容
     */
    setContent(html: string) {
      if (!html || html.trim() === '') {
        this.contentContainer.innerHTML = '<div class="empty-state">暂无预览内容</div>';
        return;
      }
      
      // 清理并设置 HTML 内容
      this.contentContainer.innerHTML = this.sanitizeHtml(html);
    }

    /**
     * 简单的 HTML 清理（基础版本）
     * 生产环境建议使用专业的 sanitizer 库
     */
    private sanitizeHtml(html: string): string {
      // 移除危险的标签和属性
      const dangerous = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
        /on\w+\s*=\s*["'][^"']*["']/gi, // 移除内联事件处理器
        /javascript:/gi,
      ];
      
      let cleaned = html;
      dangerous.forEach(pattern => {
        cleaned = cleaned.replace(pattern, '');
      });
      
      return cleaned;
    }

    /**
     * 清空内容
     */
    clear() {
      this.contentContainer.innerHTML = '<div class="empty-state">暂无预览内容</div>';
    }

    /**
     * Web Component 生命周期：连接到 DOM
     */
    connectedCallback() {
      // 初始化时显示空状态
      if (this.contentContainer.innerHTML === '') {
        this.clear();
      }
    }

    /**
     * Web Component 生命周期：从 DOM 断开
     */
    disconnectedCallback() {
      // 清理工作
    }
  }

  // 注册 Web Component
  if (typeof customElements !== 'undefined' && !customElements.get('email-preview')) {
    customElements.define('email-preview', EmailPreviewComponent);
  }
}

export default {};
