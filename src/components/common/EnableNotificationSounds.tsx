import { useState, useEffect } from "react";
import { Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNotificationSoundStore } from "@/stores/notificationSoundStore";

/**
 * Component to enable notification sounds after user interaction
 * This is required by browser autoplay policies
 */
export function EnableNotificationSounds() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const { enabled } = useNotificationSoundStore();

  useEffect(() => {
    // Check if user has already interacted with audio
    const audioInteractionKey = "audio_interaction_enabled";
    const hasAudioInteraction = localStorage.getItem(audioInteractionKey);

    if (!hasAudioInteraction && enabled && !hasInteracted) {
      // Show prompt after 2 seconds to not be intrusive
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [enabled, hasInteracted]);

  const handleEnable = async () => {
    try {
      // Create a silent audio context to "unlock" audio
      const AudioCtor = (window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext) as typeof AudioContext;
      const audioContext = new AudioCtor();

      // Play a silent sound to unlock
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0; // Silent
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start(0);
      oscillator.stop(0.001);

      // Mark as interacted
      localStorage.setItem("audio_interaction_enabled", "true");
      setHasInteracted(true);
      setShowPrompt(false);

      // Also try to resume if suspended
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      console.log("✅ Sons de notificação ativados!");
    } catch (error) {
      console.error("Erro ao ativar sons:", error);
      // Still mark as interacted to not show again
      localStorage.setItem("audio_interaction_enabled", "true");
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    // Remember dismissal for this session
    sessionStorage.setItem("audio_prompt_dismissed", "true");
    setShowPrompt(false);
  };

  if (!showPrompt || !enabled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5">
      <Card className="p-4 shadow-lg border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <Volume2 className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">
              Ativar Sons de Notificação
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Clique para permitir que sons sejam reproduzidos automaticamente
              quando você receber notificações.
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleEnable} className="flex-1">
                Ativar
              </Button>
              <Button size="sm" variant="ghost" onClick={handleDismiss}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
