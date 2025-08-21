import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';
import { Assessor } from '@/types/financial';

interface AssessorMiniChartProps {
  assessor: Assessor;
}

export const AssessorMiniChart = ({ assessor }: AssessorMiniChartProps) => {
  const data = [
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
  ];

  return (
    <div className="w-full h-16">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <Bar dataKey="value" radius={[2, 2, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};