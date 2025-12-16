import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Music,
  Upload,
  Trash2,
  Edit,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  BarChart,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { adminService } from "@/services/admin.service";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NotificationSound {
  id: string;
  name: string;
  description?: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  duration?: number;
  isActive: boolean;
  isDefault: boolean;
  uploadedBy: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  createdAt: string;
  _count?: {
    userPreferences: number;
  };
}

export default function AdminNotificationSounds() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSound, setSelectedSound] = useState<NotificationSound | null>(
    null
  );
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );

  const queryClient = useQueryClient();

  // Fetch sounds
  const { data, isLoading } = useQuery({
    queryKey: ["admin-notification-sounds"],
    queryFn: () => adminService.getNotificationSounds(),
  });

  const sounds = data?.data || [];

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) =>
      adminService.uploadNotificationSound(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-notification-sounds"],
      });
      toast.success("Som carregado com sucesso!");
      setUploadDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error?.message || "Erro ao carregar som"
      );
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminService.updateNotificationSound(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-notification-sounds"],
      });
      toast.success("Som atualizado com sucesso!");
      setEditDialogOpen(false);
      setSelectedSound(null);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error?.message || "Erro ao atualizar som"
      );
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteNotificationSound(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-notification-sounds"],
      });
      toast.success("Som deletado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error?.message || "Erro ao deletar som"
      );
    },
  });

  const handleUploadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    uploadMutation.mutate(formData);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSound) return;

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      isActive: formData.get("isActive") === "on",
      isDefault: formData.get("isDefault") === "on",
    };

    updateMutation.mutate({ id: selectedSound.id, data });
  };

  const handlePlaySound = async (sound: NotificationSound) => {
    if (playingSound === sound.id) {
      audioElement?.pause();
      setPlayingSound(null);
      setAudioElement(null);
    } else {
      if (audioElement) {
        audioElement.pause();
      }

      try {
        console.log("🔊 Tentando reproduzir som:", sound.fileUrl);

        const audio = new Audio(sound.fileUrl);

        audio.onerror = (error) => {
          console.error("❌ Erro ao carregar áudio:", error);
          toast.error(
            "Erro ao reproduzir som. Verifique as configurações de CORS do S3."
          );
          setPlayingSound(null);
          setAudioElement(null);
        };

        audio.onended = () => {
          setPlayingSound(null);
          setAudioElement(null);
        };

        audio.onloadedmetadata = () => {
          console.log("✅ Áudio carregado:", {
            duration: audio.duration,
            url: sound.fileUrl,
          });
        };

        await audio.play();
        console.log("▶️ Reproduzindo...");
        setPlayingSound(sound.id);
        setAudioElement(audio);
      } catch (error) {
        console.error("❌ Erro ao reproduzir:", error);
        toast.error(
          "Erro ao reproduzir som. Verifique o console para mais detalhes."
        );
        setPlayingSound(null);
        setAudioElement(null);
      }
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja deletar este som?")) {
      deleteMutation.mutate(id);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Sons de Notificação
          </h1>
          <p className="text-muted-foreground">
            Gerencie os sons disponíveis para notificações
          </p>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Carregar Novo Som
        </Button>
      </div>

      {/* Stats Card */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Sons</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sounds.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sons Ativos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sounds.filter((s: NotificationSound) => s.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mais Usado</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {sounds.length > 0
                ? sounds.reduce(
                    (prev: NotificationSound, curr: NotificationSound) =>
                      (curr._count?.userPreferences || 0) >
                      (prev._count?.userPreferences || 0)
                        ? curr
                        : prev
                  ).name
                : "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sounds List */}
      <Card>
        <CardHeader>
          <CardTitle>Sons Disponíveis</CardTitle>
          <CardDescription>
            {sounds.length} som(ns) carregado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : sounds.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Music className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">
                Nenhum som carregado
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Carregue seus primeiros sons de notificação
              </p>
              <Button onClick={() => setUploadDialogOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Carregar Som
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {sounds.map((sound: NotificationSound) => (
                <div
                  key={sound.id}
                  className="flex items-center gap-4 p-4 rounded-lg border bg-card"
                >
                  <div className="shrink-0">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handlePlaySound(sound)}
                    >
                      {playingSound === sound.id ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground">
                        {sound.name}
                      </h3>
                      {sound.isDefault && (
                        <Badge variant="default">Padrão</Badge>
                      )}
                      {sound.isActive ? (
                        <Badge variant="outline" className="text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Ativo
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-600">
                          <XCircle className="h-3 w-3 mr-1" />
                          Inativo
                        </Badge>
                      )}
                    </div>
                    {sound.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {sound.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{formatFileSize(sound.fileSize)}</span>
                      {sound.duration && (
                        <span>{sound.duration.toFixed(1)}s</span>
                      )}
                      <span>{sound._count?.userPreferences || 0} usuários</span>
                      <span>
                        {formatDistanceToNow(new Date(sound.createdAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedSound(sound);
                        setEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(sound.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Carregar Novo Som</DialogTitle>
            <DialogDescription>
              Carregue um arquivo de áudio (MP3, WAV, OGG). Máximo 2MB.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Som *</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="Ex: Beep Suave"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Descrição opcional do som"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="audio">Arquivo de Áudio *</Label>
                <Input
                  id="audio"
                  name="audio"
                  type="file"
                  accept="audio/*"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Formatos aceitos: MP3, WAV, OGG, WebM. Máximo 2MB.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="isDefault" name="isDefault" />
                <Label htmlFor="isDefault">Definir como padrão</Label>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setUploadDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={uploadMutation.isPending}>
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Carregando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Carregar
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      {selectedSound && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Som</DialogTitle>
              <DialogDescription>
                Atualize as informações do som
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Nome do Som *</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={selectedSound.name}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Descrição</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    defaultValue={selectedSound.description || ""}
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-isActive"
                    name="isActive"
                    defaultChecked={selectedSound.isActive}
                  />
                  <Label htmlFor="edit-isActive">Ativo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-isDefault"
                    name="isDefault"
                    defaultChecked={selectedSound.isDefault}
                  />
                  <Label htmlFor="edit-isDefault">Padrão</Label>
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditDialogOpen(false);
                    setSelectedSound(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Alterações"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
