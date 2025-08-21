export interface Cliente {
  id: string;
  nome: string;
  assessor: string;
  profissao: string;
  idade: number | null;
  status: 'ATIVO' | 'INATIVO';
  tier: 'Ouro' | 'Prata' | 'Bronze';
  priorityScore: number;
  custodia: number;
  receita: number;
  netEmM: number;
  receitaBovespa: number;
  receitaFuturos: number;
  receitaRFBancarios: number;
  receitaRFPrivados: number;
  receitaRFPublicos: number;
  netRendaFixa: number;
  netRendaVariavel: number;
  netFundos: number;
  netPrevidencia: number;
  netOutros: number;
  dataCadastro: string;
  dataNascimento?: string;
}

export interface Assessor {
  id: string;
  nome: string;
  custodiaTotal: number;
  receitaTotal: number;
  clientesAtivos: number;
  clientesOuro: number;
  clientesPrata: number;
  clientesBronze: number;
  receitaMedia: number;
  custodiaMedia: number;
  clientes: Cliente[];
  performanceAnual: number;
  metaMensal: number;
  atingimentoMeta: number;
}

export interface DashboardMetrics {
  totalClientes: number;
  custodiaTotal: number;
  receitaTotal: number;
  clientesOuro: number;
  clientesPrata: number;
  clientesBronze: number;
  assessoresAtivos: number;
  receitaMedia: number;
  custodiaMedia: number;
  crescimentoMensal: number;
  performanceGeral: number;
  metasMensais: {
    meta: number;
    realizado: number;
    percentual: number;
  };
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface AssessorChartData {
  assessor: string;
  custodia: number;
  receita: number;
  clientes: number;
  color: string;
}