import { useState, useCallback } from "react";
import {
  templateService,
  type ValidTemplateType,
  type ValidAppEntry,
  type TemplateListItem,
  type TemplateDetail,
  type CreateTemplateRequest,
  type UpdateTemplateRequest,
  type PreviewTemplateRequest,
} from "@/services/templateService";
import type { ApiResponse } from "@/types";

interface UseTemplateServiceReturn {
  // State
  templates: TemplateListItem[];
  currentTemplate: TemplateDetail | null;
  loading: boolean;
  error: string | null;

  // Template operations
  listTemplates: (type?: ValidTemplateType) => Promise<void>;
  getTemplate: (
    type: ValidTemplateType,
    id: string,
    appEntry: ValidAppEntry,
  ) => Promise<void>;
  createTemplate: (templateData: CreateTemplateRequest) => Promise<boolean>;
  updateTemplate: (
    type: ValidTemplateType,
    id: string,
    templateData: UpdateTemplateRequest,
  ) => Promise<boolean>;
  deleteTemplate: (
    type: ValidTemplateType,
    id: string,
    appEntry: ValidAppEntry,
  ) => Promise<boolean>;
  previewTemplate: (
    type: ValidTemplateType,
    id: string,
    appEntry: ValidAppEntry,
    data: PreviewTemplateRequest,
  ) => Promise<{
    subject: string;
    htmlContent: string;
    textContent: string;
    from: string;
  } | null>;

  // Utility functions
  clearError: () => void;
  clearCurrentTemplate: () => void;
  getTemplateTypeOptions: () => Array<{
    value: ValidTemplateType;
    label: string;
  }>;
  getAppEntryOptions: () => Array<{ value: ValidAppEntry; label: string }>;
}

/**
 * Custom React hook for managing email templates
 * Provides a simple interface to interact with the Template API
 */
export function useTemplateService(): UseTemplateServiceReturn {
  const [templates, setTemplates] = useState<TemplateListItem[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<TemplateDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to handle API responses
  const handleApiResponse = useCallback(
    <T>(response: ApiResponse<T>): T | null => {
      if (response.success && response.data) {
        setError(null);
        return response.data;
      } else {
        setError(response.error || "An unknown error occurred");
        return null;
      }
    },
    [],
  );

  // List all templates, optionally filtered by type
  const listTemplates = useCallback(
    async (type?: ValidTemplateType) => {
      setLoading(true);
      setError(null);

      try {
        const response = await templateService.listTemplates(type);
        const data = handleApiResponse(response);

        if (data) {
          setTemplates(data.data);
        } else {
          setTemplates([]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to list templates",
        );
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    },
    [handleApiResponse],
  );

  // Get a specific template
  const getTemplate = useCallback(
    async (type: ValidTemplateType, id: string, appEntry: ValidAppEntry) => {
      setLoading(true);
      setError(null);

      try {
        const response = await templateService.getTemplate(type, id, appEntry);
        const data = handleApiResponse(response);

        setCurrentTemplate(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to get template");
        setCurrentTemplate(null);
      } finally {
        setLoading(false);
      }
    },
    [handleApiResponse],
  );

  // Create a new template
  const createTemplate = useCallback(
    async (templateData: CreateTemplateRequest): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await templateService.createTemplate(templateData);
        const data = handleApiResponse(response);

        if (data) {
          // Refresh the templates list
          await listTemplates();
          return true;
        }
        return false;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create template",
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [handleApiResponse, listTemplates],
  );

  // Update an existing template
  const updateTemplate = useCallback(
    async (
      type: ValidTemplateType,
      id: string,
      templateData: UpdateTemplateRequest,
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await templateService.updateTemplate(
          type,
          id,
          templateData,
        );
        const data = handleApiResponse(response);

        if (data) {
          // Refresh the templates list
          await listTemplates();
          return true;
        }
        return false;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update template",
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [handleApiResponse, listTemplates],
  );

  // Delete a template
  const deleteTemplate = useCallback(
    async (
      type: ValidTemplateType,
      id: string,
      appEntry: ValidAppEntry,
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await templateService.deleteTemplate(
          type,
          id,
          appEntry,
        );
        const data = handleApiResponse(response);

        if (data) {
          // Refresh the templates list
          await listTemplates();
          // Clear current template if it was the one deleted
          if (currentTemplate?.metadata.id === id) {
            setCurrentTemplate(null);
          }
          return true;
        }
        return false;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete template",
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [handleApiResponse, listTemplates, currentTemplate],
  );

  // Preview a template with test data
  const previewTemplate = useCallback(
    async (
      type: ValidTemplateType,
      id: string,
      appEntry: ValidAppEntry,
      previewData: PreviewTemplateRequest,
    ): Promise<{
      subject: string;
      htmlContent: string;
      textContent: string;
      from: string;
    } | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await templateService.previewTemplate(
          type,
          id,
          appEntry,
          previewData,
        );
        const data = handleApiResponse(response);

        return data;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to preview template",
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleApiResponse],
  );

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear current template
  const clearCurrentTemplate = useCallback(() => {
    setCurrentTemplate(null);
  }, []);

  // Get template type options for dropdowns
  const getTemplateTypeOptions = useCallback(() => {
    return templateService.getTemplateTypeOptions();
  }, []);

  // Get app entry options for dropdowns
  const getAppEntryOptions = useCallback(() => {
    return templateService.getAppEntryOptions();
  }, []);

  return {
    // State
    templates,
    currentTemplate,
    loading,
    error,

    // Actions
    listTemplates,
    getTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    previewTemplate,

    // Utilities
    clearError,
    clearCurrentTemplate,
    getTemplateTypeOptions,
    getAppEntryOptions,
  };
}

// Additional hook for template validation
export function useTemplateValidation() {
  const validateTemplateType = useCallback(
    (type: string): type is ValidTemplateType => {
      return templateService.isValidTemplateType(type);
    },
    [],
  );

  const validateAppEntry = useCallback(
    (appEntry: string): appEntry is ValidAppEntry => {
      return templateService.isValidAppEntry(appEntry);
    },
    [],
  );

  const validateTemplateData = useCallback(
    (data: Partial<CreateTemplateRequest>): string[] => {
      const errors: string[] = [];

      if (!data.templateId) errors.push("Template ID is required");
      if (!data.type) errors.push("Template type is required");
      if (!data.name) errors.push("Template name is required");
      if (!data.subject) errors.push("Subject is required");
      if (!data.htmlContent) errors.push("HTML content is required");
      if (!data.textContent) errors.push("Text content is required");
      if (!data.appEntry) errors.push("App entry is required");
      if (!data.from) errors.push("From email is required");

      if (data.type && !validateTemplateType(data.type)) {
        errors.push("Invalid template type");
      }

      if (data.appEntry && !validateAppEntry(data.appEntry)) {
        errors.push("Invalid app entry");
      }

      // Email validation
      if (data.from && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.from)) {
        errors.push("Invalid from email address");
      }

      // Template ID validation
      if (data.templateId && !/^[a-zA-Z0-9_-]+$/.test(data.templateId)) {
        errors.push(
          "Template ID can only contain letters, numbers, underscores, and hyphens",
        );
      }

      return errors;
    },
    [validateTemplateType, validateAppEntry],
  );

  return {
    validateTemplateType,
    validateAppEntry,
    validateTemplateData,
  };
}
