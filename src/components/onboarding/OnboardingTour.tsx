import { useState, useEffect } from "react";
import Joyride, {
  CallBackProps,
  STATUS,
  Step,
  ACTIONS,
  EVENTS,
} from "react-joyride";
import onboardingService from "@/services/onboarding.service";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "@/hooks/use-toast";

/**
 * OnboardingTour
 * Componente de tour guiado para novos usuários
 */
export function OnboardingTour() {
  const { user } = useAuthStore();
  const [runTour, setRunTour] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  // Passos do tour
  const steps: Step[] = [
    {
      target: "body",
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Bem-vindo ao Alldev! 🎉
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Vamos fazer um tour rápido para você conhecer as principais
            funcionalidades da plataforma. Isso levará apenas alguns segundos!
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Você pode pular este tour a qualquer momento e reativá-lo nas
            configurações.
          </p>
        </div>
      ),
      placement: "center",
      disableBeacon: true,
    },
    {
      target: '[data-tour="create-post"]',
      content: (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Criar Post 📝
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Clique aqui para criar um novo post. Compartilhe suas dúvidas,
            conhecimentos ou tutoriais com a comunidade!
          </p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: '[data-tour="notifications"]',
      content: (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notificações 🔔
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Receba notificações quando alguém comentar em seus posts, responder
            seus comentários ou quando suas respostas forem aceitas.
          </p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: '[data-tour="user-menu"]',
      content: (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Seu Perfil 👤
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Acesse seu perfil, configurações e veja sua reputação. Aqui você
            também pode personalizar suas preferências.
          </p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: '[data-tour="search"]',
      content: (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Buscar 🔍
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Pesquise posts, tags e conteúdos. Use a busca para encontrar
            soluções ou discussões sobre temas específicos.
          </p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: '[data-tour="sidebar"]',
      content: (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tags e Filtros 🏷️
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Navegue por tags populares e filtre posts por tecnologias,
            linguagens ou tópicos do seu interesse.
          </p>
        </div>
      ),
      placement: "right",
    },
    {
      target: '[data-tour="post-actions"]',
      content: (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Votar e Interagir 👍👎
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Vote em posts e comentários para indicar se são úteis. Comente para
            contribuir com discussões e ajudar outros desenvolvedores.
          </p>
        </div>
      ),
      placement: "top",
    },
    {
      target: "body",
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Você está pronto! 🚀
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Agora você conhece as principais funcionalidades da plataforma.
            Divirta-se compartilhando conhecimento e aprendendo com a
            comunidade!
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            💡 Dica: Você pode reativar este tour a qualquer momento em
            Configurações → Ajuda → Tour Guiado
          </p>
        </div>
      ),
      placement: "center",
    },
  ];

  // Verifica se deve mostrar o tour ao carregar
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) return;

      try {
        const status = await onboardingService.getOnboardingStatus();
        if (!status.hasCompletedOnboarding) {
          // Aguarda um pouco para garantir que a página foi renderizada
          setTimeout(() => {
            setRunTour(true);
          }, 1000);
        }
      } catch (error) {
        console.error("Erro ao verificar status do onboarding:", error);
      }
    };

    checkOnboardingStatus();
  }, [user]);

  // Callback para eventos do tour
  const handleJoyrideCallback = async (data: CallBackProps) => {
    const { status, action, index, type } = data;

    // Atualiza o índice do step
    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    }

    // Quando o tour termina ou é pulado
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRunTour(false);
  
      try {
        if (status === STATUS.FINISHED) {
          await onboardingService.completeOnboarding();
          toast({
            title: "Tour concluído!",
            description:
              "Você pode reativá-lo a qualquer momento nas configurações.",
          });
        } else if (status === STATUS.SKIPPED) {
          await onboardingService.skipOnboarding();
        }
      } catch (error) {
        console.error("Erro ao finalizar onboarding:", error);
      }
    }
  };

  // Não renderiza se o usuário não está logado
  if (!user) {
    return null;
  }

  return (
    <Joyride
      steps={steps}
      run={runTour}
      stepIndex={stepIndex}
      continuous
      showProgress
      showSkipButton
      scrollToFirstStep
      scrollOffset={100}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: "#3b82f6",
          zIndex: 10000,
        },
        spotlight: {
          borderRadius: 8,
        },
        tooltip: {
          borderRadius: 12,
          padding: 20,
        },
        tooltipContainer: {
          textAlign: "left",
        },
        buttonNext: {
          backgroundColor: "#3b82f6",
          borderRadius: 8,
          padding: "10px 20px",
          fontSize: "14px",
          fontWeight: 600,
        },
        buttonBack: {
          color: "#6b7280",
          marginRight: 10,
        },
        buttonSkip: {
          color: "#9ca3af",
        },
      }}
      locale={{
        back: "Anterior",
        close: "Fechar",
        last: "Terminar",
        next: "Próximo",
        open: "Abrir",
        skip: "Pular tour",
      }}
    />
  );
}

/**
 * Hook para controlar o tour manualmente
 */
export function useOnboardingTour() {
  const [runTour, setRunTour] = useState(false);

  const startTour = async () => {
    try {
      await onboardingService.resetOnboarding();
      setRunTour(true);
      toast({
        title: "Tour iniciado!",
        description: "Vamos começar o tour guiado.",
      });
    } catch (error) {
      console.error("Erro ao iniciar tour:", error);
      toast({
        title: "Erro",
        description: "Não foi possível iniciar o tour.",
        variant: "destructive",
      });
    }
  };

  return {
    runTour,
    startTour,
  };
}
