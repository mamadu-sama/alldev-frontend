import { useState } from "react";
import { Flag, Loader2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { reportService, CreateReportData } from "@/services/report.service";
import { useAuthStore } from "@/stores/authStore";

interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: "post" | "comment";
  contentId: string;
  contentTitle?: string; // For posts
  contentPreview?: string; // For comments
}

const reportReasons = [
  { value: "SPAM", label: "Spam", description: "Conteúdo promocional não solicitado" },
  { value: "INAPPROPRIATE", label: "Inapropriado", description: "Conteúdo fora do contexto ou inadequado" },
  { value: "OFFENSIVE", label: "Ofensivo", description: "Linguagem ofensiva ou desrespeitosa" },
  { value: "MISINFORMATION", label: "Desinformação", description: "Informações falsas ou enganosas" },
  { value: "OTHER", label: "Outro", description: "Outro tipo de violação" },
];

export function ReportDialog({
  isOpen,
  onClose,
  contentType,
  contentId,
  contentTitle,
  contentPreview,
}: ReportDialogProps) {
  const { toast } = useToast();
  const { isAuthenticated } = useAuthStore();
  const [reason, setReason] = useState<CreateReportData["reason"] | "">("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Autenticação necessária",
        description: "Você precisa estar logado para denunciar conteúdo.",
        variant: "destructive",
      });
      onClose();
      return;
    }

    if (!reason) {
      toast({
        title: "Motivo obrigatório",
        description: "Por favor, selecione um motivo para a denúncia.",
        variant: "destructive",
      });
      return;
    }

    if (description.length < 10) {
      toast({
        title: "Descrição muito curta",
        description: "A descrição deve ter no mínimo 10 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const reportData: CreateReportData = {
        reason: reason as CreateReportData["reason"],
        description,
        ...(contentType === "post" ? { postId: contentId } : { commentId: contentId }),
      };

      await reportService.createReport(reportData);

      toast({
        title: "Denúncia enviada!",
        description: "Obrigado por ajudar a manter a comunidade segura. Nossa equipe irá analisar em breve.",
      });

      // Reset and close
      setReason("");
      setDescription("");
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { error?: { message?: string } } } }).response?.data?.error?.message
          : "Não foi possível enviar a denúncia.";

      toast({
        title: "Erro ao enviar denúncia",
        description: errorMessage || "Ocorreu um erro. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setReason("");
      setDescription("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-destructive" />
            Denunciar {contentType === "post" ? "Post" : "Comentário"}
          </DialogTitle>
          <DialogDescription>
            Nos ajude a manter a comunidade segura reportando conteúdo que viola nossas diretrizes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Content preview */}
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm font-medium mb-1">
              {contentType === "post" ? "Post:" : "Comentário:"}
            </p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {contentType === "post" ? contentTitle : contentPreview}
            </p>
          </div>

          {/* Reason select */}
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo da denúncia *</Label>
            <Select value={reason} onValueChange={(value) => setReason(value as CreateReportData["reason"])}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Selecione um motivo" />
              </SelectTrigger>
              <SelectContent>
                {reportReasons.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{r.label}</span>
                      <span className="text-xs text-muted-foreground">{r.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              placeholder="Descreva o problema em detalhes (mínimo 10 caracteres)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              disabled={isSubmitting}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {description.length}/500 caracteres
            </p>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 rounded-lg bg-amber-500/10 p-3 text-sm">
            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-amber-900 dark:text-amber-200">
              <strong>Importante:</strong> Denúncias falsas ou abusivas podem resultar em suspensão da conta.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={isSubmitting || !reason || description.length < 10}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Flag className="h-4 w-4 mr-2" />
                Enviar Denúncia
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

