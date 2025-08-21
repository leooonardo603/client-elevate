import { Cliente, Assessor, DashboardMetrics } from '@/types/financial';

const nomesBrasileiros = [
  'Ana Carolina Silva', 'João Pedro Santos', 'Maria Eduarda Oliveira', 'Carlos Roberto Lima',
  'Juliana Ferreira', 'Rafael Almeida', 'Patricia Costa', 'Fernando Rodrigues',
  'Camila Martins', 'Lucas Pereira', 'Beatriz Carvalho', 'Gabriel Souza',
  'Leticia Barbosa', 'Diego Fernandes', 'Amanda Rocha', 'Thiago Nascimento',
  'Larissa Dias', 'Bruno Cardoso', 'Isabela Moreira', 'Gustavo Ribeiro',
  'Priscila Gomes', 'Marcos Teixeira', 'Natália Araújo', 'Victor Hugo Castro',
  'Daniela Correia', 'André Felipe Barros', 'Renata Pinto', 'Felipe Mendes'
];

const assessoresNomes = [
  'Ricardo Monteiro', 'Fernanda Campos', 'Eduardo Silva', 'Mariana Costa',
  'Paulo Henrique', 'Carla Santos', 'Roberto Carlos', 'Vanessa Lima',
  'Alexandre Rocha', 'Tatiane Ferreira', 'Marcelo Pereira', 'Claudia Oliveira'
];

const profissoes = [
  'Empresário', 'Médico', 'Advogado', 'Dentista', 'Arquiteto', 'Engenheiro',
  'Servidor Público', 'Gerente', 'Diretor', 'Aposentado', 'Autônomo',
  'Analista', 'Coordenador', 'Consultor', 'Professor Universitário'
];

export const generateMockClients = (count: number = 150): Cliente[] => {
  const clients: Cliente[] = [];
  
  for (let i = 0; i < count; i++) {
    const profissao = profissoes[Math.floor(Math.random() * profissoes.length)];
    const idade = Math.floor(Math.random() * 60) + 25;
    const netEmM = Math.random() * 5000000 + 100000;
    const netPrevidencia = Math.random() * 500000;
    
    const { tier, priorityScore } = classifyClient(profissao, idade, netEmM, netPrevidencia);
    
    const cliente: Cliente = {
      id: `cliente_${i + 1}`,
      nome: nomesBrasileiros[Math.floor(Math.random() * nomesBrasileiros.length)],
      assessor: assessoresNomes[Math.floor(Math.random() * assessoresNomes.length)],
      profissao,
      idade,
      status: Math.random() > 0.1 ? 'ATIVO' : 'INATIVO',
      tier,
      priorityScore,
      custodia: netEmM,
      receita: Math.random() * 50000 + 1000,
      netEmM,
      receitaBovespa: Math.random() * 15000,
      receitaFuturos: Math.random() * 10000,
      receitaRFBancarios: Math.random() * 8000,
      receitaRFPrivados: Math.random() * 12000,
      receitaRFPublicos: Math.random() * 6000,
      netRendaFixa: Math.random() * 2000000,
      netRendaVariavel: Math.random() * 1500000,
      netFundos: Math.random() * 1000000,
      netPrevidencia,
      netOutros: Math.random() * 300000,
      dataCadastro: new Date(Date.now() - Math.random() * 31536000000).toISOString(),
      dataNascimento: new Date(Date.now() - (idade * 31536000000)).toISOString(),
    };
    
    clients.push(cliente);
  }
  
  return clients.filter(c => c.status === 'ATIVO');
};

