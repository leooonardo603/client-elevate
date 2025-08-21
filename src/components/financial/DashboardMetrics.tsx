import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardMetrics as DashboardMetricsType } from "@/types/financial";
import { formatCurrency, formatNumber, formatPercentage } from "@/utils/mockData";
import { TrendingUp, TrendingDown, Users, DollarSign, Target, BarChart3 } from "lucide-react";

interface DashboardMetricsProps {
  metrics: DashboardMetricsType;
}

export const DashboardMetrics = ({ metrics }: DashboardMetricsProps) => {
  const metricCards = [
    {
      title: "Custódia Total",
      value: formatCurrency(metrics.custodiaTotal),
      icon: DollarSign,
      trend: metrics.crescimentoMensal,
      description: `${formatCurrency(metrics.custodiaMedia)} por cliente`,
      color: "success"
    },
    {
      title: "Receita Total",
      value: formatCurrency(metrics.receitaTotal),
      icon: TrendingUp,
      trend: metrics.performanceGeral - 100,
      description: `${formatCurrency(metrics.receitaMedia)} por cliente`,
      color: "primary"
    },
    {
      title: "Clientes Ativos",
      value: formatNumber(metrics.totalClientes),
      icon: Users,
      trend: 8.2,
      description: `${metrics.assessoresAtivos} assessores ativos`,
      color: "info"
    },
    {
      title: "Meta Mensal",
      value: formatPercentage(metrics.metasMensais.percentual),
      icon: Target,
      trend: metrics.metasMensais.percentual - 100,
      description: `${formatCurrency(metrics.metasMensais.realizado)} de ${formatCurrency(metrics.metasMensais.meta)}`,
      color: metrics.metasMensais.percentual >= 100 ? "success" : "warning"
    }
  ];

  const tierCards = [
    {
      title: "Clientes Ouro",
      value: metrics.clientesOuro,
      color: "bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/30",
      textColor: "text-yellow-400"
    },
    {
      title: "Clientes Prata",
      value: metrics.clientesPrata,
      color: "bg-gradient-to-br from-gray-400/20 to-gray-500/20 border-gray-400/30",
      textColor: "text-gray-300"
    },
    {
      title: "Clientes Bronze",
      value: metrics.clientesBronze,
      color: "bg-gradient-to-br from-orange-600/20 to-orange-700/20 border-orange-600/30",
      textColor: "text-orange-400"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => {
          const Icon = metric.icon;
          const isPositive = metric.trend > 0;
          
          return (
            <Card key={index} className="metric-card hover:shadow-glow transition-all duration-300">
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
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {metric.description}
                  </p>
                  <div className={`flex items-center text-xs ${
                    isPositive ? 'text-success' : 'text-destructive'
                  }`}>
                    {isPositive ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {formatPercentage(Math.abs(metric.trend))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tier Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tierCards.map((tier, index) => (
          <Card key={index} className={`${tier.color} transition-all duration-200 hover:shadow-lg`}>
            <CardContent className="p-6 text-center">
              <div className={`text-3xl font-bold ${tier.textColor} mb-2`}>
                {tier.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {tier.title}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {((tier.value / metrics.totalClientes) * 100).toFixed(1)}% do total
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};