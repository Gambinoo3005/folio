'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveAnalyticsConfig } from '@/server/actions/analytics';
import { TenantAnalyticsConfig } from '@prisma/client';
import { BarChart3 } from 'lucide-react';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';

interface AnalyticsSettingsFormProps {
  config: TenantAnalyticsConfig | null;
}

const initialState = {
  error: {},
};

export function AnalyticsSettingsForm({ config }: AnalyticsSettingsFormProps) {
  const [state, formAction] = useFormState(saveAnalyticsConfig, initialState);

  if (state.data) {
    toast.success('Analytics settings saved.');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Analytics
        </CardTitle>
        <CardDescription>
          Connect your analytics providers to see data in your dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plausibleSite">Plausible Site Domain</Label>
            <Input
              id="plausibleSite"
              name="plausibleSite"
              defaultValue={config?.plausibleSite ?? ''}
              placeholder="yourdomain.com"
            />
            {state?.error?.plausibleSite && (
              <p className="text-sm text-red-500">{state.error.plausibleSite}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="sentryProjectSlug">Sentry Project Slug (Optional)</Label>
            <Input
              id="sentryProjectSlug"
              name="sentryProjectSlug"
              defaultValue={config?.sentryProjectSlug ?? ''}
              placeholder="your-sentry-project"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="axiomDataset">Axiom Dataset (Optional)</Label>
            <Input
              id="axiomDataset"
              name="axiomDataset"
              defaultValue={config?.axiomDataset ?? ''}
              placeholder="your-axiom-dataset"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Save</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