const classifyClient = (profissao: string, idade: number, netEmM: number, netPrevidencia: number) => {
  const prof = profissao.toLowerCase();
  const isEmpresario = prof.includes('empresário') || prof.includes('diretor');
  const isProfissionalLiberal = prof.includes('médico') || prof.includes('advogado') || prof.includes('dentista') || prof.includes('arquiteto') || prof.includes('engenheiro');
  const isCLTServidorAposentado = prof.includes('servidor') || prof.includes('aposentado') || prof.includes('gerente') || prof.includes('analista') || prof.includes('coordenador');
  
  let tier: 'Ouro' | 'Prata' | 'Bronze' = 'Bronze';
  let priorityScore = 1;

  if (netEmM > 1000000 && idade >= 40 && idade <= 65 && isEmpresario) {
    tier = 'Ouro';
    priorityScore = 10;
  } else if (netEmM > 1000000 && idade >= 40 && idade <= 65 && isEmpresario && netPrevidencia > 0) {
    tier = 'Ouro';
    priorityScore = 9;
  } else if (isProfissionalLiberal && idade >= 18 && idade <= 60) {
    tier = 'Prata';
    priorityScore = 8;
  } else if (netEmM > 300000) {
    tier = 'Prata';
    priorityScore = 7;
  } else if (isCLTServidorAposentado) {
    tier = 'Bronze';
    priorityScore = 6;
  } else {
    tier = 'Bronze';
    priorityScore = Math.floor(Math.random() * 5) + 1;
  }

  return { tier, priorityScore };
};

export const generateAssessors = (clients: Cliente[]): Assessor[] => {
  const assessorMap = new Map<string, Cliente[]>();
  
  clients.forEach(client => {
    if (!assessorMap.has(client.assessor)) {
      assessorMap.set(client.assessor, []);
    }
    assessorMap.get(client.assessor)!.push(client);
  });

  const assessors: Assessor[] = Array.from(assessorMap.entries()).map(([nome, clientesAssessor], index) => {
    const custodiaTotal = clientesAssessor.reduce((sum, c) => sum + c.custodia, 0);
    const receitaTotal = clientesAssessor.reduce((sum, c) => sum + c.receita, 0);
    const clientesOuro = clientesAssessor.filter(c => c.tier === 'Ouro').length;
    const clientesPrata = clientesAssessor.filter(c => c.tier === 'Prata').length;
    const clientesBronze = clientesAssessor.filter(c => c.tier === 'Bronze').length;
    
    return {
      id: `assessor_${index + 1}`,
      nome,
      custodiaTotal,
      receitaTotal,
      clientesAtivos: clientesAssessor.length,
      clientesOuro,
      clientesPrata,
      clientesBronze,
      receitaMedia: receitaTotal / clientesAssessor.length,
      custodiaMedia: custodiaTotal / clientesAssessor.length,
      clientes: clientesAssessor.sort((a, b) => b.priorityScore - a.priorityScore),
      performanceAnual: Math.random() * 30 + 85,
      metaMensal: Math.random() * 100000 + 50000,
      atingimentoMeta: Math.random() * 50 + 75,
    };
  });

  return assessors.sort((a, b) => b.custodiaTotal - a.custodiaTotal);
};

export const generateDashboardMetrics = (clients: Cliente[], assessors: Assessor[]): DashboardMetrics => {
  const totalClientes = clients.length;
  const custodiaTotal = clients.reduce((sum, c) => sum + c.custodia, 0);
  const receitaTotal = clients.reduce((sum, c) => sum + c.receita, 0);
  const clientesOuro = clients.filter(c => c.tier === 'Ouro').length;
  const clientesPrata = clients.filter(c => c.tier === 'Prata').length;
  const clientesBronze = clients.filter(c => c.tier === 'Bronze').length;

  return {
    totalClientes,
    custodiaTotal,
    receitaTotal,
    clientesOuro,
    clientesPrata,
    clientesBronze,
    assessoresAtivos: assessors.length,
    receitaMedia: receitaTotal / totalClientes,
    custodiaMedia: custodiaTotal / totalClientes,
    crescimentoMensal: Math.random() * 20 + 5,
    performanceGeral: Math.random() * 25 + 80,
    metasMensais: {
      meta: 1500000,
      realizado: receitaTotal,
      percentual: (receitaTotal / 1500000) * 100,
    },
  };
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};