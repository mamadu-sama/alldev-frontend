import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, FileText, Users, Hash } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PostCard } from '@/components/post/PostCard';
import { mockPosts, mockUsers, mockTags } from '@/lib/mockData';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const filteredPosts = mockPosts.filter(
    p =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.content.toLowerCase().includes(query.toLowerCase())
  );

  const filteredUsers = mockUsers.filter(
    u =>
      u.username.toLowerCase().includes(query.toLowerCase()) ||
      u.bio?.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTags = mockTags.filter(t =>
    t.name.toLowerCase().includes(query.toLowerCase())
  );

  const getInitials = (username: string) => username.slice(0, 2).toUpperCase();

  if (!query) {
    return (
      <div className="text-center py-12">
        <SearchIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Buscar na comunidade</h2>
        <p className="text-muted-foreground">
          Use a barra de busca acima para encontrar posts, usuários e tags
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">
          Resultados para: <span className="text-primary">"{query}"</span>
        </h1>
        <p className="text-muted-foreground">
          {filteredPosts.length + filteredUsers.length + filteredTags.length} resultados encontrados
        </p>
      </div>

      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts" className="gap-2">
            <FileText className="h-4 w-4" />
            Posts ({filteredPosts.length})
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Usuários ({filteredUsers.length})
          </TabsTrigger>
          <TabsTrigger value="tags" className="gap-2">
            <Hash className="h-4 w-4" />
            Tags ({filteredTags.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-4 space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => <PostCard key={post.id} post={post} />)
          ) : (
            <Card className="p-8 text-center text-muted-foreground">
              Nenhum post encontrado
            </Card>
          )}
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <Link key={user.id} to={`/users/${user.username}`}>
                  <Card variant="hover" className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatarUrl} alt={user.username} />
                        <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{user.username}</span>
                          <Badge variant="level" className="text-[10px]">{user.level}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {user.reputation.toLocaleString()} reputação
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <Card className="p-8 text-center text-muted-foreground col-span-2">
                Nenhum usuário encontrado
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="tags" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTags.length > 0 ? (
              filteredTags.map(tag => (
                <Link key={tag.id} to={`/tags/${tag.slug}`}>
                  <Card variant="hover" className="p-4">
                    <Badge variant="tag" className="mb-2">{tag.name}</Badge>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {tag.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {tag.postCount.toLocaleString()} posts
                    </p>
                  </Card>
                </Link>
              ))
            ) : (
              <Card className="p-8 text-center text-muted-foreground col-span-3">
                Nenhuma tag encontrada
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
