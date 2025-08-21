import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Assessor } from "@/types/financial";
import { formatCurrency, formatNumber, formatPercentage } from "@/utils/mockData";
import { ArrowLeft, TrendingUp, Users, Target, Eye, MessageSquare, Download } from "lucide-react";
import { PriorityClientsList } from "./PriorityClientsList";
import { AssessorCharts } from "./AssessorCharts";
import * as XLSX from 'xlsx';
import { useToast } from "@/hooks/use-toast";

interface AssessorDashboardProps {
  assessor: Assessor;
  onBack: () => void;
  onViewClient: (clienteId: string) => void;
  onScheduleApproach: (clienteId: string) => void;
}

export const AssessorDashboard = ({ 
  assessor, 
  onBack, 
  onViewClient, 
  onScheduleApproach 
}: AssessorDashboardProps) => {
  const { toast } = useToast();

  const handleExportAssessorData = () => {
    const exportData = [
      ['Dados do Assessor', assessor.nome],
      ['Custódia Total', assessor.custodiaTotal],
      ['Receita Total', assessor.receitaTotal],
      ['Clientes Ativos', assessor.clientesAtivos],
      ['Performance Anual (%)', assessor.performanceAnual],
      ['Atingimento Meta (%)', assessor.atingimentoMeta],
      [''],
      ['Detalhes dos Clientes'],
      ['Cliente', 'Tier', 'Custódia', 'Receita', 'Prioridade', 'Profissão', 'Idade'],
      ...assessor.clientes.map(cliente => [
        cliente.nome,
        cliente.tier,
        cliente.custodia,
        cliente.receita,
        cliente.priorityScore,
        cliente.profissao,
        cliente.idade || 'N/A'
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${assessor.nome.replace(/\s+/g, '_')}`);
    
    XLSX.writeFile(wb, `relatorio_${assessor.nome.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast({
      title: "Relatório Exportado",
      description: `Dados de ${assessor.nome} exportados com sucesso.`,
    });
  };

  const summaryMetrics = [
    {
      title: "Custódia Total",
      value: formatCurrency(assessor.custodiaTotal),
      icon: TrendingUp,
      description: `Média: ${formatCurrency(assessor.custodiaMedia)}`,
      color: "success"
    },
    {
      title: "Receita Total",
      value: formatCurrency(assessor.receitaTotal),
      icon: Target,
      description: `Média: ${formatCurrency(assessor.receitaMedia)}`,
      color: "primary"
    },
    {
      title: "Clientes Ativos",
      value: formatNumber(assessor.clientesAtivos),
      icon: Users,
      description: `${assessor.clientesOuro} Ouro, ${assessor.clientesPrata} Prata, ${assessor.clientesBronze} Bronze`,
      color: "info"
    },
    {
      title: "Performance",
      value: formatPercentage(assessor.performanceAnual),
      icon: TrendingUp,
      description: `Meta: ${formatPercentage(assessor.atingimentoMeta)}`,
      color: assessor.performanceAnual >= 95 ? "success" : "warning"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos Assessores
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{assessor.nome}</h2>
            <p className="text-muted-foreground">Dashboard Individual do Assessor</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-primary border-primary bg-primary/5">
            {assessor.clientesAtivos} clientes ativos
          </Badge>
          <Button variant="outline" size="sm" onClick={handleExportAssessorData}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryMetrics.map((metric, index) => {
          const Icon = metric.icon;
          
          return (
            <Card key={index} className="metric-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {metric.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AssessorCharts assessor={assessor} />
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Carteira de Clientes - Ordenados por Prioridade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PriorityClientsList
                clientes={assessor.clientes}
                onViewClient={onViewClient}
                onScheduleApproach={onScheduleApproach}
                showAssessorColumn={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Chart */}
            <Card className="chart-container">
              <CardHeader>
                <CardTitle>Performance vs Meta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Performance Anual</span>
                    <span className="font-medium text-foreground">{formatPercentage(assessor.performanceAnual)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Meta Mensal</span>
                    <span className="font-medium text-foreground">{formatPercentage(assessor.atingimentoMeta)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Receita Média</span>
                    <span className="font-medium text-success">{formatCurrency(assessor.receitaMedia)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Client Distribution */}
            <Card className="chart-container">
              <CardHeader>
                <CardTitle>Distribuição de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
                    <span className="text-yellow-400 font-medium">Clientes Ouro</span>
                    <span className="text-foreground font-bold">{assessor.clientesOuro}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-500/10 border border-gray-500/20 rounded">
                    <span className="text-gray-300 font-medium">Clientes Prata</span>
                    <span className="text-foreground font-bold">{assessor.clientesPrata}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-600/10 border border-orange-600/20 rounded">
                    <span className="text-orange-400 font-medium">Clientes Bronze</span>
                    <span className="text-foreground font-bold">{assessor.clientesBronze}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};