'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Type, 
  Image as ImageIcon, 
  List, 
  FileText
} from 'lucide-react';
import { BasicContent } from './content/basic-content';
import { HeroSection } from './content/hero-section';
import { MainContent } from './content/main-content';
import { TagsCategories } from './content/tags-categories';

interface ContentSubcategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  description: string;
}

interface ContentTabProps {
  activeSubcategory: string;
}

export function ContentTab({ activeSubcategory }: ContentTabProps) {

  const subcategories: ContentSubcategory[] = [
    {
      id: 'basic',
      label: 'Basic Content',
      icon: <Type className="h-4 w-4" />,
      component: <BasicContent />,
      description: 'Title, subtitle, and excerpt'
    },
    {
      id: 'hero',
      label: 'Hero Section',
      icon: <ImageIcon className="h-4 w-4" />,
      component: <HeroSection />,
      description: 'Hero image and captions'
    },
    {
      id: 'main',
      label: 'Main Content',
      icon: <FileText className="h-4 w-4" />,
      component: <MainContent />,
      description: 'Rich text editor and content'
    },
    {
      id: 'tags',
      label: 'Tags & Categories',
      icon: <List className="h-4 w-4" />,
      component: <TagsCategories />,
      description: 'Tags, categories, and organization'
    }
  ];

  const activeSubcategoryData = subcategories.find(sub => sub.id === activeSubcategory);

  return (
    <div className="space-y-6">
      {/* Active Subcategory Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubcategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeSubcategoryData?.component}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}