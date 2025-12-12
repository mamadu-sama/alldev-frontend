import { useState } from 'react';
import { 
  Search, 
  MoreHorizontal, 
  Trash2, 
  Edit,
  Plus,
  Hash
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { mockTags } from '@/lib/mockData';
import { toast } from 'sonner';
import { Tag } from '@/types';

export default function AdminTags() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [dialogType, setDialogType] = useState<'create' | 'edit' | 'delete' | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const filteredTags = mockTags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tag.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTag = () => {
    if (!formData.name.trim()) {
      toast.error('Nome da tag é obrigatório');
      return;
    }
    toast.success(`Tag "${formData.name}" criada com sucesso`);
    setDialogType(null);
    setFormData({ name: '', description: '' });
  };

  const handleEditTag = () => {
    if (!formData.name.trim()) {
      toast.error('Nome da tag é obrigatório');
      return;
    }
    toast.success(`Tag "${formData.name}" atualizada com sucesso`);
    setDialogType(null);
    setSelectedTag(null);
    setFormData({ name: '', description: '' });
  };

  const handleDeleteTag = () => {
    toast.success(`Tag "${selectedTag?.name}" removida com sucesso`);
    setDialogType(null);
    setSelectedTag(null);
  };

  const openEditDialog = (tag: Tag) => {
    setSelectedTag(tag);
    setFormData({ name: tag.name, description: tag.description });
    setDialogType('edit');
  };

  const openCreateDialog = () => {
    setFormData({ name: '', description: '' });
    setDialogType('create');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tags</h1>
          <p className="text-muted-foreground">Gerencie as tags da plataforma</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Tag
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tags Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTags.map((tag) => (
          <Card key={tag.id} className="group">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Hash className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{tag.name}</h3>
                    <p className="text-sm text-muted-foreground">{tag.postCount} posts</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditDialog(tag)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        setSelectedTag(tag);
                        setDialogType('delete');
                      }}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remover
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                {tag.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogType === 'create' || dialogType === 'edit'} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === 'create' ? 'Nova Tag' : 'Editar Tag'}
            </DialogTitle>
            <DialogDescription>
              {dialogType === 'create' 
                ? 'Crie uma nova tag para categorizar posts.' 
                : 'Atualize as informações da tag.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder="Ex: javascript"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva quando usar esta tag..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>Cancelar</Button>
            <Button onClick={dialogType === 'create' ? handleCreateTag : handleEditTag}>
              {dialogType === 'create' ? 'Criar' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={dialogType === 'delete'} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Tag</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover a tag "{selectedTag?.name}"? 
              {selectedTag && selectedTag.postCount > 0 && (
                <span className="block mt-2 text-warning">
                  Atenção: Esta tag está sendo usada em {selectedTag.postCount} posts.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteTag}>Remover</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
