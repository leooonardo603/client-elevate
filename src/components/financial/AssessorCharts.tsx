import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { Assessor } from "@/types/financial";
import { formatCurrency } from "@/utils/mockData";

interface AssessorChartsProps {
  assessor: Assessor;
}

export const AssessorCharts = ({ assessor }: AssessorChartsProps) => {
  // Data for client distribution pie chart
  const clientDistributionData = [
    {
      name: 'Ouro',
      value: assessor.clientesOuro,
      color: 'hsl(45, 93%, 47%)'
    },
    {
      name: 'Prata',
      value: assessor.clientesPrata,
      color: 'hsl(0, 0%, 70%)'
    },
    {
      name: 'Bronze',
      value: assessor.clientesBronze,
      color: 'hsl(25, 75%, 50%)'
    }
  ].filter(item => item.value > 0);

  // Data for top clients bar chart
  const topClientsData = assessor.clientes
    .slice(0, 10)
    .map(cliente => ({
      nome: cliente.nome.split(' ')[0] + ' ' + cliente.nome.split(' ')[cliente.nome.split(' ').length - 1],
      custodia: cliente.custodia,
      receita: cliente.receita,
      tier: cliente.tier
    }));

  const getBarColor = (tier: string) => {
    switch (tier) {
      case 'Ouro': return 'hsl(45, 93%, 47%)';
      case 'Prata': return 'hsl(0, 0%, 70%)';
      case 'Bronze': return 'hsl(25, 75%, 50%)';
      default: return 'hsl(var(--primary))';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Client Distribution Chart */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle>Distribuição de Clientes por Tier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={clientDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {clientDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Clientes']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Clients Custody Chart */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle>Top 10 Clientes por Custódia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topClientsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="nome" 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => formatCurrency(value).replace('R$', 'R$').slice(0, -3) + 'K'}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Custódia']}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="custodia" radius={[4, 4, 0, 0]}>
                  {topClientsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.tier)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Distribution Chart */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle>Top 10 Clientes por Receita</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topClientsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="nome" 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => formatCurrency(value).replace('R$', 'R$').slice(0, -3) + 'K'}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Receita']}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="receita" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics Summary */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle>Métricas de Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-success/10 border border-success/20 rounded-lg">
                <div className="text-2xl font-bold text-success">
                  {assessor.performanceAnual.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Performance Anual</div>
              </div>
              <div className="text-center p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {assessor.atingimentoMeta.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Atingimento Meta</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Custódia Média</span>
                <span className="font-medium text-success">{formatCurrency(assessor.custodiaMedia)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Receita Média</span>
                <span className="font-medium text-primary">{formatCurrency(assessor.receitaMedia)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Meta Mensal</span>
                <span className="font-medium text-foreground">{formatCurrency(assessor.metaMensal)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};