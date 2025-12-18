import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockVideoCalls, categoryLabels, categoryColors } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Video, Clock, Calendar, MessageSquare, CheckCircle, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { VideoCall, VideoCallCategory } from '@/types';

const AdvisorVideoCalls = () => {
  const [videoCalls, setVideoCalls] = useState(
    mockVideoCalls.filter(v => v.advisorId === '1')
  );
  const [selectedCall, setSelectedCall] = useState<VideoCall | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  const filteredCalls = videoCalls.filter(call => {
    const matchesCategory = categoryFilter === 'all' || call.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || call.status === statusFilter;
    return matchesCategory && matchesStatus;
  });

  const handleUpdateCategory = (callId: string, category: VideoCallCategory) => {
    setVideoCalls(videoCalls.map(call =>
      call.id === callId ? { ...call, category } : call
    ));
    toast({
      title: "Categoría actualizada",
      description: `La videollamada ha sido categorizada como ${categoryLabels[category]}`,
    });
  };

  const handleMarkComplete = (callId: string) => {
    setVideoCalls(videoCalls.map(call =>
      call.id === callId ? { ...call, status: 'completed' as const } : call
    ));
    setSelectedCall(null);
    toast({
      title: "Videollamada completada",
      description: "La videollamada ha sido marcada como completada",
    });
  };

  const handleUpdateNotes = (callId: string, notes: string) => {
    setVideoCalls(videoCalls.map(call =>
      call.id === callId ? { ...call, notes } : call
    ));
  };

  const statusColors = {
    scheduled: 'bg-amber/20 text-amber border-amber/30',
    completed: 'bg-success/20 text-success border-success/30',
    cancelled: 'bg-destructive/20 text-destructive border-destructive/30',
  };

  const statusLabels = {
    scheduled: 'Programada',
    completed: 'Completada',
    cancelled: 'Cancelada',
  };

  const categories: VideoCallCategory[] = [
    'request', 'bachelor_party', 'wedding', 'proposal', 'honeymoon',
    'birthday', 'custom_trip', 'business_trip', 'group_trip', 'booking_confirmation'
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Mis Videollamadas
          </h1>
          <p className="text-muted-foreground">
            Gestiona y categoriza tus videollamadas
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filtrar:</span>
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{categoryLabels[cat]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
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

        {/* Video Calls Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCalls.map((call) => (
            <div
              key={call.id}
              className="p-5 rounded-xl bg-card border border-border shadow-soft hover:shadow-elevated transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center">
                    <Video className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{call.clientName}</h4>
                  </div>
                </div>
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium border",
                  statusColors[call.status]
                )}>
                  {statusLabels[call.status]}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{format(call.scheduledAt, "d MMM yyyy", { locale: es })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{format(call.scheduledAt, "HH:mm")}</span>
                </div>
              </div>

              {/* Category Selector */}
              <div className="mb-4">
                <Select 
                  value={call.category} 
                  onValueChange={(value: VideoCallCategory) => handleUpdateCategory(call.id, value)}
                >
                  <SelectTrigger className={cn("h-9 text-xs", categoryColors[call.category])}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {categoryLabels[cat]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {call.notes && (
                <div className="mb-4 p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <MessageSquare className="w-3 h-3" />
                    Notas
                  </div>
                  <p className="text-sm text-foreground line-clamp-2">{call.notes}</p>
                </div>
              )}

              <div className="pt-4 border-t border-border">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                  onClick={() => setSelectedCall(call)}
                >
                  {call.status === 'completed' ? 'Ver Detalles' : 'Gestionar'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredCalls.length === 0 && (
          <div className="p-12 text-center rounded-xl bg-card border border-border">
            <Video className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No hay videollamadas
            </h3>
            <p className="text-muted-foreground">
              No se encontraron videollamadas con los filtros seleccionados
            </p>
          </div>
        )}

        {/* Detail Dialog */}
        <Dialog open={!!selectedCall} onOpenChange={() => setSelectedCall(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Detalles de Videollamada</DialogTitle>
              <DialogDescription>
                Gestiona los detalles y notas de esta videollamada
              </DialogDescription>
            </DialogHeader>
            {selectedCall && (
              <div className="space-y-4 py-4">
                <div className="p-4 rounded-xl bg-secondary/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl gradient-warm flex items-center justify-center">
                      <Video className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{selectedCall.clientName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(selectedCall.scheduledAt, "EEEE d 'de' MMMM, HH:mm", { locale: es })}
                      </p>
                    </div>
                  </div>
                  <span className={cn(
                    "inline-block px-3 py-1 rounded-lg text-sm font-medium",
                    categoryColors[selectedCall.category]
                  )}>
                    {categoryLabels[selectedCall.category]}
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Comentarios</label>
                  <Textarea
                    placeholder="Agrega notas sobre la videollamada..."
                    value={selectedCall.notes || ''}
                    onChange={(e) => {
                      setSelectedCall({ ...selectedCall, notes: e.target.value });
                      handleUpdateNotes(selectedCall.id, e.target.value);
                    }}
                    rows={4}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedCall(null)}>
                Cerrar
              </Button>
              {selectedCall?.status === 'scheduled' && (
                <Button 
                  variant="warm" 
                  onClick={() => handleMarkComplete(selectedCall.id)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Marcar Completada
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdvisorVideoCalls;
