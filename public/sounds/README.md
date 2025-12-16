# 🔊 Pasta de Sons de Notificação

## 📁 Objetivo

Esta pasta é destinada a armazenar arquivos de áudio customizados para notificações.

## 🎵 Como Adicionar Sons Customizados

### Método 1: Som Padrão

Adicione um arquivo chamado `notification.mp3` nesta pasta:

```
public/sounds/notification.mp3
```

Este será o som padrão quando o usuário ativar "Usar Som do Sistema" nas configurações.

### Método 2: Sons Múltiplos (Futuro)

Você pode adicionar diferentes sons para diferentes tipos de notificações:

```
public/sounds/
├── notification.mp3      # Som padrão
├── comment.mp3          # Som para comentários
├── reply.mp3            # Som para respostas
├── vote.mp3             # Som para votos
├── accepted.mp3         # Som para resposta aceita
└── system.mp3           # Som do sistema
```

**Nota:** A implementação atual usa apenas `notification.mp3`. O suporte para múltiplos arquivos pode ser adicionado no futuro.

## 🎼 Especificações Recomendadas

### Formato
- **Formato:** MP3, WAV, ou OGG
- **Recomendado:** MP3 (melhor compatibilidade)

### Qualidade
- **Bitrate:** 128-192 kbps (suficiente para sons curtos)
- **Taxa de amostragem:** 44.1 kHz ou 48 kHz
- **Canais:** Mono ou Stereo

### Duração
- **Mínimo:** 0.1 segundos
- **Recomendado:** 0.3 - 1.0 segundos
- **Máximo:** 2.0 segundos (evite sons muito longos)

### Tamanho
- **Recomendado:** < 50 KB
- **Máximo:** < 200 KB

## 🎨 Dicas de Design de Som

### Características Ideais
1. **Curto e Discreto:** Sons breves são menos intrusivos
2. **Tom Médio:** Evite frequências muito altas ou baixas
3. **Início Suave:** Evite cliques ou pops no início
4. **Final Limpo:** Fade out suave no final
5. **Volume Moderado:** Nem muito alto, nem muito baixo

### O Que Evitar
- ❌ Sons muito longos (> 2 segundos)
- ❌ Música ou melodias complexas
- ❌ Vozes ou palavras
- ❌ Sons muito altos ou agressivos
- ❌ Arquivos muito grandes

## 🔨 Ferramentas Recomendadas

### Editores de Áudio
- **Audacity** (Grátis) - Edição básica
- **GarageBand** (Mac, Grátis) - Produção
- **Adobe Audition** (Pago) - Profissional

### Bibliotecas de Sons Grátis
- **Freesound.org** - Sons Creative Commons
- **ZapSplat** - Efeitos sonoros grátis
- **SoundBible** - Biblioteca de sons livres

### Geradores Online
- **SFXR** - Gerador de efeitos sonoros
- **Bfxr** - Efeitos sonoros 8-bit
- **ChipTone** - Sons de notificação

## 📦 Exemplos de Sons

### Som de Notificação Clássico
```
Duração: 0.4s
Formato: MP3
Tamanho: 12 KB
Descrição: Duas notas suaves (F#5 → A5)
```

### Som de Sucesso
```
Duração: 0.6s
Formato: MP3
Tamanho: 18 KB
Descrição: Três notas ascendentes (C5 → E5 → G5)
```

### Som de Alerta
```
Duração: 0.5s
Formato: MP3
Tamanho: 15 KB
Descrição: Duas notas repetidas (A4)
```

## 🚀 Como Usar

### 1. Adicionar o Arquivo

Copie seu arquivo `notification.mp3` para esta pasta:

```bash
cp seu-som.mp3 public/sounds/notification.mp3
```

### 2. Ativar nas Configurações

1. Acesse `/settings` no aplicativo
2. Vá para a aba "Notificações"
3. Ative "Usar Som do Sistema"
4. Clique em "Testar Som"

### 3. Verificar

O sistema tentará reproduzir o arquivo. Se houver erro, voltará automaticamente para os sons gerados.

## 🔧 Fallback

Se o arquivo não for encontrado ou houver erro:
- ✅ O sistema usará sons gerados (Web Audio API)
- ✅ Nenhum erro será mostrado ao usuário
- ✅ A experiência continua funcionando normalmente

## 📝 Exemplo de Código

### HTML Audio Tag (Teste)
```html
<audio src="/sounds/notification.mp3" preload="auto"></audio>
```

### JavaScript (Como o sistema usa)
```javascript
const audio = new Audio('/sounds/notification.mp3');
audio.volume = 0.5; // 50% volume
audio.play().catch(error => {
  console.error('Erro ao tocar som:', error);
  // Fallback para som gerado
});
```

## 🎯 Status Atual

- ✅ Sistema implementado
- ✅ Suporte para arquivo único (`notification.mp3`)
- ✅ Fallback para sons gerados
- ⏸️ Suporte para múltiplos arquivos (futuro)
- ⏸️ Upload via UI (futuro)

## 📚 Referências

- [MDN Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [HTML Audio Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio)
- [Freesound](https://freesound.org/)

## 🆘 Problemas Comuns

### Som não toca
**Problema:** Arquivo não encontrado
**Solução:** Verifique se o arquivo está em `public/sounds/notification.mp3`

**Problema:** Formato não suportado
**Solução:** Use MP3, WAV ou OGG

### Som cortado
**Problema:** Arquivo corrompido
**Solução:** Re-exporte o arquivo com um editor de áudio

### Som muito alto/baixo
**Problema:** Normalização incorreta
**Solução:** Ajuste o volume nas configurações ou normalize o arquivo

## 💡 Dica Pro

Para melhor experiência:
1. Use sons de 0.5-1.0 segundos
2. Normalize o volume para -6dB
3. Teste em diferentes dispositivos
4. Considere o contexto de uso (escritório, casa)

---

**Nota:** Esta pasta é pública e os arquivos serão acessíveis via HTTP.
Não adicione arquivos sensíveis ou com copyright aqui.

🎵 Divirta-se criando sons incríveis! 🎵

