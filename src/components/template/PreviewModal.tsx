import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Tabs,
  Tab,
  Typography,
  Alert,
  Paper,
} from "@mui/material";
import { Close } from "@mui/icons-material";

interface TemplateData {
  templateId: string;
  type: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: Array<{
    name: string;
    type: string;
    description: string;
    required: boolean;
    defaultValue?: string;
  }>;
}

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  template: TemplateData | null;
}

const TabPanel: React.FC<{
  children: React.ReactNode;
  value: number;
  index: number;
}> = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
  </div>
);

// Simple handlebars-like replacement for preview
function replaceVariables(content: string, data: Record<string, any>): string {
  let result = content;
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    result = result.replace(regex, String(value));
  }
  return result;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  open,
  onClose,
  template,
}) => {
  const [previewTab, setPreviewTab] = React.useState(0);

  if (!template) return null;

  // Generate sample data based on variables
  const sampleData: Record<string, any> = {};
  template.variables.forEach((variable) => {
    switch (variable.type) {
      case "string":
        sampleData[variable.name] =
          variable.defaultValue || `Sample ${variable.name}`;
        break;
      case "number":
        sampleData[variable.name] = variable.defaultValue
          ? parseInt(variable.defaultValue, 10)
          : 123;
        break;
      case "boolean":
        sampleData[variable.name] = variable.defaultValue === "true" || true;
        break;
      case "date":
        sampleData[variable.name] =
          variable.defaultValue || new Date().toLocaleDateString();
        break;
      case "url":
        sampleData[variable.name] =
          variable.defaultValue || "https://example.com";
        break;
      default:
        sampleData[variable.name] = variable.defaultValue || "Sample Value";
    }
  });

  // Add common variables if not present
  if (!sampleData.recipientName) sampleData.recipientName = "John Doe";
  if (!sampleData.recipientEmail)
    sampleData.recipientEmail = "john.doe@example.com";
  if (!sampleData.currentYear)
    sampleData.currentYear = new Date().getFullYear();

  const rendered = {
    subject: replaceVariables(template.subject, sampleData),
    html: replaceVariables(template.htmlContent, sampleData),
    text: replaceVariables(template.textContent, sampleData),
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Template Preview</Typography>
        <Button onClick={onClose} startIcon={<Close />}>
          Close
        </Button>
      </DialogTitle>
      <DialogContent>
        <Tabs
          value={previewTab}
          onChange={(_, value) => setPreviewTab(value)}
          sx={{ mb: 2 }}
        >
          <Tab label="Subject" />
          <Tab label="HTML Preview" />
          <Tab label="Text Preview" />
        </Tabs>

        <TabPanel value={previewTab} index={0}>
          <Alert severity="info">
            <Typography variant="subtitle1" component="div">
              <strong>Subject:</strong>
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {rendered.subject}
            </Typography>
          </Alert>
        </TabPanel>

        <TabPanel value={previewTab} index={1}>
          <Paper variant="outlined" sx={{ height: 400, overflow: "auto" }}>
            <Box
              component="iframe"
              srcDoc={rendered.html}
              sx={{
                width: "100%",
                height: "100%",
                border: "none",
              }}
              title="HTML Preview"
            />
          </Paper>
        </TabPanel>

        <TabPanel value={previewTab} index={2}>
          <Paper
            sx={{
              p: 2,
              height: 400,
              overflow: "auto",
              backgroundColor: "grey.50",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
            }}
          >
            {rendered.text}
          </Paper>
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreviewModal;
