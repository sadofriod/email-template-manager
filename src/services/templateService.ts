import { api } from "@/utils";
import type { ApiResponse, TemplateType } from "@/types";

// API response types based on the documentation
interface TemplateListItem {
  id: string;
  type: TemplateType;
  name: string;
  description: string;
  version: string;
  tags: string[];
  author: string;
  appEntry: string;
  createdAt: string;
  updatedAt: string;
}

interface TemplateDetail {
  metadata: {
    id: string;
    name: string;
    description: string;
    version: string;
    tags: string[];
    author: string;
  };
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
  appEntry: string;
  from: string;
  type: TemplateType;
}

interface CreateTemplateRequest {
  templateId: string;
  type: TemplateType;
  name: string;
  description?: string;
  version?: string;
  tags?: string[];
  author?: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables?: string[];
  appEntry: string;
  from: string;
  userId?: string;
}

interface UpdateTemplateRequest {
  name: string;
  description?: string;
  version?: string;
  tags?: string[];
  author?: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables?: string[];
  appEntry: string;
  from: string;
}

interface PreviewTemplateRequest {
  data: Record<string, any>;
}

// Valid app entries according to the API documentation
type ValidAppEntry = "freezer" | "tennis" | "qaBot";

// Valid template types according to the API documentation
type ValidTemplateType =
  | "VERIFICATION"
  | "WELCOME"
  | "PASSWORD_RESET"
  | "NOTIFICATION"
  | "NEWSLETTER"
  | "INVOICE"
  | "REMINDER";

class TemplateService {
  private readonly baseUrl = "/api/email-templates";

  /**
   * List all email templates, optionally filtered by type
   * GET /api/email-templates?type={type}
   */
  async listTemplates(
    type?: ValidTemplateType,
  ): Promise<ApiResponse<{ data: TemplateListItem[]; count: number }>> {
    try {
      const queryParams = type ? `?type=${type}` : "";
      const response = await api.get<{
        data: TemplateListItem[];
        count: number;
      }>(`${this.baseUrl}${queryParams}`);
      return response;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch templates",
      };
    }
  }

  /**
   * Get a specific template by type and ID
   * GET /api/email-templates/:type/:id?appEntry={appEntry}
   */
  async getTemplate(
    type: ValidTemplateType,
    id: string,
    appEntry: ValidAppEntry,
  ): Promise<ApiResponse<TemplateDetail>> {
    try {
      const response = await api.get<TemplateDetail>(
        `${this.baseUrl}/${type}/${id}?appEntry=${appEntry}`,
      );
      return response;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch template",
      };
    }
  }

  /**
   * Create a new email template
   * POST /api/email-templates
   */
  async createTemplate(
    templateData: CreateTemplateRequest,
  ): Promise<ApiResponse<{ templateId: string; type: TemplateType }>> {
    try {
      const response = await api.post<{
        templateId: string;
        type: TemplateType;
      }>(this.baseUrl, templateData);
      return response;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create template",
      };
    }
  }

  /**
   * Update an existing email template
   * PUT /api/email-templates/:type/:id
   */
  async updateTemplate(
    type: ValidTemplateType,
    id: string,
    templateData: UpdateTemplateRequest,
  ): Promise<ApiResponse<{ templateId: string; type: TemplateType }>> {
    try {
      const response = await api.put<{
        templateId: string;
        type: TemplateType;
      }>(`${this.baseUrl}/${type}/${id}`, templateData);
      return response;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update template",
      };
    }
  }

  /**
   * Preview a template with test data
   * POST /api/email-templates/:type/:id/preview?appEntry={appEntry}
   */
  async previewTemplate(
    type: ValidTemplateType,
    id: string,
    appEntry: ValidAppEntry,
    previewData: PreviewTemplateRequest,
  ): Promise<
    ApiResponse<{
      subject: string;
      htmlContent: string;
      textContent: string;
      from: string;
    }>
  > {
    try {
      const response = await api.post<{
        subject: string;
        htmlContent: string;
        textContent: string;
        from: string;
      }>(
        `${this.baseUrl}/${type}/${id}/preview?appEntry=${appEntry}`,
        previewData,
      );
      return response;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to preview template",
      };
    }
  }

  /**
   * Delete an email template
   * DELETE /api/email-templates/:type/:id?appEntry={appEntry}
   */
  async deleteTemplate(
    type: ValidTemplateType,
    id: string,
    appEntry: ValidAppEntry,
  ): Promise<ApiResponse<{ templateId: string; type: TemplateType }>> {
    try {
      const response = await api.delete<{
        templateId: string;
        type: TemplateType;
      }>(`${this.baseUrl}/${type}/${id}?appEntry=${appEntry}`);
      return response;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete template",
      };
    }
  }

  /**
   * Helper method to validate template type
   */
  isValidTemplateType(type: string): type is ValidTemplateType {
    const validTypes: ValidTemplateType[] = [
      "VERIFICATION",
      "WELCOME",
      "PASSWORD_RESET",
      "NOTIFICATION",
      "NEWSLETTER",
      "INVOICE",
      "REMINDER",
    ];
    return validTypes.includes(type as ValidTemplateType);
  }

  /**
   * Helper method to validate app entry
   */
  isValidAppEntry(appEntry: string): appEntry is ValidAppEntry {
    const validEntries: ValidAppEntry[] = ["freezer", "tennis", "qaBot"];
    return validEntries.includes(appEntry as ValidAppEntry);
  }

  /**
   * Helper method to get template type options for UI
   */
  getTemplateTypeOptions() {
    return [
      {
        value: "VERIFICATION" as ValidTemplateType,
        label: "Email Verification",
      },
      { value: "WELCOME" as ValidTemplateType, label: "Welcome Email" },
      { value: "PASSWORD_RESET" as ValidTemplateType, label: "Password Reset" },
      { value: "NOTIFICATION" as ValidTemplateType, label: "Notification" },
      { value: "NEWSLETTER" as ValidTemplateType, label: "Newsletter" },
      { value: "INVOICE" as ValidTemplateType, label: "Invoice" },
      { value: "REMINDER" as ValidTemplateType, label: "Reminder" },
    ];
  }

  /**
   * Helper method to get app entry options for UI
   */
  getAppEntryOptions() {
    return [
      { value: "freezer" as ValidAppEntry, label: "Freezer Application" },
      { value: "tennis" as ValidAppEntry, label: "Tennis Application" },
      { value: "qaBot" as ValidAppEntry, label: "QA Bot Application" },
    ];
  }
}

// Export singleton instance
export const templateService = new TemplateService();

// Export types for external use
export type {
  ValidTemplateType,
  ValidAppEntry,
  TemplateListItem,
  TemplateDetail,
  CreateTemplateRequest,
  UpdateTemplateRequest,
  PreviewTemplateRequest,
};
