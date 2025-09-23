# Email Template Service Usage Guide

This guide explains how to use the Email Template Service to interact with the Email Template API documented in `EMAIL_TEMPLATE_API_DOCUMENTATION.md`.

## Overview

The Template Service provides a clean TypeScript interface for managing email templates stored in AWS S3. It includes:

- **Template Service** (`src/services/templateService.ts`) - Core API client
- **React Hook** (`src/hooks/useTemplateService.ts`) - React integration  
- **Examples** (`src/services/templateExamples.ts`) - Usage examples
- **Demo Component** (`src/components/demo/TemplateServiceDemo.tsx`) - Interactive demo

## Quick Start

### 1. Basic Usage

```typescript
import { templateService } from '@/services/templateService';

// List all templates
const response = await templateService.listTemplates();
if (response.success) {
  console.log('Templates:', response.data);
}

// Get a specific template
const template = await templateService.getTemplate('VERIFICATION', 'my-template-id', 'freezer');
if (template.success) {
  console.log('Template details:', template.data);
}
```

### 2. React Hook Usage

```typescript
import { useTemplateService } from '@/hooks/useTemplateService';

function MyComponent() {
  const { 
    templates, 
    loading, 
    error, 
    listTemplates, 
    createTemplate 
  } = useTemplateService();

  useEffect(() => {
    listTemplates();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {templates.map(template => (
        <div key={template.id}>{template.name}</div>
      ))}
    </div>
  );
}
```

## API Methods

### Template Operations

#### List Templates
```typescript
// List all templates
await templateService.listTemplates();

// Filter by type
await templateService.listTemplates('VERIFICATION');
```

#### Get Template
```typescript
await templateService.getTemplate(
  'VERIFICATION',      // Template type
  'my-template-id',    // Template ID
  'freezer'           // App entry
);
```

#### Create Template
```typescript
const newTemplate = {
  templateId: 'welcome-v1',
  type: 'WELCOME',
  name: 'Welcome Email',
  subject: 'Welcome {{userName}}!',
  htmlContent: '<h1>Welcome {{userName}}</h1>',
  textContent: 'Welcome {{userName}}',
  appEntry: 'freezer',
  from: 'welcome@example.com',
  variables: ['userName']
};

await templateService.createTemplate(newTemplate);
```

#### Update Template
```typescript
const updateData = {
  name: 'Updated Welcome Email',
  subject: 'Welcome to {{companyName}}!',
  htmlContent: '<h1>Welcome to {{companyName}}</h1>',
  textContent: 'Welcome to {{companyName}}',
  appEntry: 'freezer',
  from: 'welcome@example.com',
  variables: ['companyName']
};

await templateService.updateTemplate('WELCOME', 'welcome-v1', updateData);
```

#### Preview Template
```typescript
const previewData = {
  data: {
    userName: 'John Doe',
    companyName: 'Example Corp'
  }
};

await templateService.previewTemplate(
  'WELCOME', 
  'welcome-v1', 
  'freezer', 
  previewData
);
```

#### Delete Template
```typescript
await templateService.deleteTemplate('WELCOME', 'welcome-v1', 'freezer');
```

## Type Definitions

### Valid Template Types
- `VERIFICATION` - Email verification templates
- `WELCOME` - Welcome email templates
- `PASSWORD_RESET` - Password reset templates
- `NOTIFICATION` - General notification templates
- `NEWSLETTER` - Newsletter templates
- `INVOICE` - Invoice/billing templates
- `REMINDER` - Reminder templates

### Valid App Entries
- `freezer` - Freezer application
- `tennis` - Tennis application
- `qaBot` - QA Bot application

### Template Data Structure

```typescript
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
```

## React Hook API

The `useTemplateService` hook provides:

### State
- `templates: TemplateListItem[]` - List of templates
- `currentTemplate: TemplateDetail | null` - Currently selected template
- `loading: boolean` - Loading state
- `error: string | null` - Error message

### Actions
- `listTemplates(type?)` - Load templates list
- `getTemplate(type, id, appEntry)` - Load specific template
- `createTemplate(data)` - Create new template
- `updateTemplate(type, id, data)` - Update existing template
- `deleteTemplate(type, id, appEntry)` - Delete template
- `previewTemplate(type, id, appEntry, data)` - Preview template

### Utilities
- `clearError()` - Clear error state
- `clearCurrentTemplate()` - Clear current template
- `getTemplateTypeOptions()` - Get type options for dropdowns
- `getAppEntryOptions()` - Get app entry options for dropdowns

## Error Handling

