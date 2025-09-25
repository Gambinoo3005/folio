'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@portfolio-building-service/ui';
import { Badge } from '@portfolio-building-service/ui';
import { Progress } from '@portfolio-building-service/ui';
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Eye,
  Sparkles
} from 'lucide-react';

interface ChecklistButtonProps {
  completedItems: number;
  totalItems: number;
  hasErrors: boolean;
  hasWarnings: boolean;
  onClick: () => void;
}

export function ChecklistButton({ 
  completedItems, 
  totalItems, 
  hasErrors, 
  hasWarnings, 
  onClick 
}: ChecklistButtonProps) {
  const completionPercentage = (completedItems / totalItems) * 100;
  
  const getStatusColor = () => {
    if (hasErrors) return 'text-red-500';
    if (hasWarnings) return 'text-amber-500';
    if (completionPercentage === 100) return 'text-green-500';
    return 'text-brand-muted';
  };

  const getStatusIcon = () => {
    if (hasErrors) return <XCircle className="h-4 w-4 text-red-500" />;
    if (hasWarnings) return <AlertCircle className="h-4 w-4 text-amber-500" />;
    if (completionPercentage === 100) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <Eye className="h-4 w-4 text-brand-muted" />;
  };

  const getButtonVariant = () => {
    if (hasErrors) return 'destructive';
    if (hasWarnings) return 'secondary';
    if (completionPercentage === 100) return 'default';
    return 'outline';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          onClick={onClick}
          variant={getButtonVariant()}
          size="lg"
          className="relative shadow-lg hover:shadow-xl transition-all duration-200 min-w-[200px] h-auto p-4"
        >
          <div className="flex items-center gap-3 w-full">
            {getStatusIcon()}
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Publish Checklist</span>
                <Badge 
                  variant={hasErrors ? "destructive" : hasWarnings ? "secondary" : "default"}
                  className="text-xs"
                >
                  {completedItems}/{totalItems}
                </Badge>
              </div>
              <Progress 
                value={completionPercentage} 
                className="h-1.5 bg-background/20" 
              />
              <p className="text-xs mt-1 opacity-90">
                {completionPercentage === 100 
                  ? 'Ready to publish!' 
                  : `${totalItems - completedItems} items need attention`
                }
              </p>
            </div>
            <Sparkles className="h-4 w-4 opacity-60" />
          </div>
        </Button>
      </motion.div>
    </motion.div>
  );
}
