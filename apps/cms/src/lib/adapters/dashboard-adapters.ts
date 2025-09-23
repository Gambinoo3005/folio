// Dashboard data adapters - Phase 3 placeholders
// TODO: Wire to Prisma when schema is ready

export interface RecentEdit {
  id: string;
  type: 'page' | 'project' | 'post' | 'gallery' | 'global';
  title: string;
  action: 'created' | 'updated' | 'published' | 'scheduled';
  timestamp: Date;
  author: string;
  url?: string;
}

export interface UsageStats {
  storageUsed: {
    gb: number;
    percentage: number;
    limit: number;
  };
  scheduledPosts: {
    thisMonth: number;
    total: number;
  };
  versionsKept: {
    current: number;
    limit: number;
  };
}

export interface PublishingStatus {
  lastPublish: {
    timestamp: Date;
    item: string;
    type: 'page' | 'project' | 'post' | 'gallery';
  } | null;
  pendingScheduled: number;
  draftCount: number;
}

// Fake data adapters - replace with Prisma queries later
export const getRecentEdits = async (): Promise<RecentEdit[]> => {
  // TODO: Replace with Prisma query
  // const recentEdits = await prisma.contentItem.findMany({
  //   orderBy: { updatedAt: 'desc' },
  //   take: 5,
  //   include: { author: true }
  // });
  
  return [
    {
      id: '1',
      type: 'page',
      title: 'About Page',
      action: 'updated',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      author: 'John Doe',
      url: '/about'
    },
    {
      id: '2',
      type: 'project',
      title: 'E-commerce Platform',
      action: 'published',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      author: 'John Doe',
      url: '/projects/ecommerce-platform'
    },
    {
      id: '3',
      type: 'post',
      title: 'Building Better UX',
      action: 'created',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      author: 'John Doe',
      url: '/posts/building-better-ux'
    },
    {
      id: '4',
      type: 'gallery',
      title: 'Portrait Photography',
      action: 'updated',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      author: 'John Doe',
      url: '/galleries/portrait-photography'
    },
    {
      id: '5',
      type: 'global',
      title: 'Navigation Links',
      action: 'updated',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      author: 'John Doe'
    }
  ];
};

export const getUsageStats = async (): Promise<UsageStats> => {
  // TODO: Replace with Prisma queries
  // const mediaFiles = await prisma.mediaFile.findMany();
  // const scheduledPosts = await prisma.contentItem.findMany({
  //   where: { status: 'scheduled' }
  // });
  
  return {
    storageUsed: {
      gb: 2.4,
      percentage: 24,
      limit: 10
    },
    scheduledPosts: {
      thisMonth: 3,
      total: 8
    },
    versionsKept: {
      current: 12,
      limit: 50
    }
  };
};

export const getPublishingStatus = async (): Promise<PublishingStatus> => {
  // TODO: Replace with Prisma queries
  // const lastPublish = await prisma.contentItem.findFirst({
  //   where: { status: 'published' },
  //   orderBy: { publishedAt: 'desc' }
  // });
  // const pendingScheduled = await prisma.contentItem.count({
  //   where: { status: 'scheduled' }
  // });
  // const draftCount = await prisma.contentItem.count({
  //   where: { status: 'draft' }
  // });
  
  return {
    lastPublish: {
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      item: 'About Page',
      type: 'page'
    },
    pendingScheduled: 3,
    draftCount: 7
  };
};
