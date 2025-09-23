'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Image, MessageSquare, Home } from 'lucide-react';
import Link from 'next/link';

const quickActions = [
  {
    title: 'New Project',
    description: 'Add a new project to your portfolio',
    icon: <Plus className="h-4 w-4" />,
    href: '/projects/new',
    variant: 'default' as const,
  },
  {
    title: 'Edit Home',
    description: 'Update your homepage content',
    icon: <Home className="h-4 w-4" />,
    href: '/pages/home',
    variant: 'outline' as const,
  },
  {
    title: 'Upload Media',
    description: 'Add images and files to your library',
    icon: <Image className="h-4 w-4" />,
    href: '/media',
    variant: 'outline' as const,
  },
  {
    title: 'View Submissions',
    description: 'Check contact form submissions',
    icon: <MessageSquare className="h-4 w-4" />,
    href: '/submissions',
    variant: 'outline' as const,
  },
];

export function QuickActionsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks to get you started</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {quickActions.map((action) => (
            <Button
              key={action.title}
              className="w-full justify-start"
              variant={action.variant}
              asChild
            >
              <Link href={action.href}>
                {action.icon}
                <div className="flex flex-col items-start ml-2">
                  <span className="font-medium">{action.title}</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    {action.description}
                  </span>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
