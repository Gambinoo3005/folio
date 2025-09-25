'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OptimizedEditorLayout } from './optimized-editor-layout';
import { useAutosave } from '@/hooks/use-autosave';
import { useEditorCache } from '@/hooks/use-editor-cache';
import { cmsToasts } from '@/lib/toast';

// Import server actions
import { 
  createItem, 
  updateItem, 
  deleteItem, 
  publishItem, 
  unpublishItem 
} from '@/server/actions/items';
import { 
  createPage, 
  updatePage, 
  deletePage, 
  publishPage, 
  unpublishPage 
} from '@/server/actions/pages';
import { 
  upsertGlobal, 
  deleteGlobal 
} from '@/server/actions/globals';

interface UnifiedEditorProps {
  contentType: 'page' | 'item' | 'global';
  mode: 'create' | 'edit';
  initialData: any;
  collectionId?: string;
  globalKey?: string;
}

export function UnifiedEditor({ 
  contentType, 
  mode, 
  initialData, 
  collectionId,
  globalKey 
}: UnifiedEditorProps) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  
  // Generate cache key based on content type and ID
  const cacheKey = `${contentType}-${data.id || 'new'}-${collectionId || globalKey || ''}`;
  const { data: cachedData, setData: setCachedData, clearCache } = useEditorCache({
    key: cacheKey,
    version: '1.0.0'
  });

  // Initialize data from cache if available
  useEffect(() => {
    if (cachedData && mode === 'edit') {
      setData(cachedData);
    }
  }, [cachedData, mode]);

  // Autosave functionality
  const { isSaving, lastSaved, hasUnsavedChanges, save: autosave } = useAutosave(data, {
    delay: 5000,
    onSave: async (dataToSave) => {
      try {
        if (mode === 'create') {
          // For new items, we'll save to cache only
          setCachedData(dataToSave);
          return;
        }
        
        // For existing items, save to server
        await saveToServer(dataToSave);
        setCachedData(dataToSave);
      } catch (error) {
        console.error('Autosave failed:', error);
        throw error;
      }
    },
    onError: (error) => {
      cmsToasts.error('Autosave failed', error.message);
    },
    onSuccess: () => {
      // Success is handled silently for autosave
    }
  });

  const saveToServer = async (dataToSave: any) => {
    switch (contentType) {
      case 'page':
        if (mode === 'create') {
          const result = await createPage(dataToSave);
          if (result.ok && result.data) {
            setData(prev => ({ ...prev, id: result.data!.id }));
            clearCache();
            router.push(`/pages/${result.data.id}/edit`);
          }
          return result;
        } else {
          return await updatePage(dataToSave);
        }
      
      case 'item':
        if (mode === 'create') {
          const result = await createItem({ ...dataToSave, collectionId });
          if (result.ok && result.data) {
            setData(prev => ({ ...prev, id: result.data!.id }));
            clearCache();
            router.push(`/collections/${collectionId}/items/${result.data.id}/edit`);
          }
          return result;
        } else {
          return await updateItem(dataToSave);
        }
      
      case 'global':
        return await upsertGlobal({ ...dataToSave, key: globalKey });
      
      default:
        throw new Error(`Unsupported content type: ${contentType}`);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const result = await saveToServer(data);
      if (result.ok) {
        cmsToasts.success('Saved successfully');
        if (mode === 'create' && result.data) {
          // Redirect to edit mode after creation
          const editPath = contentType === 'page' 
            ? `/pages/${result.data.id}/edit`
            : contentType === 'item'
            ? `/collections/${collectionId}/items/${result.data.id}/edit`
            : `/globals/${globalKey}/edit`;
          router.push(editPath);
        }
      } else {
        cmsToasts.error('Save failed', result.error);
      }
    } catch (error) {
      cmsToasts.error('Save failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    if (mode === 'create') {
      cmsToasts.error('Cannot publish', 'Please save the content first');
      return;
    }

    setIsLoading(true);
    try {
      let result;
      switch (contentType) {
        case 'page':
          result = await publishPage(data.id);
          break;
        case 'item':
          result = await publishItem(data.id);
          break;
        default:
          throw new Error(`Publishing not supported for ${contentType}`);
      }

      if (result.ok) {
        setData(prev => ({ ...prev, status: 'PUBLISHED' }));
        cmsToasts.success('Published successfully');
      } else {
        cmsToasts.error('Publish failed', result.error);
      }
    } catch (error) {
      cmsToasts.error('Publish failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnpublish = async () => {
    setIsLoading(true);
    try {
      let result;
      switch (contentType) {
        case 'page':
          result = await unpublishPage(data.id);
          break;
        case 'item':
          result = await unpublishItem(data.id);
          break;
        default:
          throw new Error(`Unpublishing not supported for ${contentType}`);
      }

      if (result.ok) {
        setData(prev => ({ ...prev, status: 'DRAFT' }));
        cmsToasts.success('Unpublished successfully');
      } else {
        cmsToasts.error('Unpublish failed', result.error);
      }
    } catch (error) {
      cmsToasts.error('Unpublish failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (mode === 'create') {
      clearCache();
      router.back();
      return;
    }

    if (!confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      let result;
      switch (contentType) {
        case 'page':
          result = await deletePage(data.id);
          break;
        case 'item':
          result = await deleteItem(data.id);
          break;
        case 'global':
          result = await deleteGlobal(globalKey!);
          break;
        default:
          throw new Error(`Deletion not supported for ${contentType}`);
      }

      if (result.ok) {
        cmsToasts.success('Deleted successfully');
        const backPath = contentType === 'page' 
          ? '/pages'
          : contentType === 'item'
          ? `/collections/${collectionId}`
          : '/globals';
        router.push(backPath);
      } else {
        cmsToasts.error('Delete failed', result.error);
      }
    } catch (error) {
      cmsToasts.error('Delete failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDuplicate = async () => {
    if (mode === 'create') {
      cmsToasts.error('Cannot duplicate', 'Please save the content first');
      return;
    }

    setIsLoading(true);
    try {
      const duplicateData = {
        ...data,
        id: undefined,
        title: `${data.title} (Copy)`,
        slug: `${data.slug}-copy`,
        status: 'DRAFT' as const
      };

      const result = await saveToServer(duplicateData);
      if (result.ok && result.data) {
        cmsToasts.success('Duplicated successfully');
        const editPath = contentType === 'page' 
          ? `/pages/${result.data.id}/edit`
          : contentType === 'item'
          ? `/collections/${collectionId}/items/${result.data.id}/edit`
          : `/globals/${globalKey}/edit`;
        router.push(editPath);
      } else {
        cmsToasts.error('Duplicate failed', result.error);
      }
    } catch (error) {
      cmsToasts.error('Duplicate failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    if (mode === 'create') {
      cmsToasts.error('Cannot preview', 'Please save the content first');
      return;
    }

    const previewPath = contentType === 'page' 
      ? `/preview/page/${data.id}`
      : contentType === 'item'
      ? `/preview/item/${data.id}`
      : `/preview/global/${globalKey}`;
    
    window.open(previewPath, '_blank');
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      if (!confirm('You have unsaved changes. Are you sure you want to leave?')) {
        return;
      }
    }
    router.back();
  };

  const getStatus = (): 'draft' | 'published' | 'scheduled' => {
    if (data.status === 'PUBLISHED') return 'published';
    if (data.status === 'SCHEDULED') return 'scheduled';
    return 'draft';
  };

  const getPreviewTarget = (): 'page' | 'item' | 'global' => {
    return contentType;
  };

  const getPreviewId = (): string | undefined => {
    return data.id;
  };

  const getPreviewSlug = (): string | undefined => {
    return data.slug;
  };

  return (
    <OptimizedEditorLayout
      title={data.title || 'Untitled'}
      status={getStatus()}
      onSave={handleSave}
      onPublish={handlePublish}
      onPreview={handlePreview}
      onBack={handleBack}
      onDuplicate={handleDuplicate}
      onUnpublish={handleUnpublish}
      onDelete={handleDelete}
      previewTarget={getPreviewTarget()}
      previewId={getPreviewId()}
      previewSlug={getPreviewSlug()}
      contentType={contentType}
      userRole="editor" // TODO: Get from auth context
    />
  );
}
