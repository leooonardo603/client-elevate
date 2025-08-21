import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Cliente } from "@/types/financial";
import { formatCurrency, formatNumber } from "@/utils/mockData";
import { User, Briefcase, Calendar, TrendingUp, DollarSign, PieChart } from "lucide-react";

interface ClientDetailsModalProps {
  cliente: Cliente | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ClientDetailsModal = ({ cliente, isOpen, onClose }: ClientDetailsModalProps) => {
  if (!cliente) return null;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Ouro': return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400';
      case 'Prata': return 'border-gray-400/30 bg-gray-400/10 text-gray-300';
      case 'Bronze': return 'border-orange-600/30 bg-orange-600/10 text-orange-400';
      default: return 'border-muted bg-muted/10 text-muted-foreground';
    }
  };

  const portfolioData = [
    { label: "Renda Fixa", value: cliente.netRendaFixa, color: "text-blue-400" },
    { label: "Renda Variável", value: cliente.netRendaVariavel, color: "text-green-400" },
    { label: "Fundos", value: cliente.netFundos, color: "text-purple-400" },
    { label: "Previdência", value: cliente.netPrevidencia, color: "text-orange-400" },
    { label: "Outros", value: cliente.netOutros, color: "text-gray-400" },
  ];

  const revenueData = [
    { label: "Bovespa", value: cliente.receitaBovespa, color: "text-green-400" },
    { label: "Futuros", value: cliente.receitaFuturos, color: "text-blue-400" },
    { label: "RF Bancários", value: cliente.receitaRFBancarios, color: "text-yellow-400" },
    { label: "RF Privados", value: cliente.receitaRFPrivados, color: "text-purple-400" },
    { label: "RF Públicos", value: cliente.receitaRFPublicos, color: "text-orange-400" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <User className="h-6 w-6 text-primary" />
            {cliente.nome}
            <Badge className={getTierColor(cliente.tier)}>
              {cliente.tier}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Detalhes completos do cliente e composição de portfólio
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informações Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Assessor</span>
                  <div className="font-medium text-foreground">{cliente.assessor}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={cliente.status === 'ATIVO' ? 'default' : 'secondary'}>
                    {cliente.status}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Profissão</span>
                  <div className="font-medium text-foreground flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    {cliente.profissao}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Idade</span>
                  <div className="font-medium text-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {cliente.idade ? `${cliente.idade} anos` : 'Não informado'}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <span className="text-sm text-muted-foreground">Prioridade</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="text-xl font-bold text-primary">{cliente.priorityScore}/10</div>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all duration-300"
                      style={{ width: `${(cliente.priorityScore / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumo Financeiro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Resumo Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                  <span className="text-sm text-muted-foreground">Custódia Total</span>
                  <div className="text-xl font-bold text-success">
                    {formatCurrency(cliente.custodia)}
                  </div>
                </div>

                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <span className="text-sm text-muted-foreground">Receita Mensal</span>
                  <div className="text-xl font-bold text-primary">
                    {formatCurrency(cliente.receita)}
                  </div>
                </div>

                <div className="p-3 bg-info/10 border border-info/20 rounded-lg">
                  <span className="text-sm text-muted-foreground">Net em M</span>
                  <div className="text-xl font-bold text-info">
                    {formatCurrency(cliente.netEmM)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Composição do Portfólio */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Composição do Portfólio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {portfolioData.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 rounded">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className={`font-medium ${item.color}`}>
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Composição de Receita */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Composição de Receita
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {revenueData.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 rounded">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className={`font-medium ${item.color}`}>
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informações Adicionais */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Adicionais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Data de Cadastro:</span>
                <div className="font-medium">
                  {new Date(cliente.dataCadastro).toLocaleDateString('pt-BR')}
                </div>
              </div>
              {cliente.dataNascimento && (
                <div>
                  <span className="text-muted-foreground">Data de Nascimento:</span>
                  <div className="font-medium">
                    {new Date(cliente.dataNascimento).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};