import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Cliente } from "@/types/financial";
import { formatCurrency } from "@/utils/mockData";
import { MessageSquare, Brain, Target, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ApproachModalProps {
  cliente: Cliente | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ApproachModal = ({ cliente, isOpen, onClose }: ApproachModalProps) => {
  const [customNotes, setCustomNotes] = useState("");
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const { toast } = useToast();

  if (!cliente) return null;

  const getApproachStrategy = (cliente: Cliente) => {
    const strategies = [];

    if (cliente.tier === 'Ouro') {
      strategies.push({
        id: 'premium-exclusive',
        title: 'Abordagem Premium Exclusiva',
        description: 'Cliente de alto valor - priorizar produtos exclusivos e atendimento personalizado',
        priority: 'Alta',
        recommended: true,
        actions: [
          'Agendar reunião presencial em até 2 dias',
          'Apresentar produtos private banking',
          'Oferecer gestão personalizada de patrimônio',
          'Propor estruturação fiscal avançada'
        ]
      });
    }

    if (cliente.tier === 'Prata') {
      strategies.push({
        id: 'professional-focus',
        title: 'Foco Profissional',
        description: 'Cliente com potencial de crescimento - expandir relacionamento gradualmente',
        priority: 'Média-Alta',
        recommended: true,
        actions: [
          'Contato telefônico em até 5 dias',
          'Apresentar fundos de investimento adequados ao perfil',
          'Propor previdência complementar',
          'Oferecer consultoria de investimentos'
        ]
      });
    }

    if (cliente.tier === 'Bronze') {
      strategies.push({
        id: 'growth-potential',
        title: 'Potencial de Crescimento',
        description: 'Foco em educação financeira e produtos de entrada',
        priority: 'Média',
        recommended: false,
        actions: [
          'Contato por e-mail ou WhatsApp em até 7 dias',
          'Apresentar produtos de renda fixa básicos',
          'Oferecer educação financeira',
          'Propor conta digital premium'
        ]
      });
    }

    // Estratégias baseadas na profissão
    if (cliente.profissao.toLowerCase().includes('médico')) {
      strategies.push({
        id: 'medical-specialist',
        title: 'Especialista Médico',
        description: 'Produtos específicos para profissionais da saúde',
        priority: 'Alta',
        recommended: cliente.custodia > 500000,
        actions: [
          'Apresentar previdência para médicos',
          'Oferecer seguros profissionais',
          'Propor investimentos em REITs hospitalares',
          'Consultoria fiscal para pessoa física'
        ]
      });
    }

    if (cliente.profissao.toLowerCase().includes('empresário')) {
      strategies.push({
        id: 'entrepreneur-business',
        title: 'Empresário/Executivo',
        description: 'Soluções corporativas e pessoais integradas',
        priority: 'Alta',
        recommended: true,
        actions: [
          'Apresentar conta PJ empresarial',
          'Oferecer crédito empresarial',
          'Propor gestão de fluxo de caixa',
          'Consultoria em fusões e aquisições'
        ]
      });
    }

    return strategies.length > 0 ? strategies : [{
      id: 'general-approach',
      title: 'Abordagem Geral',
      description: 'Estratégia padrão baseada no perfil do cliente',
      priority: 'Média',
      recommended: true,
      actions: [
        'Contato inicial para entender necessidades',
        'Apresentar portfólio de produtos adequados',
        'Oferecer consultoria básica de investimentos',
        'Agendar reunião de follow-up'
      ]
    }];
  };

  const handleScheduleApproach = () => {
    if (!selectedStrategy) {
      toast({
        title: "Selecione uma estratégia",
        description: "Por favor, selecione uma estratégia de abordagem antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    // Simular agendamento
    toast({
      title: "Abordagem Agendada",
      description: `Estratégia "${strategies.find(s => s.id === selectedStrategy)?.title}" agendada para ${cliente.nome}.`,
    });

    onClose();
    setSelectedStrategy(null);
    setCustomNotes("");
  };

  const strategies = getApproachStrategy(cliente);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-primary" />
            Estratégia de Abordagem IA
          </DialogTitle>
          <DialogDescription>
            Sugestões inteligentes de abordagem para <strong>{cliente.nome}</strong> baseadas em IA e análise de dados
          </DialogDescription>
        </DialogHeader>

        {/* Client Summary */}
        <Card className="bg-accent/30">
          <CardHeader>
            <CardTitle className="text-lg">Resumo do Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Tier</span>
                <Badge className="block w-fit mt-1" variant={cliente.tier === 'Ouro' ? 'default' : 'outline'}>
                  {cliente.tier}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Custódia</span>
                <div className="font-bold text-success">{formatCurrency(cliente.custodia)}</div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Prioridade</span>
                <div className="font-bold text-primary">{cliente.priorityScore}/10</div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Profissão</span>
                <div className="font-medium">{cliente.profissao}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Strategies */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Estratégias Recomendadas pela IA</h3>
          </div>

          {strategies.map((strategy) => (
            <Card 
              key={strategy.id}
              className={`cursor-pointer transition-all duration-200 ${
                selectedStrategy === strategy.id 
                  ? 'ring-2 ring-primary shadow-glow' 
                  : 'hover:bg-accent/30'
              } ${strategy.recommended ? 'border-success/30 bg-success/5' : ''}`}
              onClick={() => setSelectedStrategy(strategy.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {strategy.recommended ? (
                      <CheckCircle className="h-5 w-5 text-success" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-warning" />
                    )}
                    {strategy.title}
                    {strategy.recommended && (
                      <Badge variant="outline" className="text-success border-success/30 bg-success/10">
                        Recomendada
                      </Badge>
                    )}
                  </CardTitle>
                  <Badge variant="secondary">
                    Prioridade {strategy.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{strategy.description}</p>
                
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Ações Sugeridas:
                  </h4>
                  <ul className="space-y-1">
                    {strategy.actions.map((action, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Custom Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Observações Personalizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Adicione observações específicas sobre este cliente ou ajustes na estratégia..."
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              className="min-h-20"
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                toast({
                  title: "Estratégia Salva",
                  description: "A estratégia foi salva como rascunho.",
                });
              }}
            >
              Salvar Rascunho
            </Button>
            <Button onClick={handleScheduleApproach} disabled={!selectedStrategy}>
              <Calendar className="h-4 w-4 mr-2" />
              Agendar Abordagem
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};