import { AdminSectionCard } from "@/components/admin/admin-section-card";
import type { SyncMatrixRow } from "@/lib/admin/nexus-dashboard";
import { PublishingList } from "./publishing-list";

type PublishingWorkspaceProps = {
  rows: SyncMatrixRow[];
  selectedSlug: string | null;
  googleConnected: boolean;
  notice?: {
    tone: "success" | "warning" | "error";
    title: string;
    body: string;
  } | null;
  saveAction: (formData: FormData) => void | Promise<void>;
  publishAction: (formData: FormData) => void | Promise<void>;
  clearAction: (formData: FormData) => void | Promise<void>;
};

export function PublishingWorkspace({
  rows,
  selectedSlug,
  googleConnected,
  notice,
  saveAction,
  publishAction,
  clearAction,
}: PublishingWorkspaceProps) {
  return (
    <AdminSectionCard
      title="Publishing approval"
      eyebrow="Publishing"
      description="Open the article in full, then approve or publish directly from the queue without leaving the workspace."
      compactHeader
      className="flex h-full min-h-0 flex-col"
      contentClassName="flex-1 min-h-0"
    >
      <div className="flex h-full min-h-0 flex-col">
        <PublishingList
          rows={rows}
          selectedSlug={selectedSlug}
          googleConnected={googleConnected}
          notice={notice}
          saveAction={saveAction}
          publishAction={publishAction}
          clearAction={clearAction}
        />
      </div>
    </AdminSectionCard>
  );
}
