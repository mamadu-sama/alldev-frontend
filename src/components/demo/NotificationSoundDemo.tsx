import { useState } from 'react';
import { Volume2, Bell, MessageSquare, ThumbsUp, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotificationSound } from '@/hooks/useNotificationSound';
import { useNotificationSoundStore } from '@/stores/notificationSoundStore';

interface SoundDemo {
  type: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const soundDemos: SoundDemo[] = [
  {
    type: 'COMMENT',
    label: 'Comentário',
    description: 'Som quando alguém comenta no seu post',
    icon: <MessageSquare className="h-5 w-5" />,
    color: 'text-blue-500',
  },
  {
    type: 'REPLY',
    label: 'Resposta',
    description: 'Som quando alguém responde seu comentário',
    icon: <MessageSquare className="h-5 w-5" />,
    color: 'text-purple-500',
  },
  {
    type: 'VOTE',
    label: 'Voto',
    description: 'Som quando alguém vota no seu conteúdo',
    icon: <ThumbsUp className="h-5 w-5" />,
    color: 'text-green-500',
  },
  {
    type: 'ACCEPTED',
    label: 'Resposta Aceita',
    description: 'Som quando sua resposta é aceita',
    icon: <CheckCircle className="h-5 w-5" />,
    color: 'text-emerald-500',
  },
  {
    type: 'SYSTEM',
    label: 'Sistema',
    description: 'Som de notificações do sistema',
    icon: <Bell className="h-5 w-5" />,
    color: 'text-orange-500',
  },
  {
    type: 'warning',
    label: 'Aviso',
    description: 'Som para avisos importantes',
    icon: <AlertTriangle className="h-5 w-5" />,
    color: 'text-yellow-500',
  },
];

export function NotificationSoundDemo() {
  const { playSound, enabled, volume } = useNotificationSound();
  const { toggleSound } = useNotificationSoundStore();
  const [lastPlayed, setLastPlayed] = useState<string | null>(null);

  const handlePlaySound = (type: string) => {
    playSound(type as any);
    setLastPlayed(type);
    
    // Reset last played after animation
    setTimeout(() => setLastPlayed(null), 1000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Demonstração de Sons
            </CardTitle>
            <CardDescription>
              Teste os diferentes sons de notificação disponíveis
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={enabled ? 'default' : 'secondary'}>
              {enabled ? 'Ativado' : 'Desativado'}
            </Badge>
            <Badge variant="outline">
              Vol: {Math.round(volume * 100)}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!enabled && (
          <div className="p-4 bg-muted rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-2">
              Os sons estão desativados. Ative para testar.
            </p>
            <Button size="sm" onClick={toggleSound}>
              Ativar Sons
            </Button>
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-2">
          {soundDemos.map((demo) => (
            <div
              key={demo.type}
              className={`p-4 rounded-lg border transition-all ${
                lastPlayed === demo.type
                  ? 'bg-primary/10 border-primary scale-105'
                  : 'bg-card border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`${demo.color} shrink-0 mt-1`}>
                  {demo.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-foreground mb-1">
                    {demo.label}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    {demo.description}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePlaySound(demo.type)}
                    disabled={!enabled}
                    className="w-full"
                  >
                    <Volume2 className="mr-2 h-3 w-3" />
                    Testar Som
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium text-sm mb-2">💡 Dicas</h4>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>• Os sons tocam automaticamente quando você recebe notificações</li>
            <li>• Ajuste o volume nas configurações para sua preferência</li>
            <li>• Sons diferentes indicam tipos diferentes de notificações</li>
            <li>• Rate limiting previne múltiplos sons simultâneos</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

