'use client';

import { EditorLayout } from '@/components/editor/editor-layout';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface NewItemPageProps {
  params: Promise<{
    collection: string;
  }>;
}

export default function NewItemPage({ params }: NewItemPageProps) {
  const [collection, setCollection] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    params.then(({ collection }) => {
      setCollection(collection);
    });
  }, [params]);

  const handleSave = async () => {
    // TODO: Implement save functionality
    console.log('Saving content...');
  };

  const handlePublish = async () => {
    // TODO: Implement publish functionality
    console.log('Publishing content...');
  };

  const handlePreview = () => {
    // TODO: Implement preview functionality
    console.log('Opening preview...');
  };

  const handleBack = () => {
    router.back();
  };

  const getCollectionTitle = (collection: string) => {
    switch (collection) {
      case 'projects':
        return 'New Project';
      case 'posts':
        return 'New Post';
      case 'galleries':
        return 'New Gallery';
      case 'testimonials':
        return 'New Testimonial';
      default:
        return 'New Item';
    }
  };

  return (
    <EditorLayout
      title={getCollectionTitle(collection)}
      status="draft"
      onSave={handleSave}
      onPublish={handlePublish}
      onPreview={handlePreview}
      onBack={handleBack}
    />
  );
}
