'use client';

import { useState } from 'react';
import { Button } from '@portfolio-building-service/ui';
import { Badge } from '@portfolio-building-service/ui';
import { 
  Smartphone,
  Tablet,
  Monitor,
  RotateCcw,
  RefreshCw,
  ExternalLink,
  Eye,
  EyeOff
} from 'lucide-react';
import { Separator } from '@portfolio-building-service/ui';

interface PreviewPanelProps {
  // Add props as needed
}

type DevicePreset = 'mobile' | 'tablet' | 'desktop';

interface DeviceConfig {
  name: string;
  width: number;
  height: number;
  icon: React.ReactNode;
}

const devicePresets: Record<DevicePreset, DeviceConfig> = {
  mobile: {
    name: 'Mobile',
    width: 375,
    height: 667,
    icon: <Smartphone className="h-4 w-4" />
  },
  tablet: {
    name: 'Tablet',
    width: 768,
    height: 1024,
    icon: <Tablet className="h-4 w-4" />
  },
  desktop: {
    name: 'Desktop',
    width: 1200,
    height: 800,
    icon: <Monitor className="h-4 w-4" />
  }
};

export function PreviewPanel({}: PreviewPanelProps) {
  const [selectedDevice, setSelectedDevice] = useState<DevicePreset>('desktop');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const currentDevice = devicePresets[selectedDevice];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Preview</h3>
          {isPreviewMode && (
            <Badge variant="secondary" className="text-xs">
              <Eye className="h-3 w-3 mr-1" />
              Draft
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePreviewMode}
            className={isPreviewMode ? 'bg-accent' : ''}
          >
            {isPreviewMode ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Hide Draft
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Show Draft
              </>
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          
          <Button variant="ghost" size="sm">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Device Presets */}
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <span className="text-sm font-medium">View as:</span>
        <div className="flex gap-1">
          {Object.entries(devicePresets).map(([key, device]) => (
            <Button
              key={key}
              variant={selectedDevice === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDevice(key as DevicePreset)}
              className="flex items-center gap-2"
            >
              {device.icon}
              <span className="hidden sm:inline">{device.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto bg-gray-50 p-4">
        <div className="flex justify-center">
          <div
            className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300"
            style={{
              width: Math.min(currentDevice.width, 800),
              height: Math.min(currentDevice.height, 600),
              maxWidth: '100%',
              maxHeight: '100%'
            }}
          >
            {/* Preview Content */}
            <div className="h-full overflow-auto">
              {isPreviewMode ? (
                <div className="relative h-full">
                  {/* Draft Watermark */}
                  <div className="absolute inset-0 bg-yellow-50 opacity-50 z-10 pointer-events-none" />
                  <div className="absolute top-4 right-4 z-20">
                    <Badge variant="destructive" className="text-xs">
                      DRAFT
                    </Badge>
                  </div>
                  
                  {/* Mock Content */}
                  <div className="p-6 space-y-4">
                    <h1 className="text-2xl font-bold">Your Page Title</h1>
                    <p className="text-gray-600">
                      This is a preview of your content. Changes made in the editor will appear here.
                    </p>
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold">Section Heading</h2>
                      <p className="text-gray-600">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      </p>
                    </div>
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                      <p className="font-semibold text-blue-800 mb-2">Callout</p>
                      <p className="text-blue-700">This is a callout block that will appear in your content.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  <h1 className="text-2xl font-bold">Your Page Title</h1>
                  <p className="text-gray-600">
                    This is a preview of your published content. Toggle draft mode to see unpublished changes.
                  </p>
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Section Heading</h2>
                    <p className="text-gray-600">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                  </div>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <p className="font-semibold text-blue-800 mb-2">Callout</p>
                    <p className="text-blue-700">This is a callout block that will appear in your content.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Footer */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>{currentDevice.width} × {currentDevice.height}</span>
            <span>•</span>
            <span>{isPreviewMode ? 'Draft content' : 'Published content'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset View
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
