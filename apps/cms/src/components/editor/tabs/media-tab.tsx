'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@portfolio-building-service/ui';
import { Button } from '@portfolio-building-service/ui';
import { Input } from '@portfolio-building-service/ui';
import { Label } from '@portfolio-building-service/ui';
import { Textarea } from '@portfolio-building-service/ui';
import { Badge } from '@portfolio-building-service/ui';
import { 
  Image as ImageIcon, 
  Upload, 
  Eye,
  Plus,
  X,
  ExternalLink,
  Twitter,
  Facebook,
  Globe
} from 'lucide-react';
import { Separator } from '@portfolio-building-service/ui';
import { Alert, AlertDescription } from '@portfolio-building-service/ui';

interface MediaTabProps {
  // Add props as needed
}

interface MediaItem {
  id: string;
  url: string;
  alt: string;
  focalX?: number;
  focalY?: number;
  width?: number;
  height?: number;
}

export function MediaTab({}: MediaTabProps) {
  const [coverImage, setCoverImage] = useState<MediaItem | null>(null);
  const [ogImage, setOgImage] = useState<MediaItem | null>(null);
  const [gallery, setGallery] = useState<MediaItem[]>([]);
  const [showFocalPointEditor, setShowFocalPointEditor] = useState(false);
  const [editingImage, setEditingImage] = useState<MediaItem | null>(null);

  const handleImageUpload = (type: 'cover' | 'og' | 'gallery') => {
    // In a real implementation, this would open a file picker and upload to your media service
    const mockImage: MediaItem = {
      id: Math.random().toString(36).substr(2, 9),
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      alt: '',
      width: 800,
      height: 600,
      focalX: 0.5,
      focalY: 0.5
    };

    switch (type) {
      case 'cover':
        setCoverImage(mockImage);
        break;
      case 'og':
        setOgImage(mockImage);
        break;
      case 'gallery':
        setGallery([...gallery, mockImage]);
        break;
    }
  };

  const updateImageAlt = (id: string, alt: string, type: 'cover' | 'og' | 'gallery') => {
    const updateItem = (item: MediaItem) => 
      item.id === id ? { ...item, alt } : item;

    switch (type) {
      case 'cover':
        setCoverImage(prev => prev ? updateItem(prev) : null);
        break;
      case 'og':
        setOgImage(prev => prev ? updateItem(prev) : null);
        break;
      case 'gallery':
        setGallery(prev => prev.map(updateItem));
        break;
    }
  };

  const removeImage = (id: string, type: 'cover' | 'og' | 'gallery') => {
    switch (type) {
      case 'cover':
        setCoverImage(null);
        break;
      case 'og':
        setOgImage(null);
        break;
      case 'gallery':
        setGallery(prev => prev.filter(img => img.id !== id));
        break;
    }
  };

  const openFocalPointEditor = (image: MediaItem) => {
    setEditingImage(image);
    setShowFocalPointEditor(true);
  };

  const updateFocalPoint = (focalX: number, focalY: number) => {
    if (!editingImage) return;

    const updateItem = (item: MediaItem) => 
      item.id === editingImage.id ? { ...item, focalX, focalY } : item;

    if (coverImage?.id === editingImage.id) {
      setCoverImage(updateItem(coverImage));
    } else if (ogImage?.id === editingImage.id) {
      setOgImage(updateItem(ogImage));
    } else {
      setGallery(prev => prev.map(updateItem));
    }

    setShowFocalPointEditor(false);
    setEditingImage(null);
  };

  const generateOGPreview = () => {
    if (!ogImage) return null;

    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white max-w-sm">
        <div className="aspect-video bg-gray-100 relative">
          {ogImage.url && (
            <img
              src={ogImage.url}
              alt={ogImage.alt}
              className="w-full h-full object-cover"
              style={{
                objectPosition: ogImage.focalX && ogImage.focalY 
                  ? `${ogImage.focalX * 100}% ${ogImage.focalY * 100}%`
                  : 'center'
              }}
            />
          )}
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">
            Your Page Title Here
          </h3>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
            Your page description will appear here...
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Globe className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-500">yoursite.com</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            Cover Image
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {coverImage ? (
            <div className="space-y-4">
              <div className="relative group">
                <img
                  src={coverImage.url}
                  alt={coverImage.alt}
                  className="w-full h-48 object-cover rounded-lg border"
                  style={{
                    objectPosition: coverImage.focalX && coverImage.focalY 
                      ? `${coverImage.focalX * 100}% ${coverImage.focalY * 100}%`
                      : 'center'
                  }}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openFocalPointEditor(coverImage)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Edit Focal Point
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeImage(coverImage.id, 'cover')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cover-alt">Alt Text *</Label>
                <Textarea
                  id="cover-alt"
                  value={coverImage.alt}
                  onChange={(e) => updateImageAlt(coverImage.id, e.target.value, 'cover')}
                  placeholder="Describe this image for accessibility..."
                  rows={2}
                />
                {!coverImage.alt && (
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertDescription className="text-amber-800">
                      Alt text is required for accessibility
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No cover image selected</p>
              <Button onClick={() => handleImageUpload('cover')}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Cover Image
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Open Graph Image */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-primary" />
            Open Graph Image
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {ogImage ? (
                <div className="space-y-4">
                  <div className="relative group">
                    <img
                      src={ogImage.url}
                      alt={ogImage.alt}
                      className="w-full h-32 object-cover rounded-lg border"
                      style={{
                        objectPosition: ogImage.focalX && ogImage.focalY 
                          ? `${ogImage.focalX * 100}% ${ogImage.focalY * 100}%`
                          : 'center'
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => openFocalPointEditor(ogImage)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Edit Focal Point
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeImage(ogImage.id, 'og')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="og-alt">Alt Text *</Label>
                    <Textarea
                      id="og-alt"
                      value={ogImage.alt}
                      onChange={(e) => updateImageAlt(ogImage.id, e.target.value, 'og')}
                      placeholder="Describe this image for social sharing..."
                      rows={2}
                    />
                    {!ogImage.alt && (
                      <Alert className="border-amber-200 bg-amber-50">
                        <AlertDescription className="text-amber-800">
                          Alt text is required for accessibility
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <ExternalLink className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-4 text-sm">No OG image selected</p>
                  <Button onClick={() => handleImageUpload('og')} size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload OG Image
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label>Social Preview</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  How your content will appear when shared on social media
                </p>
                {generateOGPreview()}
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </Button>
                <Button variant="outline" size="sm">
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            Gallery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {gallery.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gallery.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-24 object-cover rounded-lg border"
                    style={{
                      objectPosition: image.focalX && image.focalY 
                        ? `${image.focalX * 100}% ${image.focalY * 100}%`
                        : 'center'
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => openFocalPointEditor(image)}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeImage(image.id, 'gallery')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No images in gallery</p>
              <Button onClick={() => handleImageUpload('gallery')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Images
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Focal Point Editor Modal */}
      {showFocalPointEditor && editingImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Edit Focal Point</h3>
            <div className="space-y-4">
              <div className="relative border rounded-lg overflow-hidden">
                <img
                  src={editingImage.url}
                  alt={editingImage.alt}
                  className="w-full h-64 object-cover"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width;
                    const y = (e.clientY - rect.top) / rect.height;
                    updateFocalPoint(x, y);
                  }}
                />
                {editingImage.focalX && editingImage.focalY && (
                  <div
                    className="absolute w-4 h-4 bg-red-500 border-2 border-white rounded-full transform -translate-x-2 -translate-y-2"
                    style={{
                      left: `${editingImage.focalX * 100}%`,
                      top: `${editingImage.focalY * 100}%`
                    }}
                  />
                )}
              </div>
              <p className="text-sm text-gray-600">
                Click on the image to set the focal point. This determines how the image will be cropped on different screen sizes.
              </p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowFocalPointEditor(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowFocalPointEditor(false)}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
