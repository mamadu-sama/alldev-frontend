import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  User,
  Settings,
  Code2,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";
import { mockNotifications } from "@/lib/mockData";

interface HeaderProps {
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
}

export function Header({ onMenuToggle, isSidebarOpen }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const unreadNotifications = mockNotifications.filter((n) => !n.read).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  const isAdmin = user?.roles?.includes('ADMIN');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-4 px-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuToggle}
        >
          {isSidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <img src="/logo.png" alt="Logo" className="h-9 w-9 object-contain" />
          <span className="hidden sm:inline-block">
            <span className="text-primary">All</span>
            <span className="text-foreground">dev</span>
          </span>
        </Link>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar posts, tags, usuários..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 bg-muted/50 border-border focus:bg-background"
            />
          </div>
        </form>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hidden sm:inline-flex"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {isAuthenticated && user ? (
            <>
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                        {unreadNotifications}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-popover">
                  <div className="flex items-center justify-between p-3 border-b border-border">
                    <span className="font-semibold">Notificações</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground"
                    >
                      Marcar todas como lidas
                    </Button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {mockNotifications.slice(0, 5).map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${
                          !notification.read ? "bg-primary/5" : ""
                        }`}
                        onClick={() =>
                          notification.relatedPostSlug &&
                          navigate(`/posts/${notification.relatedPostSlug}`)
                        }
                      >
                        <span
                          className={`text-sm ${
                            !notification.read
                              ? "font-medium"
                              : "text-muted-foreground"
                          }`}
                        >
                          {notification.message}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="justify-center text-primary cursor-pointer"
                    onClick={() => navigate("/notifications")}
                  >
                    Ver todas
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar size="sm">
                      <AvatarImage src={user.avatarUrl} alt={user.username} />
                      <AvatarFallback>
                        {getInitials(user.username)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover">
                  <div className="flex items-center gap-3 p-3">
                    <Avatar>
                      <AvatarImage src={user.avatarUrl} alt={user.username} />
                      <AvatarFallback>
                        {getInitials(user.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.username}</span>
                      <div className="flex items-center gap-1">
                        <Badge
                          variant="level"
                          className="text-[10px] px-1.5 py-0"
                        >
                          {user.level}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {user.reputation.toLocaleString()} rep
                        </span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate(`/users/${user.username}`)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Meu Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile/edit")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Editar Perfil
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => navigate("/admin")}
                        className="text-primary focus:text-primary font-medium"
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Painel Admin
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem onClick={toggleTheme} className="sm:hidden">
                    {theme === "dark" ? (
                      <Sun className="mr-2 h-4 w-4" />
                    ) : (
                      <Moon className="mr-2 h-4 w-4" />
                    )}
                    {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Entrar
              </Button>
              <Button variant="gradient" onClick={() => navigate("/register")}>
                Cadastrar
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
