import { useState, useCallback } from 'react';
import { Variable, TemplateData } from '@/types';
import { validation, template } from '@/utils';

// 表单状态管理 Hook
export const useFormState = <T extends Record<string, any>>(initialState: T) => {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouchedState] = useState<Partial<Record<keyof T, boolean>>>({});

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const setError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const setTouched = useCallback((field: keyof T) => {
    setTouchedState(prev => ({ ...prev, [field]: true }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialState);
    setErrors({});
    setTouchedState({});
  }, [initialState]);

  const hasErrors = Object.values(errors).some(error => !!error);

  return {
    values,
    errors,
    touched,
    setValue,
    setError,
    setTouched,
    reset,
    hasErrors
  };
};

// 变量管理 Hook
export const useVariables = (initialVariables: Variable[] = []) => {
  const [variables, setVariables] = useState<Variable[]>(initialVariables);

  const addVariable = useCallback(() => {
    const newVariable: Variable = {
      name: '',
      type: 'string',
      description: '',
      required: false,
      defaultValue: ''
    };
    setVariables(prev => [...prev, newVariable]);
  }, []);

  const removeVariable = useCallback((index: number) => {
    setVariables(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateVariable = useCallback((index: number, field: keyof Variable, value: any) => {
    setVariables(prev => prev.map((variable, i) => 
      i === index ? { ...variable, [field]: value } : variable
    ));
  }, []);

  const validateVariables = useCallback(() => {
    return template.validateVariables(variables);
  }, [variables]);

  const clearVariables = useCallback(() => {
    setVariables([]);
  }, []);

  return {
    variables,
    addVariable,
    removeVariable,
    updateVariable,
    validateVariables,
    clearVariables,
    setVariables
  };
};

// 模板编辑器 Hook
export const useTemplateEditor = (initialTemplate?: Partial<TemplateData>) => {
  const formState = useFormState({
    templateId: initialTemplate?.templateId || '',
    name: initialTemplate?.name || '',
    type: initialTemplate?.type || 'VERIFICATION',
    appEntry: initialTemplate?.appEntry || 'WEB_APP',
    from: initialTemplate?.from || '',
    subject: initialTemplate?.subject || '',
    htmlContent: initialTemplate?.htmlContent || '',
    textContent: initialTemplate?.textContent || '',
    description: initialTemplate?.metadata?.description || '',
    version: initialTemplate?.metadata?.version || '1.0.0',
    author: initialTemplate?.metadata?.author || '',
    tags: initialTemplate?.metadata?.tags?.join(', ') || ''
  });

  const variableState = useVariables(initialTemplate?.variables);

  const validateForm = useCallback(() => {
    const { values } = formState;
    let isValid = true;

    // 验证模板ID
    const templateIdError = validation.templateId(values.templateId);
    if (templateIdError) {
      formState.setError('templateId', templateIdError);
      isValid = false;
    }

    // 验证模板名称
    const nameError = validation.templateName(values.name);
    if (nameError) {
      formState.setError('name', nameError);
      isValid = false;
    }

    // 验证发件人邮箱
    if (values.from) {
      const fromError = validation.email(values.from);
      if (fromError) {
        formState.setError('from', fromError);
        isValid = false;
      }
    }

    // 验证变量
    const variableErrors = variableState.validateVariables();
    if (variableErrors.length > 0) {
      isValid = false;
    }

    return { isValid, variableErrors };
  }, [formState, variableState]);

  const buildTemplateData = useCallback((): TemplateData => {
    const { values } = formState;
    const tags = values.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    return {
      templateId: values.templateId,
      type: values.type,
      name: values.name,
      appEntry: values.appEntry,
      from: values.from,
      metadata: {
        id: values.templateId,
        name: values.name,
        description: values.description,
        version: values.version,
        author: values.author,
        tags
      },
      subject: values.subject,
      htmlContent: values.htmlContent,
      textContent: values.textContent,
      variables: variableState.variables
    };
  }, [formState, variableState]);

  const reset = useCallback(() => {
    formState.reset();
    variableState.clearVariables();
  }, [formState, variableState]);

  return {
    formState,
    variableState,
    validateForm,
    buildTemplateData,
    reset
  };
};