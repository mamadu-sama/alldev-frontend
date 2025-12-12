import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PostCard } from '@/components/post/PostCard';
import { mockTags, mockPosts } from '@/lib/mockData';

export default function TagDetails() {
  const { slug } = useParams();
  const tag = mockTags.find(t => t.slug === slug);
  const posts = mockPosts.filter(p => p.tags.some(t => t.slug === slug));

  if (!tag) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Tag não encontrada</h2>
        <Button asChild>
          <Link to="/tags">Ver todas as tags</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" asChild className="gap-2">
        <Link to="/tags">
          <ArrowLeft className="h-4 w-4" />
          Voltar para Tags
        </Link>
      </Button>

      {/* Tag header */}
      <div className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
          <Hash className="h-8 w-8 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">{tag.name}</h1>
            <Badge variant="outline">{tag.postCount.toLocaleString()} posts</Badge>
          </div>
          <p className="text-muted-foreground">{tag.description}</p>
        </div>
      </div>

      {/* Posts */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Posts com #{tag.name}</h2>
        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Nenhum post com esta tag ainda.
          </div>
        )}
      </div>
    </div>
  );
}
