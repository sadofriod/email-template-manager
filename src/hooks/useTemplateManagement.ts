import { useState, useEffect } from 'react';
import type { Template, TemplateData, TemplateType } from '@/types';
import { API_ROUTES } from '@/constants';
import { api } from '@/utils';

interface UseTemplateManagementResult {
  // 数据状态
  templates: Template[];
  selectedTemplate: TemplateData | null;
  loading: boolean;
  
  // 筛选状态
  typeFilter: TemplateType | 'ALL';
  appEntryFilter: string;
  filteredTemplates: Template[];
  
  // 编辑状态
  isEditing: boolean;
  previewTemplate: TemplateData | null;
  deleteTemplate: Template | null;
  
  // 提示状态
  alert: { type: 'success' | 'error', message: string } | null;
  
  // 操作方法
  loadTemplates: () => Promise<void>;
  setTypeFilter: (type: TemplateType | 'ALL') => void;
  setAppEntryFilter: (appEntry: string) => void;
  handleCreateTemplate: () => void;
  handleEditTemplate: (template: Template) => Promise<void>;
  handleSaveTemplate: (templateData: TemplateData) => Promise<void>;
  handleDeleteTemplate: () => Promise<void>;
  handlePreviewTemplate: (templateData: TemplateData) => void;
  setPreviewTemplate: (template: TemplateData | null) => void;
  setDeleteTemplate: (template: Template | null) => void;
  setAlert: (alert: { type: 'success' | 'error', message: string } | null) => void;
  setIsEditing: (editing: boolean) => void;
  setSelectedTemplate: (template: TemplateData | null) => void;
}

export const useTemplateManagement = (): UseTemplateManagementResult => {
  // 数据状态
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 筛选状态
  const [typeFilter, setTypeFilter] = useState<TemplateType | 'ALL'>('ALL');
  const [appEntryFilter, setAppEntryFilter] = useState<string>('ALL');
  
  // 编辑状态
  const [isEditing, setIsEditing] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateData | null>(null);
  const [deleteTemplate, setDeleteTemplate] = useState<Template | null>(null);
  
  // 提示状态
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // 加载模板列表
  const loadTemplates = async () => {
    setLoading(true);
    try {
      const response = await api.get<Template[]>(API_ROUTES.TEMPLATES.BASE);
      if (response.success && response.data) {
        setTemplates(response.data);
      }
    } catch (error) {
      setAlert({ type: 'error', message: '加载模板失败' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  // 筛选模板
  const filteredTemplates = templates.filter(template => {
    if (typeFilter !== 'ALL' && template.type !== typeFilter) return false;
    if (appEntryFilter !== 'ALL' && template.appEntry !== appEntryFilter) return false;
    return true;
  });

  // 创建新模板
  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setIsEditing(true);
  };

  // 编辑模板
  const handleEditTemplate = async (template: Template) => {
    try {
      const response = await api.get<TemplateData>(
        API_ROUTES.TEMPLATES.BY_TYPE_AND_ID(template.type, template.templateId, template.appEntry)
      );
      if (response.success && response.data) {
        setSelectedTemplate(response.data);
        setIsEditing(true);
      }
    } catch (error) {
      setAlert({ type: 'error', message: '加载模板详情失败' });
    }
  };

  // 保存模板
  const handleSaveTemplate = async (templateData: TemplateData) => {
    try {
      const url = selectedTemplate 
        ? API_ROUTES.TEMPLATES.BY_TYPE_AND_ID(templateData.type, templateData.templateId, templateData.appEntry)
        : API_ROUTES.TEMPLATES.BASE;
      
      const response = selectedTemplate
        ? await api.put(url, templateData)
        : await api.post(url, templateData);

      if (response.success) {
        setAlert({ type: 'success', message: '模板保存成功' });
        setIsEditing(false);
        setSelectedTemplate(null);
        loadTemplates();
      } else {
        throw new Error(response.error || '保存失败');
      }
    } catch (error) {
      throw error;
    }
  };

  // 删除模板
  const handleDeleteTemplate = async () => {
    if (!deleteTemplate) return;

    try {
      const response = await api.delete(
        API_ROUTES.TEMPLATES.BY_TYPE_AND_ID(deleteTemplate.type, deleteTemplate.templateId, deleteTemplate.appEntry)
      );
      
      if (response.success) {
        setAlert({ type: 'success', message: '模板删除成功' });
        setDeleteTemplate(null);
        loadTemplates();
      } else {
        throw new Error(response.error || '删除失败');
      }
    } catch (error) {
      setAlert({ 
        type: 'error', 
        message: error instanceof Error ? error.message : '删除失败' 
      });
    }
  };

  // 预览模板
  const handlePreviewTemplate = (templateData: TemplateData) => {
    setPreviewTemplate(templateData);
  };

  return {
    // 数据状态
    templates,
    selectedTemplate,
    loading,
    
    // 筛选状态
    typeFilter,
    appEntryFilter,
    filteredTemplates,
    
    // 编辑状态
    isEditing,
    previewTemplate,
    deleteTemplate,
    
    // 提示状态
    alert,
    
    // 操作方法
    loadTemplates,
    setTypeFilter,
    setAppEntryFilter,
    handleCreateTemplate,
    handleEditTemplate,
    handleSaveTemplate,
    handleDeleteTemplate,
    handlePreviewTemplate,
    setPreviewTemplate,
    setDeleteTemplate,
    setAlert,
    setIsEditing,
    setSelectedTemplate
  };
};