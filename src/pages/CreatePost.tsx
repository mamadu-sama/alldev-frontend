import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Eye, Edit, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarkdownContent } from '@/components/common/MarkdownContent';
import { mockTags } from '@/lib/mockData';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';

const postSchema = z.object({
  title: z
    .string()
    .min(10, 'Título deve ter no mínimo 10 caracteres')
    .max(200, 'Título deve ter no máximo 200 caracteres'),
  content: z
    .string()
    .min(30, 'Conteúdo deve ter no mínimo 30 caracteres'),
});

type PostFormData = z.infer<typeof postSchema>;

export default function CreatePost() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagSearch, setTagSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const content = watch('content');

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const filteredTags = mockTags.filter(
    tag =>
      tag.name.toLowerCase().includes(tagSearch.toLowerCase()) &&
      !selectedTags.includes(tag.name)
  );

  const handleAddTag = (tagName: string) => {
    if (selectedTags.length >= 5) {
      toast({ title: 'Máximo de 5 tags', variant: 'destructive' });
      return;
    }
    setSelectedTags([...selectedTags, tagName]);
    setTagSearch('');
  };

  const handleRemoveTag = (tagName: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tagName));
  };

  const onSubmit = async (data: PostFormData) => {
    if (selectedTags.length === 0) {
      toast({ title: 'Adicione pelo menos uma tag', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate slug
    const slug = data.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    toast({ title: 'Post publicado com sucesso!' });
    setIsSubmitting(false);
    navigate(`/posts/${slug}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Nova Pergunta</h1>
          <p className="text-muted-foreground">
            Compartilhe sua dúvida com a comunidade
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            placeholder="Ex: Como otimizar performance em aplicações React?"
            {...register('title')}
            className="text-lg"
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Seja específico e imagine que está perguntando para outra pessoa
          </p>
        </div>

        {/* Content with tabs */}
        <div className="space-y-2">
          <Label>Conteúdo</Label>
          <Tabs defaultValue="write" className="w-full">
            <TabsList className="mb-2">
              <TabsTrigger value="write" className="gap-2">
                <Edit className="h-4 w-4" />
                Escrever
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="write" className="mt-0">
              <Textarea
                placeholder="Descreva sua dúvida em detalhes usando Markdown...

# Contexto
Explique o contexto do problema

## O que você já tentou?
Descreva o que já tentou fazer

```javascript
// Seu código aqui
```

## Resultado esperado
O que você espera que aconteça"
                {...register('content')}
                className="min-h-80 font-mono text-sm"
              />
            </TabsContent>
            <TabsContent value="preview" className="mt-0">
              <Card className="min-h-80 p-6">
                {content ? (
                  <div className="markdown-content">
                    <MarkdownContent content={content} />
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-12">
                    Nada para visualizar ainda...
                  </p>
                )}
              </Card>
            </TabsContent>
          </Tabs>
          {errors.content && (
            <p className="text-sm text-destructive">{errors.content.message}</p>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedTags.map(tag => (
              <Badge key={tag} variant="tag" className="gap-1 pr-1">
                {tag}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleRemoveTag(tag)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <div className="relative">
            <Input
              placeholder="Buscar tags..."
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
              disabled={selectedTags.length >= 5}
            />
            {tagSearch && filteredTags.length > 0 && (
              <Card className="absolute top-full left-0 right-0 z-10 mt-1 p-2 max-h-48 overflow-y-auto">
                {filteredTags.map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-muted flex items-center justify-between"
                    onClick={() => handleAddTag(tag.name)}
                  >
                    <span>{tag.name}</span>
                    <span className="text-xs text-muted-foreground">{tag.postCount} posts</span>
                  </button>
                ))}
              </Card>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Adicione até 5 tags para descrever sobre o que é sua pergunta
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-end pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button type="submit" variant="gradient" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Publicar Pergunta
          </Button>
        </div>
      </form>
    </div>
  );
}
