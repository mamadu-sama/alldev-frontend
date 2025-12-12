import { Wrench, Clock } from 'lucide-react';
import { useMaintenanceStore } from '@/stores/maintenanceStore';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function MaintenancePage() {
  const { maintenanceMessage, estimatedEndTime } = useMaintenanceStore();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="relative flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <Wrench className="w-12 h-12 text-primary animate-bounce" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Em Manutenção</h1>
          <p className="text-muted-foreground text-lg">{maintenanceMessage}</p>
        </div>

        {estimatedEndTime && (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Clock className="w-5 h-5" />
            <span>
              Previsão de retorno:{' '}
              {formatDistanceToNow(new Date(estimatedEndTime), {
                addSuffix: true,
                locale: ptBR,
              })}
            </span>
          </div>
        )}

        <div className="pt-4">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Agradecemos sua paciência!</p>
          <p className="mt-1">
            Em caso de dúvidas, entre em contato:{' '}
            <a href="mailto:suporte@alldev.com" className="text-primary hover:underline">
              suporte@alldev.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
