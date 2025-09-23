import { templateService, ValidTemplateType, ValidAppEntry } from './templateService';

/**
 * Example usage of the Template Service
 * This file demonstrates how to use the templateService to interact with the Email Template API
 */

// Example 1: List all templates
export async function exampleListAllTemplates() {
  try {
    const response = await templateService.listTemplates();
    
    if (response.success && response.data) {
      console.log(`Found ${response.data.count} templates:`, response.data.data);
      return response.data.data;
    } else {
      console.error('Failed to fetch templates:', response.error);
      return [];
    }
  } catch (error) {
    console.error('Error listing templates:', error);
    return [];
  }
}

// Example 2: List templates filtered by type
export async function exampleListTemplatesByType(type: ValidTemplateType) {
  try {
    const response = await templateService.listTemplates(type);
    
    if (response.success && response.data) {
      console.log(`Found ${response.data.count} ${type} templates:`, response.data.data);
      return response.data.data;
    } else {
      console.error(`Failed to fetch ${type} templates:`, response.error);
      return [];
    }
  } catch (error) {
    console.error(`Error listing ${type} templates:`, error);
    return [];
  }
}

// Example 3: Get a specific template
export async function exampleGetTemplate(
  type: ValidTemplateType, 
  id: string, 
  appEntry: ValidAppEntry
) {
  try {
    const response = await templateService.getTemplate(type, id, appEntry);
    
    if (response.success && response.data) {
      console.log('Template details:', response.data);
      return response.data;
    } else {
      console.error('Failed to fetch template:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Error fetching template:', error);
    return null;
  }
}

// Example 4: Create a new template
export async function exampleCreateTemplate() {
  try {
    const newTemplate = {
      templateId: 'welcome-email-v2',
      type: 'WELCOME' as ValidTemplateType,
      name: 'Welcome Email Template v2',
      description: 'Updated welcome email template with better design',
      version: '2.0.0',
      tags: ['welcome', 'onboarding', 'user'],
      author: 'admin@example.com',
      subject: 'Welcome to {{companyName}}!',
      htmlContent: `
        <html>
          <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333;">Welcome {{userName}}!</h1>
              <p>Thank you for joining {{companyName}}. We're excited to have you on board!</p>
              <p>Here's what you can do next:</p>
              <ul>
                <li>Complete your profile</li>
                <li>Explore our features</li>
                <li>Join our community</li>
              </ul>
              <p>If you have any questions, feel free to <a href="{{supportLink}}">contact our support team</a>.</p>
              <p>Best regards,<br>The {{companyName}} Team</p>
            </div>
          </body>
        </html>
      `,
      textContent: `
        Welcome {{userName}}!

        Thank you for joining {{companyName}}. We're excited to have you on board!

        Here's what you can do next:
        - Complete your profile
        - Explore our features
        - Join our community

        If you have any questions, feel free to contact our support team at {{supportLink}}.

        Best regards,
        The {{companyName}} Team
      `,
      variables: ['userName', 'companyName', 'supportLink'],
      appEntry: 'freezer' as ValidAppEntry,
      from: 'welcome@freezer.com'
    };

    const response = await templateService.createTemplate(newTemplate);
    
    if (response.success && response.data) {
      console.log('Template created successfully:', response.data);
      return response.data;
    } else {
      console.error('Failed to create template:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Error creating template:', error);
    return null;
  }
}

// Example 5: Update an existing template
export async function exampleUpdateTemplate(
  type: ValidTemplateType,
  id: string
) {
  try {
    const updateData = {
      name: 'Updated Welcome Email Template',
      description: 'Updated welcome email template with new content',
      version: '2.1.0',
      tags: ['welcome', 'onboarding', 'user', 'updated'],
      author: 'admin@example.com',
      subject: 'Welcome to {{companyName}} - Get Started!',
      htmlContent: `
        <html>
          <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px;">
              <h1 style="color: #2c3e50;">Welcome {{userName}}!</h1>
              <p style="font-size: 16px; line-height: 1.6;">We're thrilled to welcome you to {{companyName}}!</p>
              <div style="background: #ecf0f1; padding: 20px; border-radius: 6px; margin: 20px 0;">
                <h3>Quick Start Guide:</h3>
                <ol>
                  <li>Complete your profile setup</li>
                  <li>Explore our dashboard</li>
                  <li>Connect with our community</li>
                </ol>
              </div>
              <p>Need help? Our support team is ready to assist you at <a href="{{supportLink}}" style="color: #3498db;">{{supportLink}}</a></p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
              <p style="color: #7f8c8d; font-size: 14px;">Best regards,<br>The {{companyName}} Team</p>
            </div>
          </body>
        </html>
      `,
      textContent: `
        Welcome {{userName}}!

        We're thrilled to welcome you to {{companyName}}!

        Quick Start Guide:
        1. Complete your profile setup
        2. Explore our dashboard
        3. Connect with our community

        Need help? Our support team is ready to assist you at {{supportLink}}

        Best regards,
        The {{companyName}} Team
      `,
      variables: ['userName', 'companyName', 'supportLink'],
      appEntry: 'freezer' as ValidAppEntry,
      from: 'welcome@freezer.com'
    };

    const response = await templateService.updateTemplate(type, id, updateData);
    
    if (response.success && response.data) {
      console.log('Template updated successfully:', response.data);
      return response.data;
    } else {
      console.error('Failed to update template:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Error updating template:', error);
    return null;
  }
}

// Example 6: Preview a template with sample data
export async function examplePreviewTemplate(
  type: ValidTemplateType,
  id: string,
  appEntry: ValidAppEntry
) {
  try {
    const sampleData = {
      data: {
        userName: 'John Doe',
        companyName: 'Freezer App',
        supportLink: 'https://freezer.com/support'
      }
    };

    const response = await templateService.previewTemplate(type, id, appEntry, sampleData);
    
    if (response.success && response.data) {
      console.log('Template preview:', response.data);
      return response.data;
    } else {
      console.error('Failed to preview template:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Error previewing template:', error);
    return null;
  }
}

// Example 7: Delete a template
export async function exampleDeleteTemplate(
  type: ValidTemplateType,
  id: string,
  appEntry: ValidAppEntry
) {
  try {
    const response = await templateService.deleteTemplate(type, id, appEntry);
    
    if (response.success && response.data) {
      console.log('Template deleted successfully:', response.data);
      return true;
    } else {
      console.error('Failed to delete template:', response.error);
      return false;
    }
  } catch (error) {
    console.error('Error deleting template:', error);
    return false;
  }
}

// Example 8: Complete workflow - Create, Preview, Update, and Delete
export async function exampleCompleteWorkflow() {
  console.log('Starting complete template workflow...');

  // 1. Create a new template
  console.log('\n1. Creating template...');
  const createdTemplate = await exampleCreateTemplate();
  if (!createdTemplate) {
    console.log('Failed to create template, stopping workflow');
    return;
  }

  const templateId = createdTemplate.templateId;
  const templateType: ValidTemplateType = createdTemplate.type as ValidTemplateType;
  const appEntry: ValidAppEntry = 'freezer';

  // 2. Get the created template
  console.log('\n2. Fetching created template...');
  const fetchedTemplate = await exampleGetTemplate(templateType, templateId, appEntry);
  if (!fetchedTemplate) {
    console.log('Failed to fetch template');
    return;
  }

  // 3. Preview the template
  console.log('\n3. Previewing template...');
  const preview = await examplePreviewTemplate(templateType, templateId, appEntry);
  if (!preview) {
    console.log('Failed to preview template');
    return;
  }

  // 4. Update the template
  console.log('\n4. Updating template...');
  const updatedTemplate = await exampleUpdateTemplate(templateType, templateId);
  if (!updatedTemplate) {
    console.log('Failed to update template');
    return;
  }

  // 5. List all templates to see our changes
  console.log('\n5. Listing all templates...');
  await exampleListAllTemplates();

  // 6. Delete the template (optional - uncomment if you want to clean up)
  // console.log('\n6. Deleting template...');
  // await exampleDeleteTemplate(templateType, templateId, appEntry);

  console.log('\nWorkflow completed successfully!');
}

// Helper functions for UI components
export function getTemplateTypeOptions() {
  return templateService.getTemplateTypeOptions();
}

export function getAppEntryOptions() {
  return templateService.getAppEntryOptions();
}

export function validateTemplateType(type: string): type is ValidTemplateType {
  return templateService.isValidTemplateType(type);
}

export function validateAppEntry(appEntry: string): appEntry is ValidAppEntry {
  return templateService.isValidAppEntry(appEntry);
}

// Export the examples for use in components
export const templateExamples = {
  listAllTemplates: exampleListAllTemplates,
  listTemplatesByType: exampleListTemplatesByType,
  getTemplate: exampleGetTemplate,
  createTemplate: exampleCreateTemplate,
  updateTemplate: exampleUpdateTemplate,
  previewTemplate: examplePreviewTemplate,
  deleteTemplate: exampleDeleteTemplate,
  completeWorkflow: exampleCompleteWorkflow
};