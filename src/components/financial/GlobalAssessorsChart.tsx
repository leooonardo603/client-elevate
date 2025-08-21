import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, Cell } from 'recharts';
import { Assessor } from "@/types/financial";
import { formatCurrency } from "@/utils/mockData";
import { TrendingUp, Users, DollarSign } from "lucide-react";

interface GlobalAssessorsChartProps {
  assessors: Assessor[];
}

export const GlobalAssessorsChart = ({ assessors }: GlobalAssessorsChartProps) => {
  // Prepare data for the chart
  const chartData = assessors
    .sort((a, b) => b.custodiaTotal - a.custodiaTotal)
    .map((assessor, index) => ({
      nome: assessor.nome.split(' ')[0] + ' ' + assessor.nome.split(' ')[assessor.nome.split(' ').length - 1],
      custodia: assessor.custodiaTotal,
      receita: assessor.receitaTotal,
      clientes: assessor.clientesAtivos,
      color: getAssessorColor(index)
    }));

  // Get colors for each assessor
  function getAssessorColor(index: number) {
    const colors = [
      'hsl(142, 76%, 36%)', // Green
      'hsl(213, 94%, 68%)', // Blue  
      'hsl(38, 92%, 50%)',  // Orange
      'hsl(270, 95%, 75%)', // Purple
      'hsl(346, 87%, 43%)', // Red
      'hsl(173, 80%, 40%)', // Teal
      'hsl(45, 93%, 47%)',  // Yellow
      'hsl(348, 83%, 47%)', // Pink
      'hsl(217, 91%, 60%)', // Light Blue
      'hsl(142, 52%, 46%)', // Forest Green
      'hsl(25, 95%, 53%)',  // Orange Red
      'hsl(262, 83%, 58%)'  // Violet
    ];
    return colors[index % colors.length];
  }

  const totalCustodia = assessors.reduce((sum, assessor) => sum + assessor.custodiaTotal, 0);
  const totalReceita = assessors.reduce((sum, assessor) => sum + assessor.receitaTotal, 0);
  const totalClientes = assessors.reduce((sum, assessor) => sum + assessor.clientesAtivos, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="metric-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Custódia Total</p>
                <div className="text-2xl font-bold text-success">
                  {formatCurrency(totalCustodia)}
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Receita Total</p>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(totalReceita)}
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Clientes</p>
                <div className="text-2xl font-bold text-info">
                  {totalClientes}
                </div>
              </div>
              <Users className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Ranking de Assessores por Custódia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
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
                  tickFormatter={(value) => formatCurrency(value).replace('R$', 'R$').slice(0, -6) + 'M'}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'custodia') return [formatCurrency(value), 'Custódia'];
                    if (name === 'receita') return [formatCurrency(value), 'Receita'];
                    if (name === 'clientes') return [value, 'Clientes'];
                    return [value, name];
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="custodia" 
                  name="Custódia" 
                  radius={[4, 4, 0, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Chart */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Receita por Assessor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
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
                <Bar 
                  dataKey="receita" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};