'use client';

import { useState } from 'react';
import { CmsLayout } from '@/components/cms-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangePicker } from '@/components/ui/date-range-picker'; // Assuming this component exists

export function AnalyticsClient({ tenantId }: { tenantId: string }) {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });

  // Data fetching logic will go here
  // For now, we'll just show placeholders

  return (
    <CmsLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">
              An overview of your site's performance, errors, and logs.
            </p>
          </div>
          <DateRangePicker
            date={dateRange}
            onDateChange={setDateRange}
            className="hidden md:block"
          />
        </div>

        <Tabs defaultValue="traffic">
          <TabsList>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="referrers">Referrers & Geo</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="traffic" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Traffic</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Traffic data from Plausible will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="content" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Top pages from Plausible will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="referrers" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Referrers & Geo</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Top referrers and countries from Plausible will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="errors" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Errors</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Error data from Sentry will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="logs" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Log summary from Axiom will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </CmsLayout>
  );
}
