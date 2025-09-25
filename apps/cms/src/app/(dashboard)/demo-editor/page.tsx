'use client';

import { OptimizedEditorLayout } from '@/components/editor/optimized-editor-layout';
import { useState } from 'react';

export default function DemoEditorPage() {
  const [title, setTitle] = useState('Demo Page Title');
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>('draft');

  const handleSave = async () => {
    console.log('Saving...');
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Saved!');
  };

  const handlePublish = async () => {
    console.log('Publishing...');
    setStatus('published');
    // Simulate publish delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Published!');
  };

  const handlePreview = () => {
    window.open('/preview/demo', '_blank');
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleDuplicate = () => {
    console.log('Duplicating...');
  };

  const handleUnpublish = () => {
    setStatus('draft');
    console.log('Unpublished');
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this page?')) {
      console.log('Deleting...');
    }
  };

  return (
    <OptimizedEditorLayout
      title={title}
      status={status}
      onSave={handleSave}
      onPublish={handlePublish}
      onPreview={handlePreview}
      onBack={handleBack}
      onDuplicate={handleDuplicate}
      onUnpublish={handleUnpublish}
      onDelete={handleDelete}
      previewTarget="page"
      previewId="demo"
      previewSlug="demo-page"
      contentType="page"
      userRole="editor"
    />
  );
}
