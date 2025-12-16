import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Music,
  Play,
  Save,
  RotateCcw,
  Loader2,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { notificationSoundService } from "@/services/notification-sound.service";
import { useNotificationSoundStore } from "@/stores/notificationSoundStore";

const NOTIFICATION_TYPES = [
  {
    value: "COMMENT",
    label: "💬 Comentário",
    description: "Quando alguém comenta no seu post",
  },
  {
    value: "REPLY",
    label: "↩️ Resposta",
    description: "Quando alguém responde seu comentário",
  },
  {
    value: "VOTE",
    label: "👍 Voto",
    description: "Quando alguém vota no seu conteúdo",
  },
  {
    value: "ACCEPTED",
    label: "✅ Aceite",
    description: "Quando sua resposta é aceita",
  },
  {
    value: "MENTION",
    label: "📢 Menção",
    description: "Quando alguém te menciona",
  },
  {
    value: "SYSTEM",
    label: "🔔 Sistema",
    description: "Notificações do sistema",
  },
];

export default function NotificationSoundsSettings() {
  const queryClient = useQueryClient();
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );

  const { enabled, volume, setEnabled, setVolume } =
    useNotificationSoundStore();

  // Fetch available sounds
  const { data: sounds, isLoading: isLoadingSounds } = useQuery({
    queryKey: ["notification-sounds"],
    queryFn: () => notificationSoundService.getAllSounds(true),
  });

  // Fetch user preferences
  const { data: preferences, isLoading: isLoadingPreferences } = useQuery({
    queryKey: ["user-sound-preferences"],
    queryFn: () => notificationSoundService.getUserPreferences(),
  });

  const [localPreferences, setLocalPreferences] = useState<
    Record<string, { soundId: string | null; enabled: boolean }>
  >({});

  // Initialize local preferences
  useEffect(() => {
    if (preferences) {
      const prefs: Record<
        string,
        { soundId: string | null; enabled: boolean }
      > = {};
      preferences.forEach((pref) => {
        prefs[pref.notificationType] = {
          soundId: pref.soundId,
          enabled: pref.enabled,
        };
      });
      setLocalPreferences(prefs);
    }
  }, [preferences]);

  // Save preferences mutation
  const saveMutation = useMutation({
    mutationFn: () => {
      const prefsArray = NOTIFICATION_TYPES.map((type) => ({
        notificationType: type.value,
        soundId: localPreferences[type.value]?.soundId || null,
        enabled: localPreferences[type.value]?.enabled ?? true,
      }));
      return notificationSoundService.batchUpdatePreferences(prefsArray);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-sound-preferences"] });
      toast.success("Preferências salvas com sucesso!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error?.message || "Erro ao salvar preferências"
      );
    },
  });

  // Reset preferences mutation
  const resetMutation = useMutation({
    mutationFn: () => notificationSoundService.resetPreferences(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-sound-preferences"] });
      toast.success("Preferências restauradas para o padrão!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error?.message || "Erro ao restaurar preferências"
      );
    },
  });

  const handleSoundChange = (
    notificationType: string,
    soundId: string | null
  ) => {
    setLocalPreferences((prev) => ({
      ...prev,
      [notificationType]: {
        soundId,
        enabled: prev[notificationType]?.enabled ?? true,
      },
    }));
  };

  const handleToggle = (notificationType: string, enabled: boolean) => {
    setLocalPreferences((prev) => ({
      ...prev,
      [notificationType]: {
        soundId: prev[notificationType]?.soundId || null,
        enabled,
      },
    }));
  };

  const handlePlaySound = async (soundUrl: string, soundId: string) => {
    if (playingSound === soundId) {
      audioElement?.pause();
      setPlayingSound(null);
      setAudioElement(null);
    } else {
      if (audioElement) {
        audioElement.pause();
      }

      try {
        const audio = new Audio(soundUrl);
        audio.volume = volume;

        audio.onerror = (error) => {
          console.error("Erro ao carregar áudio:", error);
          toast.error("Erro ao reproduzir som");
          setPlayingSound(null);
          setAudioElement(null);
        };

        audio.onended = () => {
          setPlayingSound(null);
          setAudioElement(null);
        };

        await audio.play();
        setPlayingSound(soundId);
        setAudioElement(audio);
      } catch (error) {
        console.error("Erro ao reproduzir:", error);
        toast.error("Erro ao reproduzir som");
        setPlayingSound(null);
        setAudioElement(null);
      }
    }
  };

  const handleSave = () => {
    saveMutation.mutate();
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Tem certeza que deseja restaurar as configurações padrão?"
      )
    ) {
      resetMutation.mutate();
    }
  };

  const defaultSound = sounds?.find((s) => s.isDefault);

  if (isLoadingSounds || isLoadingPreferences) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Sons de Notificação
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure sons personalizados para cada tipo de notificação
        </p>
      </div>

      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Configurações Gerais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable Sound */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sound-enabled" className="text-base">
                Sons de Notificação
              </Label>
              <p className="text-sm text-muted-foreground">
                Reproduzir som quando receber notificações
              </p>
            </div>
            <Switch
              id="sound-enabled"
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </div>

          {/* Volume Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="volume" className="text-base">
                Volume
              </Label>
              <span className="text-sm text-muted-foreground">
                {Math.round(volume * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <VolumeX className="h-4 w-4 text-muted-foreground" />
              <Slider
                id="volume"
                value={[volume]}
                onValueChange={([value]) => setVolume(value)}
                min={0}
                max={1}
                step={0.1}
                disabled={!enabled}
                className="flex-1"
              />
              <Volume2 className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sound Configuration by Type */}
      <Card>
        <CardHeader>
          <CardTitle>Sons por Tipo de Notificação</CardTitle>
          <CardDescription>
            Escolha um som diferente para cada tipo de notificação
            {defaultSound && ` (Som padrão: ${defaultSound.name})`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {NOTIFICATION_TYPES.map((type) => {
              const pref = localPreferences[type.value];
              const selectedSound =
                sounds?.find((s) => s.id === pref?.soundId) || defaultSound;

              return (
                <div
                  key={type.value}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  {/* Type Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">
                        {type.label}
                      </span>
                      <Switch
                        checked={pref?.enabled ?? true}
                        onCheckedChange={(checked) =>
                          handleToggle(type.value, checked)
                        }
                        disabled={!enabled}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {type.description}
                    </p>
                  </div>

                  {/* Sound Selector */}
                  <div className="flex items-center gap-2 min-w-[300px]">
                    <Select
                      value={pref?.soundId || "default"}
                      onValueChange={(value) =>
                        handleSoundChange(
                          type.value,
                          value === "default" ? null : value
                        )
                      }
                      disabled={!enabled || !(pref?.enabled ?? true)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Selecione um som" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">
                          Som Padrão {defaultSound && `(${defaultSound.name})`}
                        </SelectItem>
                        {sounds
                          ?.filter((s) => s.isActive)
                          .map((sound) => (
                            <SelectItem key={sound.id} value={sound.id}>
                              {sound.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    {/* Play Button */}
                    {selectedSound && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          handlePlaySound(
                            selectedSound.fileUrl,
                            selectedSound.id
                          )
                        }
                        disabled={!enabled || !(pref?.enabled ?? true)}
                      >
                        {playingSound === selectedSound.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={resetMutation.isPending || saveMutation.isPending}
        >
          {resetMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RotateCcw className="mr-2 h-4 w-4" />
          )}
          Restaurar Padrão
        </Button>

        <Button
          variant="gradient"
          onClick={handleSave}
          disabled={saveMutation.isPending || resetMutation.isPending}
        >
          {saveMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}
