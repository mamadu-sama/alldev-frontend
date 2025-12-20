import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { pageService } from "@/services/page.service";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface StaticPageRendererProps {
  slug: string;
  fallbackContent?: React.ReactNode;
}

export function StaticPageRenderer({
  slug,
  fallbackContent,
}: StaticPageRendererProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["staticPage", slug],
    queryFn: () => pageService.getPageBySlug(slug),
    retry: 1,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // If error and has fallback, show fallback
  if (error && fallbackContent) {
    return <>{fallbackContent}</>;
  }

  // If error and no fallback, show error
  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-4">Página não encontrada</h2>
        <p className="text-muted-foreground mb-6">
          A página que você procura não está disponível.
        </p>
        <Button asChild>
          <Link to="/">Voltar ao Feed</Link>
        </Button>
      </div>
    );
  }

  if (!data?.data) {
    return fallbackContent || null;
  }

  const page = data.data;

  return (
    <div className="container max-w-4xl py-8 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
        {page.metaDescription && (
          <p className="text-muted-foreground">{page.metaDescription}</p>
        )}
        <p className="text-sm text-muted-foreground mt-4">
          Última atualização:{" "}
          {new Date(page.updatedAt).toLocaleDateString("pt-BR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Content */}
      <Card>
        <CardContent className="p-8 prose prose-sm sm:prose-base dark:prose-invert max-w-none">
          <ReactMarkdown>{page.content}</ReactMarkdown>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          Dúvidas sobre este documento?{" "}
          <Link to="/contact" className="text-primary hover:underline">
            Entre em contato
          </Link>
        </p>
      </div>
    </div>
  );
}
