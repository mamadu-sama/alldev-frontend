# 🔊 Sistema de Som de Notificação

Sistema completo de sons para notificações do alldev-community-hub.

## 🚀 Início Rápido

### Uso Básico

```typescript
import { useNotificationSound } from '@/hooks/useNotificationSound';

function MyComponent() {
  const { playSound } = useNotificationSound();
  
  // Tocar som
  playSound('COMMENT');
  
  return <button onClick={() => playSound()}>🔔</button>;
}
```

### Configurações do Usuário

O componente de configurações já está pronto para uso:

```typescript
import { NotificationSoundSettings } from '@/components/settings/NotificationSoundSettings';

function SettingsPage() {
  return <NotificationSoundSettings />;
}
```

## 📁 Estrutura de Arquivos

```
alldev-frontend/
├── src/
│   ├── hooks/
│   │   └── useNotificationSound.ts       # Hook principal
│   ├── stores/
│   │   └── notificationSoundStore.ts     # Estado global
│   ├── utils/
│   │   └── generateNotificationSound.ts  # Gerador de sons
│   ├── components/
│   │   └── settings/
│   │       └── NotificationSoundSettings.tsx  # UI de configurações
│   └── pages/
│       ├── UserSettings.tsx              # Página de configurações
│       └── Notifications.tsx             # Integrado com som
└── public/
    └── sounds/
        └── notification.mp3              # Som customizado (opcional)
```

## ✨ Features

- ✅ Som automático ao receber notificações
- ✅ Controle de volume (0-100%)
- ✅ Múltiplos tipos de sons
- ✅ Sons gerados (Web Audio API) ou arquivos
- ✅ Botão de teste de som
- ✅ Rate limiting (evita spam)
- ✅ Persistência de configurações
- ✅ UI completa de configurações

## 🎵 Tipos de Som

| Tipo | Som | Uso |
|------|-----|-----|
| `COMMENT` | Double Beep | Comentários |
| `REPLY` | Double Beep | Respostas |
| `VOTE` | Single Beep | Votos |
| `ACCEPTED` | Success | Resposta aceita |
| `SYSTEM` | Warning | Sistema |
| `MENTION` | Double Beep | Menções |

## ⚙️ API Rápida

### Hook `useNotificationSound`

```typescript
const {
  playSound,      // (type?) => void - Toca som
  testSound,      // () => void - Testa configurações
  requestPermission, // () => Promise<boolean> - Pede permissão
  enabled,        // boolean - Estado do som
  volume,         // number - Volume atual
} = useNotificationSound();
```

### Store `useNotificationSoundStore`

```typescript
const {
  enabled,           // boolean
  volume,            // number (0-1)
  useSystemSound,    // boolean
  soundType,         // NotificationSoundType
  toggleSound,       // () => void
  setEnabled,        // (enabled: boolean) => void
  setVolume,         // (volume: number) => void
  setUseSystemSound, // (use: boolean) => void
  setSoundType,      // (type: NotificationSoundType) => void
} = useNotificationSoundStore();
```

## 🎯 Integração nos Componentes

### Header (Já integrado)

```typescript
// Som toca automaticamente quando novas notificações chegam
const { playSound } = useNotificationSound();

useEffect(() => {
  if (newNotification) {
    playSound(newNotification.type);
  }
}, [newNotification]);
```

### Página de Notificações (Já integrado)

```typescript
// Botão para ativar/desativar som
<Button onClick={toggleSound}>
  {soundEnabled ? <Volume2 /> : <VolumeX />}
</Button>
```

## 🛠️ Personalização

### Adicionar Som Customizado

1. Adicione arquivo MP3 em `/public/sounds/notification.mp3`
2. Ative "Usar Som do Sistema" nas configurações
3. Pronto! 🎉

### Criar Novo Tipo de Som

```typescript
// Em generateNotificationSound.ts
playCustomSound() {
  const ctx = this.getAudioContext();
  // Sua lógica de som aqui
}
```

## 🔍 Onde Está Integrado

- ✅ **Header**: Som ao receber notificações (polling 30s)
- ✅ **Notifications Page**: Controle manual + som automático
- ✅ **User Settings**: Página completa de configurações

## 📱 Navegação

- `/settings` - Configurações do usuário (inclui som)
- `/notifications` - Página de notificações com controle de som

## 🐛 Troubleshooting

**Som não toca?**
- Verifique se está ativado nas configurações
- Verifique volume do navegador
- Alguns navegadores bloqueiam autoplay - interaja com a página primeiro

**Som com delay?**
- Rate limiting ativo (500ms entre sons)
- Normal e esperado para evitar spam

## 📚 Documentação Completa

Veja [NOTIFICATION_SOUND_SYSTEM.md](./docs/NOTIFICATION_SOUND_SYSTEM.md) para documentação detalhada.

## 🎨 Exemplos Práticos

### Tocar som em evento customizado

```typescript
const { playSound } = useNotificationSound();

const handleCustomEvent = () => {
  playSound('success');
  toast.success('Ação concluída!');
};
```

### Desabilitar som temporariamente

```typescript
const { setEnabled } = useNotificationSoundStore();

const doSilentOperation = async () => {
  setEnabled(false);
  await someOperation();
  setEnabled(true);
};
```

## 🚦 Status

- ✅ Sistema base implementado
- ✅ UI de configurações
- ✅ Integração com notificações
- ✅ Documentação completa
- ✅ Rate limiting
- ✅ Persistência

## 🎉 Pronto para Usar!

O sistema está completamente funcional e integrado. Os usuários podem:

1. Receber sons de notificação automaticamente
2. Configurar volume e tipo de som
3. Ativar/desativar facilmente
4. Testar sons antes de salvar

---

Desenvolvido com ❤️ para alldev-community-hub

