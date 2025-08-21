import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Cliente } from "@/types/financial";
import { formatCurrency, formatNumber } from "@/utils/mockData";
import { Search, Eye, MessageSquare, Star, Trophy, Award } from "lucide-react";
import { useState, useMemo } from "react";

interface PriorityClientsListProps {
  clientes: Cliente[];
  onViewClient: (clienteId: string) => void;
  onScheduleApproach: (clienteId: string) => void;
  showAssessorColumn?: boolean;
}

export const PriorityClientsList = ({ 
  clientes, 
  onViewClient, 
  onScheduleApproach, 
  showAssessorColumn = true 
}: PriorityClientsListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTier, setFilterTier] = useState<string>("all");

  const filteredClientes = useMemo(() => {
    return clientes
      .filter(cliente => {
        const matchesSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            cliente.profissao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            cliente.assessor.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTier = filterTier === "all" || cliente.tier === filterTier;
        return matchesSearch && matchesTier;
      })
      .sort((a, b) => b.priorityScore - a.priorityScore);
  }, [clientes, searchTerm, filterTier]);

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Ouro': return <Trophy className="h-4 w-4 text-yellow-400" />;
      case 'Prata': return <Award className="h-4 w-4 text-gray-300" />;
      case 'Bronze': return <Star className="h-4 w-4 text-orange-400" />;
      default: return null;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Ouro': return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400';
      case 'Prata': return 'border-gray-400/30 bg-gray-400/10 text-gray-300';
      case 'Bronze': return 'border-orange-600/30 bg-orange-600/10 text-orange-400';
      default: return 'border-muted bg-muted/10 text-muted-foreground';
    }
  };

  const getPriorityColor = (score: number) => {
    if (score >= 9) return 'text-success bg-success/10';
    if (score >= 7) return 'text-warning bg-warning/10';
    if (score >= 5) return 'text-info bg-info/10';
    return 'text-muted-foreground bg-muted/10';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Clientes por Ordem de Prioridade
            <Badge variant="secondary">{filteredClientes.length} clientes</Badge>
          </CardTitle>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-4 mt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, profissão ou assessor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={filterTier === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterTier("all")}
            >
              Todos
            </Button>
            <Button
              variant={filterTier === "Ouro" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterTier("Ouro")}
              className={filterTier === "Ouro" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
            >
              <Trophy className="h-3 w-3 mr-1" />
              Ouro
            </Button>
            <Button
              variant={filterTier === "Prata" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterTier("Prata")}
              className={filterTier === "Prata" ? "bg-gray-600 hover:bg-gray-700" : ""}
            >
              <Award className="h-3 w-3 mr-1" />
              Prata
            </Button>
            <Button
              variant={filterTier === "Bronze" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterTier("Bronze")}
              className={filterTier === "Bronze" ? "bg-orange-600 hover:bg-orange-700" : ""}
            >
              <Star className="h-3 w-3 mr-1" />
              Bronze
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {filteredClientes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum cliente encontrado com os filtros aplicados.
            </div>
          ) : (
            filteredClientes.map((cliente, index) => (
              <div 
                key={cliente.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Priority Rank */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${getPriorityColor(cliente.priorityScore)}`}>
                    {index + 1}
                  </div>
                  
                  {/* Client Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-foreground">{cliente.nome}</h3>
                      <Badge className={getTierColor(cliente.tier)}>
                        {getTierIcon(cliente.tier)}
                        <span className="ml-1">{cliente.tier}</span>
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Prioridade: {cliente.priorityScore}/10
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-4">
                        <span><strong>Profissão:</strong> {cliente.profissao}</span>
                        {cliente.idade && <span><strong>Idade:</strong> {cliente.idade} anos</span>}
                        {showAssessorColumn && <span><strong>Assessor:</strong> {cliente.assessor}</span>}
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-success font-medium">
                          <strong>Custódia:</strong> {formatCurrency(cliente.custodia)}
                        </span>
                        <span className="text-primary font-medium">
                          <strong>Receita:</strong> {formatCurrency(cliente.receita)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewClient(cliente.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver Detalhes
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onScheduleApproach(cliente.id)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Abordagem
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};