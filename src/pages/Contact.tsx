import { useState } from "react";
import {
  Mail,
  MessageSquare,
  HelpCircle,
  Bug,
  Lightbulb,
  Shield,
  Send,
  MapPin,
  Clock,
  Github,
  Twitter,
  Linkedin,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { contactService } from "@/services/contact.service";
import type { ContactData } from "@/services/contact.service";

const contactReasons = [
  { value: "general", label: "Dúvida Geral", icon: HelpCircle },
  { value: "bug", label: "Reportar Bug", icon: Bug },
  { value: "suggestion", label: "Sugestão de Melhoria", icon: Lightbulb },
  { value: "security", label: "Problema de Segurança", icon: Shield },
  { value: "partnership", label: "Parceria/Comercial", icon: MessageSquare },
  { value: "press", label: "Imprensa", icon: Mail },
];

const faqItems = [
  {
    question: "Como posso redefinir minha senha?",
    answer:
      'Acesse a página de login e clique em "Esqueci minha senha". Enviaremos um link de redefinição para o e-mail cadastrado.',
  },
  {
    question: "Como faço para excluir minha conta?",
    answer:
      "Acesse Configurações > Conta > Excluir conta. O processo leva até 30 dias para ser concluído.",
  },
  {
    question: "Posso mudar meu nome de usuário?",
    answer:
      "Sim, você pode alterar seu nome de usuário uma vez a cada 30 dias nas configurações do perfil.",
  },
  {
    question: "Como reportar um conteúdo inadequado?",
    answer:
      'Clique no ícone de três pontos (...) ao lado do conteúdo e selecione "Reportar". Nossa equipe analisará em até 24 horas.',
  },
  {
    question: "Quanto tempo leva para receber uma resposta?",
    answer:
      "Respondemos a maioria das solicitações em até 2 dias úteis. Questões de segurança têm prioridade máxima.",
  },
  {
    question: "A Alldev é gratuita?",
    answer:
      "Sim! A Alldev é 100% gratuita para uso. Não há planos pagos ou funcionalidades premium.",
  },
];

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    reason: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (
      !formData.name ||
      !formData.email ||
      !formData.reason ||
      !formData.subject ||
      !formData.message
    ) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await contactService.sendMessage({
        name: formData.name,
        email: formData.email,
        reason: formData.reason as ContactData["reason"],
        subject: formData.subject,
        message: formData.message,
        website: "", // Honeypot field (deve estar vazio)
      });

      toast({
        title: "Mensagem enviada!",
        description: "Recebemos sua mensagem e responderemos em breve.",
      });

      // Limpar formulário
      setFormData({
        name: "",
        email: "",
        reason: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error && "response" in error
          ? (
              error as {
                response?: { data?: { error?: { message?: string } } };
              }
            ).response?.data?.error?.message
          : "Não foi possível enviar a mensagem.";

      toast({
        title: "Erro ao enviar mensagem",
        description:
          errorMessage || "Ocorreu um erro. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-6xl py-8 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-primary/10">
            <Mail className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">Fale Conosco</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Estamos aqui para ajudar! Entre em contato conosco para dúvidas,
          sugestões ou qualquer outra questão.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Envie sua Mensagem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo *</Label>
                    <Input
                      id="name"
                      placeholder="Seu nome"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Motivo do contato *</Label>
                  <Select
                    value={formData.reason}
                    onValueChange={(value) =>
                      setFormData({ ...formData, reason: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um motivo" />
                    </SelectTrigger>
                    <SelectContent>
                      {contactReasons.map((reason) => (
                        <SelectItem key={reason.value} value={reason.value}>
                          <div className="flex items-center gap-2">
                            <reason.icon className="h-4 w-4" />
                            {reason.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto *</Label>
                  <Input
                    id="subject"
                    placeholder="Resumo da sua mensagem"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem *</Label>
                  <Textarea
                    id="message"
                    placeholder="Descreva sua dúvida, sugestão ou problema em detalhes..."
                    rows={6}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Mensagem
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          {/* Quick Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contato Rápido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">E-mail Geral</p>
                  <a
                    href="mailto:geral@alldev.pt"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    geral@alldev.pt
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Segurança</p>
                  <a
                    href="mailto:security@alldev.com.br"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    security@alldev.pt
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Privacidade/LGPD</p>
                  <a
                    href="mailto:privacidade@alldev.pt"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    privacidade@alldev.pt
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Localização</p>
                  <p className="text-sm text-muted-foreground">
                    Castelo Branco - Portugal
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Horário de Atendimento</p>
                  <p className="text-sm text-muted-foreground">
                    Segunda a Sexta, 9h às 18h (PT)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Redes Sociais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <a
                  href="https://github.com/mamadu-sama/alldev-community-hub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-10 w-10 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com/alldev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-10 w-10 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com/company/alldev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-10 w-10 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Response Time */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold">Tempo médio de resposta</p>
                  <p className="text-sm text-muted-foreground">
                    Até 2 dias úteis
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="mt-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Perguntas Frequentes</h2>
          <p className="text-muted-foreground">
            Antes de enviar uma mensagem, confira se sua dúvida já foi
            respondida.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {faqItems.map((item, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 flex items-start gap-2">
                  <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  {item.question}
                </h3>
                <p className="text-sm text-muted-foreground pl-7">
                  {item.answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Emergency Security */}
      <section className="mt-12">
        <Card className="bg-destructive/5 border-destructive/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Shield className="h-8 w-8 text-destructive flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2">
                  Reportar Vulnerabilidade de Segurança
                </h3>
                <p className="text-muted-foreground mb-4">
                  Se você descobriu uma vulnerabilidade de segurança em nossa
                  plataforma, por favor reporte diretamente para nossa equipe de
                  segurança. Não publique informações sobre vulnerabilidades
                  publicamente.
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  <a
                    href="mailto:security@alldev.pt"
                    className="text-primary hover:underline font-medium"
                  >
                    security@alldev.pt
                  </a>
                  <Badge variant="secondary">Resposta em até 24 horas</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
