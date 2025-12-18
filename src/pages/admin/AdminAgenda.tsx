import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import VideoCallCard from '@/components/cards/VideoCallCard';
import { mockVideoCalls, categoryLabels } from '@/data/mockData';
import { Calendar, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const AdminAgenda = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCalls = mockVideoCalls.filter((call) => {
    const matchesStatus = statusFilter === 'all' || call.status === statusFilter;
    const matchesSearch = call.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.advisorName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const groupedCalls = filteredCalls.reduce((groups, call) => {
    const date = format(call.scheduledAt, 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(call);
    return groups;
  }, {} as Record<string, typeof mockVideoCalls>);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Agenda de Videollamadas
            </h1>
            <p className="text-muted-foreground">
              Gestiona todas las videollamadas programadas
            </p>
          </div>
          <Button variant="warm">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Videollamada
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-card border border-border">
          <div className="flex-1">
            <Input
              placeholder="Buscar por cliente o advisor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="scheduled">Programadas</SelectItem>
              <SelectItem value="completed">Completadas</SelectItem>
              <SelectItem value="cancelled">Canceladas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Calls by Date */}
        <div className="space-y-6">
          {Object.entries(groupedCalls).length > 0 ? (
            Object.entries(groupedCalls)
              .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
              .map(([date, calls]) => (
                <div key={date} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground capitalize">
                      {format(new Date(date), "EEEE d 'de' MMMM, yyyy", { locale: es })}
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
                      {calls.length} {calls.length === 1 ? 'llamada' : 'llamadas'}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 ml-13">
                    {calls.map((call) => (
                      <VideoCallCard key={call.id} videoCall={call} />
                    ))}
                  </div>
                </div>
              ))
          ) : (
            <div className="p-12 text-center rounded-xl bg-card border border-border">
              <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                No hay videollamadas
              </h3>
              <p className="text-muted-foreground mb-4">
                No se encontraron videollamadas con los filtros seleccionados
              </p>
              <Button variant="outline" onClick={() => { setStatusFilter('all'); setSearchQuery(''); }}>
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAgenda;
