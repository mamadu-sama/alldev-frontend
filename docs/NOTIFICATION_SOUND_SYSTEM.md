# Sistema de Som de Notificação

Este documento descreve o sistema completo de som de notificação implementado no alldev-community-hub.

## Visão Geral

O sistema de som de notificação fornece feedback auditivo quando o usuário recebe novas notificações. Ele é totalmente configurável e oferece diferentes tipos de sons para diferentes tipos de notificações.

## Arquitetura

### Componentes Principais

1. **NotificationSoundGenerator** (`utils/generateNotificationSound.ts`)

   - Gera sons usando a Web Audio API
   - Fornece diferentes tipos de sons (beep, success, warning, error)
   - Não requer arquivos de áudio externos

2. **useNotificationSoundStore** (`stores/notificationSoundStore.ts`)

   - Gerencia o estado das configurações de som
   - Persiste as preferências do usuário no localStorage
   - Configurações disponíveis:
     - `enabled`: Ativa/desativa sons
     - `volume`: Controla o volume (0-1)
     - `useSystemSound`: Usa arquivos de áudio vs sons gerados
     - `soundType`: Tipo de som padrão

3. **useNotificationSound** (`hooks/useNotificationSound.ts`)

   - Hook customizado para tocar sons
   - Implementa rate limiting (mínimo 500ms entre sons)
   - Suporta diferentes tipos de notificações
   - Fornece função de teste de som

4. **NotificationSoundSettings** (`components/settings/NotificationSoundSettings.tsx`)
   - Componente UI para configurações de som
   - Permite ao usuário personalizar todas as opções
   - Inclui botão de teste de som

## Uso

### Integração Básica

```typescript
import { useNotificationSound } from "@/hooks/useNotificationSound";

function MyComponent() {
  const { playSound } = useNotificationSound();

  const handleNewNotification = (notification) => {
    // Toca som baseado no tipo de notificação
    playSound(notification.type);
  };

  return <div>...</div>;
}
```

### Tipos de Notificação Suportados

- `COMMENT`: Comentário em um post
- `REPLY`: Resposta a um comentário
- `VOTE`: Voto em conteúdo
- `ACCEPTED`: Resposta aceita
- `SYSTEM`: Notificação do sistema
- `MENTION`: Menção em comentário

### Sons Gerados

O sistema pode gerar os seguintes sons:

1. **Simple Beep** (`playSimpleBeep`)

   - Frequência: 800Hz (padrão)
   - Duração: 150ms (padrão)
   - Usado para notificações gerais

2. **Double Beep** (`playDoubleBeep`)

   - Dois beeps consecutivos (800Hz e 1000Hz)
   - Usado para mensagens, comentários e respostas

3. **Success** (`playSuccess`)

   - Tom ascendente (C5 -> E5)
   - Usado para respostas aceitas

4. **Warning** (`playWarning`)

   - Dois beeps de 600Hz
   - Usado para avisos do sistema

5. **Error** (`playError`)
   - Som de 400Hz com onda quadrada
   - Usado para notificações urgentes

## Configurações do Usuário

### Através da UI

Os usuários podem configurar o som através da página de configurações (`/settings`):

1. **Ativar/Desativar Sons**: Toggle principal
2. **Volume**: Slider de 0-100%
3. **Tipo de Som**: Seleção do som padrão
4. **Usar Som do Sistema**: Opção para usar arquivos de áudio personalizados
5. **Testar Som**: Botão para testar configurações

### Através do Código

```typescript
import { useNotificationSoundStore } from "@/stores/notificationSoundStore";

function MyComponent() {
  const { enabled, setEnabled, volume, setVolume, toggleSound } =
    useNotificationSoundStore();

  return (
    <button onClick={toggleSound}>
      {enabled ? "Desativar Som" : "Ativar Som"}
    </button>
  );
}
```

## Integração com Componentes Existentes

### Header.tsx

O header monitora novas notificações e toca som automaticamente:

```typescript
const { playSound } = useNotificationSound();
const previousUnreadCountRef = useRef<number>(0);

useEffect(() => {
  if (unreadNotifications > previousUnreadCountRef.current) {
    const latestNotification = notifications.find((n) => !n.read);
    if (latestNotification) {
      playSound(latestNotification.type);
    }
  }
  previousUnreadCountRef.current = unreadNotifications;
}, [unreadNotifications, notifications, playSound]);
```

