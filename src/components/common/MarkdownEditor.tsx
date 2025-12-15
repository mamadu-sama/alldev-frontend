import { useState, useRef } from 'react';
import { Image, Smile, Code, List, ListOrdered, Link2, Bold, Italic, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { uploadService } from '@/services/upload.service';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Escreva em Markdown...',
  minHeight = 'min-h-32',
}: MarkdownEditorProps) {
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const insertText = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || placeholder;
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);

    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + selectedText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Tipo de arquivo inválido',
        description: 'Apenas imagens são permitidas (JPEG, PNG, GIF, WebP)',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Arquivo muito grande',
        description: 'O tamanho máximo é 5MB',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      const { url } = await uploadService.uploadContentImage(file);
      insertText(`![${file.name}](${url})\n`);
      
      toast({
        title: 'Imagem enviada!',
        description: 'A imagem foi adicionada ao seu texto',
      });
    } catch (error) {
      toast({
        title: 'Erro ao enviar imagem',
        description: 'Não foi possível fazer upload da imagem. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newText = value.substring(0, start) + emojiData.emoji + value.substring(start);
    onChange(newText);

    // Set cursor position after emoji
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + emojiData.emoji.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);

    setIsEmojiPickerOpen(false);
  };

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border border-border rounded-lg bg-muted/30">
        <Button
          type="button"
          variant="ghost"
          size="iconSm"
          onClick={() => insertText('**', '**', 'texto em negrito')}
          title="Negrito"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="iconSm"
          onClick={() => insertText('*', '*', 'texto em itálico')}
          title="Itálico"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="iconSm"
          onClick={() => insertText('`', '`', 'código inline')}
          title="Código inline"
        >
          <Code className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="iconSm"
          onClick={() => insertText('- ', '', 'item da lista')}
          title="Lista"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="iconSm"
          onClick={() => insertText('1. ', '', 'item numerado')}
          title="Lista numerada"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="iconSm"
          onClick={() => insertText('[', '](url)', 'texto do link')}
          title="Link"
        >
          <Link2 className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        
        {/* Emoji Picker */}
        <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="iconSm"
              title="Emoji"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 border-0" align="start">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              width="100%"
              height="400px"
              searchPlaceholder="Pesquisar emoji..."
              skinTonesDisabled
            />
          </PopoverContent>
        </Popover>

        {/* Image Upload */}
        <Button
          type="button"
          variant="ghost"
          size="iconSm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          title="Enviar imagem"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Image className="h-4 w-4" />
          )}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleImageUpload}
          className="hidden"
        />

        <div className="flex-1" />
        
        {/* Hint */}
        <span className="text-xs text-muted-foreground">
          Suporta Markdown, emojis 😊 e imagens
        </span>
      </div>

      {/* Textarea */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={minHeight}
      />

      {/* Helper text */}
      <p className="text-xs text-muted-foreground">
        Para código, use ```linguagem no início e ``` no fim. Exemplo: ```javascript
      </p>
    </div>
  );
}

