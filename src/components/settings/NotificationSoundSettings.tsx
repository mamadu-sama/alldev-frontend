import { Volume2, VolumeX, Music } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useNotificationSoundStore } from '@/stores/notificationSoundStore';
import { useNotificationSound } from '@/hooks/useNotificationSound';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function NotificationSoundSettings() {
  const {
    enabled,
    volume,
    useSystemSound,
    soundType,
    setEnabled,
    setVolume,
    setUseSystemSound,
    setSoundType,
  } = useNotificationSoundStore();

  const { testSound } = useNotificationSound();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Configurações de Som
        </CardTitle>
        <CardDescription>
          Personalize os sons das notificações
        </CardDescription>
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

        {/* Sound Type */}
        <div className="space-y-3">
          <Label htmlFor="sound-type" className="text-base">
            Tipo de Som
          </Label>
          <Select value={soundType} onValueChange={setSoundType} disabled={!enabled}>
            <SelectTrigger id="sound-type">
              <SelectValue placeholder="Selecione o tipo de som" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Padrão</SelectItem>
              <SelectItem value="success">Sucesso</SelectItem>
              <SelectItem value="message">Mensagem</SelectItem>
              <SelectItem value="warning">Aviso</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Use System Sound */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="system-sound" className="text-base">
              Usar Som do Sistema
            </Label>
            <p className="text-sm text-muted-foreground">
              Usar arquivo de áudio em vez de som gerado
            </p>
          </div>
          <Switch
            id="system-sound"
            checked={useSystemSound}
            onCheckedChange={setUseSystemSound}
            disabled={!enabled}
          />
        </div>

        {/* Test Sound Button */}
        <div className="pt-4 border-t">
          <Button
            variant="outline"
            onClick={testSound}
            disabled={!enabled}
            className="w-full"
          >
            <Volume2 className="mr-2 h-4 w-4" />
            Testar Som
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Clique para ouvir como ficará o som das notificações
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

