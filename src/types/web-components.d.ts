// 为自定义 Web Components 添加类型声明

declare namespace JSX {
  interface IntrinsicElements {
    'email-preview': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}

export {};