### Notifications.tsx

Página de notificações com controle de som integrado:

- Botão para ativar/desativar som no header
- Som toca ao receber novas notificações
- Ícone visual indica estado do som (Volume2/VolumeX)

## Rate Limiting

O sistema implementa rate limiting para evitar sobrecarga de sons:

- Mínimo de 500ms entre sons
- Previne múltiplos sons tocando simultaneamente
- Melhora a experiência do usuário

## Tratamento de Erros

Todos os métodos de reprodução de som incluem tratamento de erros:

```typescript
try {
  // Play sound logic
} catch (error) {
  console.error("Error playing notification sound:", error);
  // Fallback silencioso - não interrompe a aplicação
}
```

## Permissões de Navegador

Alguns navegadores requerem interação do usuário antes de reproduzir áudio:

```typescript
const { requestPermission } = useNotificationSound();

// Chamar após ação do usuário (ex: clique)
await requestPermission();
```

## Arquivos de Áudio Customizados

Para usar arquivos de áudio customizados:

1. Adicione o arquivo em `/public/sounds/notification.mp3`
2. Ative "Usar Som do Sistema" nas configurações
3. O sistema tentará usar o arquivo, com fallback para sons gerados

## Compatibilidade

- ✅ Chrome/Edge (Web Audio API)
- ✅ Firefox (Web Audio API)
- ✅ Safari (Web Audio API)
- ✅ Mobile browsers (com limitações de autoplay)

## Persistência

As configurações são persistidas no localStorage usando Zustand persist middleware:

- Chave: `notification-sound-settings`
- As preferências são mantidas entre sessões
- Reset automático para padrões se corrupto

## Exemplos de Uso

### Exemplo 1: Componente com Som

```typescript
import { useNotificationSound } from "@/hooks/useNotificationSound";

function NotificationButton() {
  const { playSound, testSound } = useNotificationSound();

  return <button onClick={testSound}>Testar Som</button>;
}
```

### Exemplo 2: Configurações Personalizadas

```typescript
import { useNotificationSoundStore } from "@/stores/notificationSoundStore";

function CustomSettings() {
  const { volume, setVolume, enabled, toggleSound } =
    useNotificationSoundStore();

  return (
    <div>
      <button onClick={toggleSound}>{enabled ? "Desativar" : "Ativar"}</button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
      />
    </div>
  );
}
```

### Exemplo 3: Som em Tempo Real

```typescript
import { useNotificationSound } from "@/hooks/useNotificationSound";
import { useQuery } from "@tanstack/react-query";

function RealTimeNotifications() {
  const { playSound } = useNotificationSound();
  const previousCount = useRef(0);

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    refetchInterval: 30000,
  });

  useEffect(() => {
    const currentCount = data?.unreadCount || 0;
    if (currentCount > previousCount.current) {
      playSound("SYSTEM");
    }
    previousCount.current = currentCount;
  }, [data?.unreadCount, playSound]);

  return <div>...</div>;
}
```

## Troubleshooting

### Som não toca

1. Verifique se está habilitado nas configurações
2. Verifique o volume (não está em 0)
3. Verifique permissões do navegador
4. Verifique console para erros

### Som muito alto/baixo

- Ajuste o slider de volume nas configurações
- Volume é aplicado tanto para sons gerados quanto arquivos

### Som com delay

- Rate limiting pode estar ativo (500ms mínimo)
- Verifique performance do navegador
- Considere reduzir intervalo de polling

## Próximos Passos

Possíveis melhorias futuras:

1. ✨ Mais tipos de sons personalizados
2. 🎵 Upload de arquivos de áudio personalizados
3. 📱 Notificações push nativas
4. 🔔 Sons diferentes por tipo de notificação
5. 🎛️ Equalizer/controles avançados
6. 📊 Analytics de uso de sons

## Conclusão

O sistema de som de notificação oferece uma experiência rica e configurável para feedback auditivo. É projetado para ser:

- ✅ Fácil de usar
- ✅ Totalmente configurável
- ✅ Performático
- ✅ Acessível
- ✅ Extensível

Para questões ou sugestões, abra uma issue no repositório.
