'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { Button } from '@portfolio-building-service/ui';
import { Separator } from '@portfolio-building-service/ui';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  Code, 
  List, 
  ListOrdered, 
  Quote, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Heading2,
  Heading3,
  Heading4,
  Type,
  CheckSquare
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@portfolio-building-service/ui';
import { Alert, AlertDescription } from '@portfolio-building-service/ui';

interface SemanticBlockEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
  onValidationChange?: (errors: ValidationError[]) => void;
}

interface ValidationError {
  type: 'heading' | 'image' | 'link';
  message: string;
  position?: number;
}

export function SemanticBlockEditor({ 
  content = '', 
  onChange, 
  placeholder = 'Start writing your content here...',
  className = '',
  onValidationChange
}: SemanticBlockEditorProps) {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4], // Only allow H2, H3, H4
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
        validate: (href) => {
          // Validate URLs
          try {
            new URL(href);
            return true;
          } catch {
            return false;
          }
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
        addAttributes() {
          return {
            ...this.parent?.(),
            alt: {
              default: null,
              rendered: false,
            },
          };
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
      validateContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  // Validate content for accessibility and structure
  const validateContent = useCallback((html: string) => {
    const errors: ValidationError[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Check heading hierarchy
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;
    
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      
      // Check for H1 (not allowed)
      if (level === 1) {
        errors.push({
          type: 'heading',
          message: 'H1 headings are not allowed in content. Use H2-H4 only.',
          position: index
        });
      }
      
      // Check heading hierarchy
      if (level > lastLevel + 1) {
        errors.push({
          type: 'heading',
          message: `Heading hierarchy skipped: H${level} after H${lastLevel}. Use H${lastLevel + 1} instead.`,
          position: index
        });
      }
      
      lastLevel = level;
    });

    // Check images without alt text
    const images = doc.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.getAttribute('alt') || img.getAttribute('alt')?.trim() === '') {
        errors.push({
          type: 'image',
          message: 'Images must have alt text for accessibility.',
          position: index
        });
      }
    });

    // Check links
    const links = doc.querySelectorAll('a');
    links.forEach((link, index) => {
      const text = link.textContent?.trim();
      const href = link.getAttribute('href');
      
      // Check for "click here" or similar generic text
      if (text && (text.toLowerCase().includes('click here') || text.toLowerCase().includes('read more'))) {
        errors.push({
          type: 'link',
          message: 'Link text should be descriptive. Avoid "click here" or "read more".',
          position: index
        });
      }
      
      // Check for empty links
      if (!text || text === '') {
        errors.push({
          type: 'link',
          message: 'Links must have descriptive text.',
          position: index
        });
      }
    });

    setValidationErrors(errors);
    onValidationChange?.(errors);
  }, [onValidationChange]);

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;

    const url = window.prompt('Image URL');
    if (!url) return;

    const alt = window.prompt('Alt text (required for accessibility)');
    if (!alt) {
      alert('Alt text is required for accessibility');
      return;
    }

    editor.chain().focus().setImage({ src: url, alt }).run();
  }, [editor]);

  const addEmbed = useCallback(() => {
    if (!editor) return;

    const url = window.prompt('Embed URL (YouTube, Vimeo, or other oEmbed URL)');
    if (!url) return;

    // For now, we'll add as a link. In a real implementation, you'd use an embed extension
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  const addCallout = useCallback(() => {
    if (!editor) return;

    editor.chain().focus().insertContent(`
      <div class="callout bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
        <p class="font-semibold text-blue-800 mb-2">Callout</p>
        <p>Your callout content here...</p>
      </div>
    `).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border border-border rounded-lg bg-muted/30">
        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`hover:bg-accent ${editor.isActive('bold') ? 'bg-accent' : ''}`}
                >
                  <Bold className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Bold (Ctrl+B)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`hover:bg-accent ${editor.isActive('italic') ? 'bg-accent' : ''}`}
                >
                  <Italic className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Italic (Ctrl+I)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className={`hover:bg-accent ${editor.isActive('underline') ? 'bg-accent' : ''}`}
                >
                  <UnderlineIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Underline (Ctrl+U)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  className={`hover:bg-accent ${editor.isActive('strike') ? 'bg-accent' : ''}`}
                >
                  <Strikethrough className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Strikethrough</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleCode().run()}
                  className={`hover:bg-accent ${editor.isActive('code') ? 'bg-accent' : ''}`}
                >
                  <Code className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Inline code</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Headings */}
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={`hover:bg-accent ${editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}`}
                >
                  <Heading2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Heading 2</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={`hover:bg-accent ${editor.isActive('heading', { level: 3 }) ? 'bg-accent' : ''}`}
                >
                  <Heading3 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Heading 3</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                  className={`hover:bg-accent ${editor.isActive('heading', { level: 4 }) ? 'bg-accent' : ''}`}
                >
                  <Heading4 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Heading 4</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Lists */}
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={`hover:bg-accent ${editor.isActive('bulletList') ? 'bg-accent' : ''}`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Bullet list</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={`hover:bg-accent ${editor.isActive('orderedList') ? 'bg-accent' : ''}`}
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Numbered list</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  className={`hover:bg-accent ${editor.isActive('blockquote') ? 'bg-accent' : ''}`}
                >
                  <Quote className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Quote</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Media & Links */}
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={setLink}
                  className={`hover:bg-accent ${editor.isActive('link') ? 'bg-accent' : ''}`}
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add link</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={addImage}
                  className="hover:bg-accent"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add image</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={addEmbed}
                  className="hover:bg-accent"
                >
                  <Type className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add embed</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={addCallout}
                  className="hover:bg-accent"
                >
                  <CheckSquare className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add callout</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* History */}
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                  className="hover:bg-accent"
                >
                  <Undo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Undo (Ctrl+Z)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                  className="hover:bg-accent"
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Redo (Ctrl+Y)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertDescription className="text-amber-800">
            <div className="space-y-1">
              <p className="font-semibold">Content Issues Found:</p>
              {validationErrors.map((error, index) => (
                <p key={index} className="text-sm">• {error.message}</p>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Editor Area */}
      <div className="min-h-[300px] border border-border rounded-lg bg-background">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
