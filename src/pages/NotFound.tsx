import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-9xl font-bold text-primary/20">404</div>
        <h1 className="text-3xl font-bold">Página não encontrada</h1>
        <p className="text-muted-foreground">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="gradient" asChild>
            <Link to="/" className="gap-2">
              <Home className="h-4 w-4" />
              Voltar ao início
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/search" className="gap-2">
              <Search className="h-4 w-4" />
              Buscar
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
