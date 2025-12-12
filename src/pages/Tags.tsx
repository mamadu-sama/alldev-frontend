import { Link, useNavigate } from 'react-router-dom';
import { Hash, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockTags } from '@/lib/mockData';
import { useState } from 'react';

export default function Tags() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'alpha'>('popular');
  const navigate = useNavigate();

  const filteredTags = mockTags
    .filter(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'popular') return b.postCount - a.postCount;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Tags</h1>
        <p className="text-muted-foreground">
          Uma tag é uma palavra-chave ou rótulo que categoriza sua pergunta com outras perguntas similares.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Filtrar por nome da tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'popular' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('popular')}
            className="gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Populares
          </Button>
          <Button
            variant={sortBy === 'alpha' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('alpha')}
          >
            A-Z
          </Button>
        </div>
      </div>

      {/* Tags grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTags.map(tag => (
          <Card 
            key={tag.id} 
            variant="hover" 
            className="cursor-pointer"
            onClick={() => navigate(`/tags/${tag.slug}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <Badge variant="tag" className="text-sm">
                  <Hash className="h-3 w-3 mr-1" />
                  {tag.name}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {tag.postCount.toLocaleString()} posts
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {tag.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTags.length === 0 && (
        <div className="text-center py-12">
          <Hash className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma tag encontrada</h3>
          <p className="text-muted-foreground">
            Tente buscar com outros termos
          </p>
        </div>
      )}
    </div>
  );
}