All API methods return responses in the format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

Always check the `success` property before using `data`:

```typescript
const response = await templateService.listTemplates();

if (response.success && response.data) {
  // Use response.data safely
  console.log('Templates:', response.data.data);
} else {
  // Handle error
  console.error('Error:', response.error);
}
```

## Examples

### Complete Workflow Example

```typescript
import { templateService } from '@/services/templateService';

async function completeWorkflow() {
  // 1. Create template
  const newTemplate = {
    templateId: 'test-template',
    type: 'VERIFICATION',
    name: 'Test Template',
    subject: 'Please verify {{userName}}',
    htmlContent: '<p>Hello {{userName}}, please verify your email.</p>',
    textContent: 'Hello {{userName}}, please verify your email.',
    appEntry: 'freezer',
    from: 'noreply@example.com',
    variables: ['userName']
  };
  
  const createResult = await templateService.createTemplate(newTemplate);
  if (!createResult.success) {
    console.error('Failed to create:', createResult.error);
    return;
  }

  // 2. Preview template
  const previewResult = await templateService.previewTemplate(
    'VERIFICATION',
    'test-template',
    'freezer',
    { data: { userName: 'John Doe' } }
  );
  
  if (previewResult.success) {
    console.log('Preview:', previewResult.data);
  }

  // 3. Update template
  const updateResult = await templateService.updateTemplate(
    'VERIFICATION',
    'test-template',
    {
      ...newTemplate,
      name: 'Updated Test Template',
      version: '1.1.0'
    }
  );

  // 4. List templates to verify changes
  const listResult = await templateService.listTemplates();
  console.log('All templates:', listResult.data);

  // 5. Delete template (cleanup)
  await templateService.deleteTemplate('VERIFICATION', 'test-template', 'freezer');
}
```

### React Component Example

```typescript
import React, { useState, useEffect } from 'react';
import { useTemplateService } from '@/hooks/useTemplateService';

function TemplateManager() {
  const {
    templates,
    loading,
    error,
    listTemplates,
    createTemplate,
    deleteTemplate,
    getTemplateTypeOptions,
    getAppEntryOptions
  } = useTemplateService();

  const [formData, setFormData] = useState({
    templateId: '',
    type: 'VERIFICATION',
    name: '',
    subject: '',
    htmlContent: '',
    textContent: '',
    appEntry: 'freezer',
    from: ''
  });

  useEffect(() => {
    listTemplates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await createTemplate(formData);
    if (success) {
      // Reset form
      setFormData({
        templateId: '',
        type: 'VERIFICATION',
        name: '',
        subject: '',
        htmlContent: '',
        textContent: '',
        appEntry: 'freezer',
        from: ''
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Template Manager</h2>
      
      {/* Create Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Template ID"
          value={formData.templateId}
          onChange={(e) => setFormData({...formData, templateId: e.target.value})}
          required
        />
        
        <select
          value={formData.type}
          onChange={(e) => setFormData({...formData, type: e.target.value})}
        >
          {getTemplateTypeOptions().map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Other form fields... */}
        
        <button type="submit">Create Template</button>
      </form>

      {/* Templates List */}
      <div>
        <h3>Templates ({templates.length})</h3>
        {templates.map(template => (
          <div key={template.id}>
            <h4>{template.name}</h4>
            <p>Type: {template.type}</p>
            <p>App: {template.appEntry}</p>
            <button 
              onClick={() => deleteTemplate(template.type, template.id, template.appEntry)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Demo Component

To see the template service in action, you can use the demo component:

```typescript
import TemplateServiceDemo from '@/components/demo/TemplateServiceDemo';

function App() {
  return <TemplateServiceDemo />;
}
```

The demo component provides a complete interface for testing all template operations with real API calls.

## Authentication

All API calls require admin authentication. The service automatically includes the JWT token from localStorage/cookies in the Authorization header. Make sure you're logged in as an admin user before using the template service.

## Tips

1. **Template Variables**: Use `{{variableName}}` syntax in your HTML and text content
2. **Validation**: Use the validation functions before creating/updating templates
3. **Error Handling**: Always check the `success` property in API responses
4. **Type Safety**: Use the provided TypeScript types for better development experience
5. **React Integration**: Use the custom hook for seamless React integration

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Make sure you're logged in with admin privileges
2. **Template not found**: Verify the template type, ID, and app entry combination
3. **Validation errors**: Check required fields and data formats
4. **Network errors**: Verify API endpoint and network connectivity

### Debug Mode

Enable debug logging by checking browser console for detailed API request/response information.