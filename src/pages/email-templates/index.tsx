import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { EmailTemplateLayout } from "@/components/layout/EmailTemplateLayout";

export default function EmailTemplatePage() {
  return (
    <ProtectedRoute>
      <EmailTemplateLayout />
    </ProtectedRoute>
  );
}
