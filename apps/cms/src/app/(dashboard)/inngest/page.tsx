import { CmsLayout } from '@/components/cms-layout';

// This is a server component to fetch initial data
export default function InngestPage() {
  return (
    <CmsLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Inngest</h1>
        <p className="text-muted-foreground">
          This is a placeholder page for Inngest cron job management.
        </p>
        <iframe
          src={`https://app.inngest.com/env/${process.env.INNGEST_ENV}/jobs`}
          style={{ width: '100%', height: '80vh', border: 'none' }}
        />
      </div>
    </CmsLayout>
  );
}
