import { useParams, Link } from 'react-router-dom';
import { Calendar, Github, Linkedin, Twitter, Globe, Pencil, MessageSquare, CheckCircle, FileText } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PostCard } from '@/components/post/PostCard';
import { mockUsers, mockPosts } from '@/lib/mockData';
import { useAuthStore } from '@/stores/authStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function UserProfile() {
  const { username } = useParams();
  const { user: currentUser } = useAuthStore();

  const user = mockUsers.find(u => u.username === username);
  const userPosts = mockPosts.filter(p => p.author.username === username);
  const isOwnProfile = currentUser?.username === username;

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Usuário não encontrado</h2>
        <Button asChild>
          <Link to="/">Voltar para o feed</Link>
        </Button>
      </div>
    );
  }

  const getInitials = (name: string) => name.slice(0, 2).toUpperCase();
  const joinDate = format(new Date(user.createdAt), "MMMM 'de' yyyy", { locale: ptBR });

  // Mock stats
  const stats = {
    posts: userPosts.length,
    comments: 42,
    accepted: 15,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile header */}
      <Card className="overflow-hidden">
        {/* Cover gradient */}
        <div className="h-32 bg-gradient-to-r from-primary to-secondary" />
        
        <CardContent className="relative pt-0 pb-6">
          {/* Avatar */}
          <Avatar size="2xl" className="-mt-16 border-4 border-card">
            <AvatarImage src={user.avatarUrl} alt={user.username} />
            <AvatarFallback className="text-2xl">{getInitials(user.username)}</AvatarFallback>
          </Avatar>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              {/* Name and badge */}
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{user.username}</h1>
                <Badge variant="level">{user.level}</Badge>
              </div>

              {/* Reputation */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl font-bold text-primary">
                  {user.reputation.toLocaleString()}
                </span>
                <span className="text-muted-foreground">reputação</span>
              </div>

              {/* Bio */}
              {user.bio && (
                <p className="text-muted-foreground max-w-xl mb-4">{user.bio}</p>
              )}

              {/* Join date */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Membro desde {joinDate}
              </div>
            </div>

            {/* Actions */}
            {isOwnProfile && (
              <Button variant="outline" asChild>
                <Link to="/profile/edit" className="gap-2">
                  <Pencil className="h-4 w-4" />
                  Editar Perfil
                </Link>
              </Button>
            )}
          </div>

          {/* Skills */}
          {user.skills.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {user.skills.map((skill, i) => (
                <Badge key={i} variant="tag">{skill}</Badge>
              ))}
            </div>
          )}

          {/* Social links */}
          {user.socialLinks && (
            <div className="mt-4 flex gap-3">
              {user.socialLinks.github && (
                <a
                  href={user.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
              {user.socialLinks.linkedin && (
                <a
                  href={user.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {user.socialLinks.twitter && (
                <a
                  href={user.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {user.socialLinks.portfolio && (
                <a
                  href={user.socialLinks.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Globe className="h-5 w-5" />
                </a>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <FileText className="h-6 w-6 mx-auto mb-2 text-primary" />
          <div className="text-2xl font-bold">{stats.posts}</div>
          <div className="text-sm text-muted-foreground">Posts</div>
        </Card>
        <Card className="p-4 text-center">
          <MessageSquare className="h-6 w-6 mx-auto mb-2 text-secondary" />
          <div className="text-2xl font-bold">{stats.comments}</div>
          <div className="text-sm text-muted-foreground">Comentários</div>
        </Card>
        <Card className="p-4 text-center">
          <CheckCircle className="h-6 w-6 mx-auto mb-2 text-success" />
          <div className="text-2xl font-bold">{stats.accepted}</div>
          <div className="text-sm text-muted-foreground">Aceitas</div>
        </Card>
      </div>

      {/* Content tabs */}
      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">Posts ({userPosts.length})</TabsTrigger>
          <TabsTrigger value="activity">Atividade</TabsTrigger>
          <TabsTrigger value="about">Sobre</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-4 space-y-4">
          {userPosts.length > 0 ? (
            userPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Nenhum post ainda</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Histórico de atividades em breve...</p>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="mt-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Sobre {user.username}</h3>
            {user.bio ? (
              <p className="text-muted-foreground whitespace-pre-wrap">{user.bio}</p>
            ) : (
              <p className="text-muted-foreground">Nenhuma bio adicionada ainda.</p>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
