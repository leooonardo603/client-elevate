import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

import { DashboardMetrics } from "@/components/financial/DashboardMetrics";
import { AssessorCard } from "@/components/financial/AssessorCard";
import { AssessorDashboard } from "@/components/financial/AssessorDashboard";
import { ClientDetailsModal } from "@/components/financial/ClientDetailsModal";
import { PriorityClientsList } from "@/components/financial/PriorityClientsList";
import { ApproachModal } from "@/components/financial/ApproachModal";
import { GlobalAssessorsChart } from "@/components/financial/GlobalAssessorsChart";

import { Building, Users, Search, Download, Upload, TrendingUp, BarChart3, FileText, Home, Target } from "lucide-react";
import { generateMockClients, generateAssessors, generateDashboardMetrics } from "@/utils/mockData";
import { Cliente, Assessor, DashboardMetrics as DashboardMetricsType } from "@/types/financial";
import heroImage from "@/assets/financial-dashboard-hero.jpg";
import Papa from "papaparse";
import * as XLSX from 'xlsx';

const Index = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [assessores, setAssessores] = useState<Assessor[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetricsType | null>(null);
  const [selectedAssessor, setSelectedAssessor] = useState<Assessor | null>(null);
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [selectedApproachClient, setSelectedApproachClient] = useState<Cliente | null>(null);
  const [isApproachModalOpen, setIsApproachModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  const { toast } = useToast();

  // Inicializar dados mockados ou do localStorage
  useEffect(() => {
    const initializeData = () => {
      setIsLoading(true);
      
      // Tentar carregar dados do localStorage primeiro
      const savedData = localStorage.getItem('financial-app-data');
      
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setClientes(parsedData.clientes || []);
          setAssessores(parsedData.assessores || []);
          setMetrics(parsedData.metrics || null);
          setIsLoading(false);
          
          toast({
            title: "Dados Restaurados",
            description: `${(parsedData.clientes || []).length} clientes e ${(parsedData.assessores || []).length} assessores carregados.`,
          });
          return;
        } catch (error) {
          console.error('Erro ao carregar dados do localStorage:', error);
        }
      }
      
      // Simular carregamento de dados mockados
      setTimeout(() => {
        const mockClientes = generateMockClients(150);
        const mockAssessores = generateAssessors(mockClientes);
        const mockMetrics = generateDashboardMetrics(mockClientes, mockAssessores);
        
        setClientes(mockClientes);
        setAssessores(mockAssessores);
        setMetrics(mockMetrics);
        setIsLoading(false);
        
        // Salvar no localStorage
        const dataToSave = {
          clientes: mockClientes,
          assessores: mockAssessores,
          metrics: mockMetrics,
          lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('financial-app-data', JSON.stringify(dataToSave));
        
        toast({
          title: "Sistema Inicializado",
          description: `${mockClientes.length} clientes e ${mockAssessores.length} assessores carregados.`,
        });
      }, 1500);
    };

    initializeData();
  }, [toast]);

  // Salvar dados no localStorage sempre que houver mudanças
  useEffect(() => {
    if (clientes.length > 0 && assessores.length > 0 && metrics) {
      const dataToSave = {
        clientes,
        assessores,
        metrics,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('financial-app-data', JSON.stringify(dataToSave));
    }
  }, [clientes, assessores, metrics]);

  const handleViewClient = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    if (cliente) {
      setSelectedClient(cliente);
      setIsClientModalOpen(true);
    }
  };

  const handleScheduleApproach = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    if (cliente) {
      setSelectedApproachClient(cliente);
      setIsApproachModalOpen(true);
    }
  };

  const handleAssessorSelection = (assessorId: string) => {
    const assessor = assessores.find(a => a.id === assessorId);
    if (assessor) {
      if (selectedAssessor?.id === assessorId) {
        setSelectedAssessor(null);
      } else {
        setSelectedAssessor(assessor);
        setSearchTerm("");
        setActiveTab("assessors");
      }
    }
  };

  const handleBackToAssessors = () => {
    setSelectedAssessor(null);
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls,.txt,.json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      setIsImporting(true);
      
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'csv' || fileExtension === 'txt') {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          delimiter: fileExtension === 'txt' ? '\t' : ',',
          complete: (results) => {
            try {
              processImportedData(results.data);
              toast({
                title: "Dados Importados",
                description: `${results.data.length} registros importados com sucesso.`,
              });
            } catch (error) {
              toast({
                title: "Erro na Importação",
                description: "Formato de arquivo inválido ou dados corrompidos.",
                variant: "destructive",
              });
            } finally {
              setIsImporting(false);
            }
          },
          error: () => {
            toast({
              title: "Erro na Importação",
              description: "Não foi possível ler o arquivo.",
              variant: "destructive",
            });
            setIsImporting(false);
          }
        });
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            if (jsonData.length > 1) {
              const headers = jsonData[0] as string[];
              const rows = jsonData.slice(1) as any[][];
              const formattedData = rows.map(row => {
                const obj: any = {};
                headers.forEach((header, index) => {
                  obj[header] = row[index] || '';
                });
                return obj;
              });
              
              processImportedData(formattedData);
              toast({
                title: "Dados Importados",
                description: `${formattedData.length} registros importados com sucesso.`,
              });
            }
          } catch (error) {
            toast({
              title: "Erro na Importação",
              description: "Não foi possível ler o arquivo Excel.",
              variant: "destructive",
            });
          } finally {
            setIsImporting(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (fileExtension === 'json') {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const jsonData = JSON.parse(e.target?.result as string);
            const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
            processImportedData(dataArray);
            toast({
              title: "Dados Importados",
              description: `${dataArray.length} registros importados com sucesso.`,
            });
          } catch (error) {
            toast({
              title: "Erro na Importação",
              description: "Arquivo JSON inválido.",
              variant: "destructive",
            });
          } finally {
            setIsImporting(false);
          }
        };
        reader.readAsText(file);
      } else {
        toast({
          title: "Formato Não Suportado",
          description: "Formatos aceitos: CSV, Excel (.xlsx, .xls), TXT, JSON.",
          variant: "destructive",
        });
        setIsImporting(false);
      }
    };
    
    input.click();
  };

  const classifyImportedClient = (profissao: string, idade: number, netEmM: number, netPrevidencia: number): { tier: 'Ouro' | 'Prata' | 'Bronze', priorityScore: number } => {
    const prof = (profissao || '').toLowerCase();
    const isEmpresario = prof.includes('empresário') || prof.includes('empresario') || prof.includes('diretor');
    const isProfissionalLiberal = prof.includes('médico') || prof.includes('medico') || prof.includes('advogado') || prof.includes('dentista') || prof.includes('arquiteto') || prof.includes('engenheiro');
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

  const processImportedData = (data: any[]) => {
    const processedClients = data.map((row: any) => {
      const netEmM = parseFloat(row['Net Em M'] || row.Net || row.Patrimonio || row.netEmM || '0');
      const netPrevidencia = parseFloat(row['Net Previdência'] || row['Net Previdencia'] || row.netPrevidencia || '0');
      const receita = parseFloat(row['Receita no Mês'] || row.Receita || row.receita || '0');
      const profissao = row['Profissão'] || row.Profissao || row.profissao || 'Não Informada';
      
      let idade = null;
      const dataNascimento = row['Data de Nascimento'] || row.DataNascimento || row.dataNascimento;
      if (dataNascimento) {
        const birthDate = new Date(dataNascimento);
        const today = new Date();
        idade = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          idade--;
        }
      }

      const classification = classifyImportedClient(profissao, idade || 35, netEmM, netPrevidencia);

      const cliente: Cliente = {
        id: row.Cliente || row.ID || row.id || `cliente_${Math.random()}`,
        nome: row.Cliente || row.Nome || row.nome || 'Cliente Sem Nome',
        assessor: row.Assessor || row.assessor || 'Não Informado',
        profissao,
        idade,
        status: ((row.Status || row.status || 'ATIVO').toUpperCase() === 'ATIVO' ? 'ATIVO' : 'INATIVO') as 'ATIVO' | 'INATIVO',
        tier: classification.tier,
        priorityScore: classification.priorityScore,
        custodia: netEmM,
        receita,
        netEmM,
        receitaBovespa: parseFloat(row['Receita Bovespa'] || row.receitaBovespa || '0'),
        receitaFuturos: parseFloat(row['Receita Futuros'] || row.receitaFuturos || '0'),
        receitaRFBancarios: parseFloat(row['Receita RF Bancários'] || row.receitaRFBancarios || '0'),
        receitaRFPrivados: parseFloat(row['Receita RF Privados'] || row.receitaRFPrivados || '0'),
        receitaRFPublicos: parseFloat(row['Receita RF Públicos'] || row.receitaRFPublicos || '0'),
        netRendaFixa: parseFloat(row['Net Renda Fixa'] || row.netRendaFixa || '0'),
        netRendaVariavel: parseFloat(row['Net Renda Variável'] || row.netRendaVariavel || '0'),
        netFundos: parseFloat(row['Net Fundos'] || row.netFundos || '0'),
        netPrevidencia,
        netOutros: parseFloat(row['Net Outros'] || row.netOutros || '0'),
        dataCadastro: row['Data de Cadastro'] || row.dataCadastro || new Date().toISOString(),
        dataNascimento,
      };

      return cliente;
    }).filter(client => client.status === 'ATIVO');

    setClientes(processedClients);
    
    const newAssessors = generateAssessors(processedClients);
    const newMetrics = generateDashboardMetrics(processedClients, newAssessors);
    
    setAssessores(newAssessors);
    setMetrics(newMetrics);
    
    const dataToSave = {
      clientes: processedClients,
      assessores: newAssessors,
      metrics: newMetrics,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('financial-app-data', JSON.stringify(dataToSave));
  };

  const handleExportData = () => {
    const csvContent = convertToCSV(clientes);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `relatorio_clientes_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Relatório Exportado",
        description: "Os dados foram exportados com sucesso.",
      });
    }
  };

  const convertToCSV = (data: Cliente[]) => {
    if (data.length === 0) return '';
    
    const headers = ['Cliente', 'Assessor', 'Profissão', 'Prioridade', 'Custódia', 'Idade'];
    const csvData = data.map(cliente => [
      cliente.nome,
      cliente.assessor,
      cliente.profissao,
      cliente.priorityScore,
      cliente.custodia,
      cliente.idade || 'N/A'
    ]);
    
    return [headers, ...csvData].map(row => row.join(',')).join('\n');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="text-xl font-semibold text-foreground">Carregando Sistema Financeiro</h2>
          <p className="text-muted-foreground">Processando dados de clientes e assessores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm"></div>
        
        <header className="relative z-10 border-b border-border/50">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    Sistema de Gestão Financeira
                  </h1>
                  <p className="text-muted-foreground">
                    Dashboard Executivo de Priorização de Clientes
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-primary border-primary bg-primary/5">
                  <Users className="mr-1 h-3 w-3" />
                  {clientes.length} Clientes Ativos
                </Badge>
                <Button variant="secondary" size="sm" onClick={handleExportData}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="relative z-10 container mx-auto px-6 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Maximize Resultados com
              <span className="text-primary block mt-2">Análise Inteligente</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 text-balance">
              Plataforma completa para gestão de carteira com priorização automática de clientes, 
              métricas em tempo real e dashboards interativos.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button variant="default" size="lg">
                <TrendingUp className="mr-2 h-5 w-5" />
                Ver Performance
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleImportData}
                disabled={isImporting}
              >
                {isImporting ? (
                  <>
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" />
                    Importar Dados
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-8">
        {/* Main Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="assessors" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Assessores
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Clientes
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {metrics && (
              <>
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">
                    Dashboard Geral da Empresa
                  </h2>
                </div>
                <DashboardMetrics metrics={metrics} />
              </>
            )}
            
            <Separator className="bg-border/50" />
            
            <section>
              <div className="flex items-center gap-2 mb-6">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  Top 20 Clientes Prioritários
                </h2>
              </div>
              <PriorityClientsList
                clientes={clientes.slice(0, 20)}
                onViewClient={handleViewClient}
                onScheduleApproach={handleScheduleApproach}
              />
            </section>
          </TabsContent>

          {/* Assessors Tab */}
          <TabsContent value="assessors" className="space-y-8">
            {!selectedAssessor ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold text-foreground">
                      Assessores (Ordenados por Custódia)
                    </h2>
                    <Badge variant="secondary">
                      {assessores.length} assessores
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {assessores.map((assessor) => (
                    <AssessorCard
                      key={assessor.id}
                      assessor={assessor}
                      onViewDetails={handleAssessorSelection}
                      isSelected={false}
                    />
                  ))}
                </div>
              </>
            ) : (
              <AssessorDashboard
                assessor={selectedAssessor}
                onBack={handleBackToAssessors}
                onViewClient={handleViewClient}
                onScheduleApproach={handleScheduleApproach}
              />
            )}
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-8">
            <section>
              <div className="flex items-center gap-2 mb-6">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  Ranking Completo de Clientes
                </h2>
              </div>
              <PriorityClientsList
                clientes={clientes}
                onViewClient={handleViewClient}
                onScheduleApproach={handleScheduleApproach}
              />
            </section>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-8">
            <section>
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  Analytics Avançado - Dashboards com Gráficos
                </h2>
              </div>
              <GlobalAssessorsChart assessors={assessores} />
            </section>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <ClientDetailsModal
        cliente={selectedClient}
        isOpen={isClientModalOpen}
        onClose={() => {
          setIsClientModalOpen(false);
          setSelectedClient(null);
        }}
      />

      <ApproachModal
        cliente={selectedApproachClient}
        isOpen={isApproachModalOpen}
        onClose={() => {
          setIsApproachModalOpen(false);
          setSelectedApproachClient(null);
        }}
      />
    </div>
  );
};

export default Index;