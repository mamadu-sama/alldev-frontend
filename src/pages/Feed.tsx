import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, TrendingUp, Clock, HelpCircle, Loader2 } from "lucide-react";
import { Seo } from "@/components/common/Seo";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/post/PostCard";
import { useAuthStore } from "@/stores/authStore";
import { postService } from "@/services/post.service";
import { tagService } from "@/services/tag.service";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { PostFilter, Post } from "@/types";

export default function Feed() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter = (searchParams.get("filter") as PostFilter) || "recent";
  const { isAuthenticated } = useAuthStore();
  const { toast } = useToast();

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch followed tags for visual indicators
  const { data: followedTags } = useQuery({
    queryKey: ["followedTags"],
    queryFn: () => tagService.getFollowedTags(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const followedTagIds = followedTags?.map((t) => t.id) || [];

  // Load posts from API
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const response = await postService.getPosts(1, 50, currentFilter);
        setPosts(response.data);
      } catch (error) {
        toast({
          title: "Erro ao carregar posts",
          description: "Não foi possível carregar os posts. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, [currentFilter, toast]);

  const handleFilterChange = (filter: string) => {
    setSearchParams({ filter });
  };

  const handleVote = (postId: string, voteType: "up" | "down") => {
    setPosts(
      posts.map((post) => {
        if (post.id !== postId) return post;

        let newVotes = post.votes;
        let newUserVote = post.userVote;

        if (post.userVote === voteType) {
          // Remove vote
          newVotes = voteType === "up" ? post.votes - 1 : post.votes + 1;
          newUserVote = null;
        } else if (post.userVote) {
          // Change vote
          newVotes = voteType === "up" ? post.votes + 2 : post.votes - 2;
          newUserVote = voteType;
        } else {
          // New vote
          newVotes = voteType === "up" ? post.votes + 1 : post.votes - 1;
          newUserVote = voteType;
        }

        return { ...post, votes: newVotes, userVote: newUserVote };
      })
    );
  };

  // Sort posts based on filter
  const sortedPosts = [...posts].sort((a, b) => {
    switch (currentFilter) {
      case "votes":
        return b.votes - a.votes;
      case "unanswered":
        return a.hasAcceptedAnswer === b.hasAcceptedAnswer
          ? 0
          : a.hasAcceptedAnswer
            ? 1
            : -1;
      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });

  const filteredPosts =
    currentFilter === "unanswered"
      ? sortedPosts.filter((p) => !p.hasAcceptedAnswer)
      : sortedPosts;

  return (
    <>
      <Seo
        title="Feed da Comunidade"
        description="Descubra discussões, faça perguntas e ajude outros desenvolvedores na comunidade Alldev."
      />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Feed da Comunidade</h1>
            <p className="text-muted-foreground mt-1">
              Descubra discussões e ajude outros desenvolvedores
            </p>
          </div>

          {isAuthenticated ? (
            <Button
              variant="gradient"
              size="lg"
              asChild
              className="shrink-0"
              data-tour="create-post"
            >
              <Link to="/posts/new">
                <Plus className="h-5 w-5 mr-1" />
                Nova Pergunta
              </Link>
            </Button>
          ) : (
            <Button variant="gradient" size="lg" asChild className="shrink-0">
              <Link to="/login">Entrar para Perguntar</Link>
            </Button>
          )}
        </div>

        {/* Filters */}
        <Tabs value={currentFilter} onValueChange={handleFilterChange}>
          <TabsList className="bg-muted/50">
            <TabsTrigger value="recent" className="gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Mais Recentes</span>
              <span className="sm:hidden">Recentes</span>
            </TabsTrigger>
            <TabsTrigger value="votes" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Mais Votados</span>
              <span className="sm:hidden">Top</span>
            </TabsTrigger>
            <TabsTrigger value="unanswered" className="gap-2">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Sem Resposta</span>
              <span className="sm:hidden">Abertos</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Posts list */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Carregando posts...</p>
            </div>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <div
                key={post.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <PostCard
                  post={post}
                  onVote={handleVote}
                  followedTagIds={followedTagIds}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhum post encontrado
              </h3>
              <p className="text-muted-foreground">
                {currentFilter === "unanswered"
                  ? "Todas as perguntas foram respondidas!"
                  : "Seja o primeiro a criar um post."}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
