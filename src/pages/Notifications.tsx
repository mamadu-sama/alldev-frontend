import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  CheckCheck,
  Loader2,
  MessageSquare,
  ThumbsUp,
  CheckCircle,
  AtSign,
  AlertCircle,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notificationService } from "@/services/notification.service";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuthStore } from "@/stores/authStore";
import { Notification } from "@/types";
import {
  useNotificationSound,
  NotificationType as SoundNotificationType,
} from "@/hooks/useNotificationSound";
import {
  useNotificationSoundStore,
  NotificationSoundType,
} from "@/stores/notificationSoundStore";

export default function Notifications() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");
  const { playSound, enabled: soundEnabled } = useNotificationSound();
  const { toggleSound } = useNotificationSoundStore();
  const previousUnreadCountRef = useRef<number>(0);

  // Fetch notifications
  const { data, isLoading } = useQuery({
    queryKey: ["notifications", user?.id, activeTab],
    queryFn: () =>
      notificationService.getNotifications(1, 50, activeTab === "unread"),
    enabled: !!user,
  });

  const notifications = useMemo(() => data?.data || [], [data?.data]);
  const unreadCount = data?.meta?.unreadCount || 0;

  // Play sound when new notifications arrive
  useEffect(() => {
    if (
      previousUnreadCountRef.current > 0 &&
      unreadCount > previousUnreadCountRef.current
    ) {
      // New notification received
      const latestNotification = notifications.find((n) => !n.read);
      if (latestNotification) {
        // Map frontend notification type to sound types expected by the hook
        const mapType = (
          t: Notification["type"]
        ): SoundNotificationType | NotificationSoundType => {
          switch (t) {
            case "comment":
              return "COMMENT";
            case "reply":
              return "REPLY";
            case "vote":
              return "VOTE";
            case "accepted":
              return "ACCEPTED";
            case "mention":
              return "MENTION";
            case "system":
              return "SYSTEM";
            default:
              return "default";
          }
        };

        playSound(mapType(latestNotification.type));
      }
    }
    previousUnreadCountRef.current = unreadCount;
  }, [unreadCount, notifications, playSound]);

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) =>
      notificationService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => {
      toast.error("Erro ao marcar notificação como lida");
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Todas as notificações foram marcadas como lidas");
    },
    onError: () => {
      toast.error("Erro ao marcar notificações como lidas");
    },
  });

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      markAsReadMutation.mutate(notification.id);
    }

    // Navigate to related content
    if (notification.relatedPostSlug) {
      navigate(`/posts/${notification.relatedPostSlug}`);
    } else if (notification.relatedPostId) {
      navigate(`/posts/${notification.relatedPostId}`);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "comment":
      case "reply":
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case "vote":
        return <ThumbsUp className="h-5 w-5 text-green-500" />;
      case "accepted":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case "mention":
        return <AtSign className="h-5 w-5 text-purple-500" />;
      case "system":
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-6 w-6" />
                Notificações
              </CardTitle>
              <CardDescription>
                Acompanhe todas as suas notificações
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSound}
                title={soundEnabled ? "Desativar som" : "Ativar som"}
              >
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markAllAsReadMutation.mutate()}
                  disabled={markAllAsReadMutation.isPending}
                >
                  {markAllAsReadMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CheckCheck className="h-4 w-4 mr-2" />
                  )}
                  Marcar todas como lidas
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">
                Todas
                {notifications.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {notifications.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="unread">
                Não lidas
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-foreground mb-2">
                    {activeTab === "unread"
                      ? "Nenhuma notificação não lida"
                      : "Nenhuma notificação"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activeTab === "unread"
                      ? "Você está em dia com suas notificações!"
                      : "Quando você receber notificações, elas aparecerão aqui"}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`flex items-start gap-4 p-4 rounded-lg border transition-colors cursor-pointer ${
                        !notification.read
                          ? "bg-primary/5 border-primary/20 hover:bg-primary/10"
                          : "border-border hover:bg-accent"
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        {notification.title && (
                          <h4 className="font-medium text-sm text-foreground mb-1">
                            {notification.title}
                          </h4>
                        )}
                        <p
                          className={`text-sm ${
                            !notification.read
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {notification.message}
                        </p>
                        {notification.post && (
                          <p className="text-xs text-muted-foreground mt-1">
                            em: {notification.post.title}
                          </p>
                        )}
                        <span className="text-xs text-muted-foreground mt-2 inline-block">
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            {
                              addSuffix: true,
                              locale: ptBR,
                            }
                          )}
                        </span>
                      </div>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
