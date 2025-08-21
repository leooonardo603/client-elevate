import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Assessor } from "@/types/financial";
import { formatCurrency, formatNumber, formatPercentage } from "@/utils/mockData";
import { User, TrendingUp, Users, Target, Eye, BarChart3 } from "lucide-react";
import { AssessorMiniChart } from "./AssessorMiniChart";

interface AssessorCardProps {
  assessor: Assessor;
  onViewDetails: (assessorId: string) => void;
  isSelected: boolean;
}

export const AssessorCard = ({ assessor, onViewDetails, isSelected }: AssessorCardProps) => {
  const getPerformanceColor = (performance: number) => {
    if (performance >= 95) return "text-success";
    if (performance >= 85) return "text-warning";
    return "text-destructive";
  };

  const getMetaColor = (atingimento: number) => {
    if (atingimento >= 100) return "bg-success";
    if (atingimento >= 80) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <Card className={`metric-card hover:border-primary/50 transition-all duration-300 ${
      isSelected ? 'ring-2 ring-primary shadow-glow' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            {assessor.nome}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {assessor.clientesAtivos} clientes
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Mini Dashboard */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-success">
              {formatCurrency(assessor.custodiaTotal)}
            </div>
            <div className="text-xs text-muted-foreground">Custódia Total</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-primary">
              {formatCurrency(assessor.receitaTotal)}
            </div>
            <div className="text-xs text-muted-foreground">Receita Total</div>
          </div>
        </div>

        {/* Mini Chart */}
        <AssessorMiniChart assessor={assessor} />

        {/* Client Distribution */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Distribuição por Tier</span>
            <div className="flex gap-1">
              {assessor.clientesOuro > 0 && (
                <Badge variant="outline" className="text-xs border-yellow-500/30 text-yellow-400">
                  {assessor.clientesOuro}★
                </Badge>
              )}
              {assessor.clientesPrata > 0 && (
                <Badge variant="outline" className="text-xs border-gray-400/30 text-gray-300">
                  {assessor.clientesPrata}★
                </Badge>
              )}
              {assessor.clientesBronze > 0 && (
                <Badge variant="outline" className="text-xs border-orange-600/30 text-orange-400">
                  {assessor.clientesBronze}★
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Performance Anual</span>
            <span className={`text-sm font-medium ${getPerformanceColor(assessor.performanceAnual)}`}>
              {formatPercentage(assessor.performanceAnual)}
            </span>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Meta Mensal</span>
              <span className="text-foreground">
                {formatPercentage(assessor.atingimentoMeta)}
              </span>
            </div>
            <Progress 
              value={assessor.atingimentoMeta} 
              className="h-2"
              style={{
                '--progress-background': `hsl(var(--${getMetaColor(assessor.atingimentoMeta).replace('bg-', '')}))`,
              } as any}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => onViewDetails(assessor.id)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};