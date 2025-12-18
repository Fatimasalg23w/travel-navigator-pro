import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockVideoCalls, mockAdvisors, categoryLabels, categoryColors } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Video, UserPlus, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { VideoCall } from '@/types';

const AdminVideoCalls = () => {
  const [videoCalls, setVideoCalls] = useState(mockVideoCalls);
  const [selectedCall, setSelectedCall] = useState<VideoCall | null>(null);
  const [selectedAdvisor, setSelectedAdvisor] = useState('');
  const { toast } = useToast();

  const handleAssignAdvisor = () => {
    if (!selectedCall || !selectedAdvisor) return;

    const advisor = mockAdvisors.find(a => a.id === selectedAdvisor);
    if (!advisor) return;

    setVideoCalls(videoCalls.map(call => 
      call.id === selectedCall.id 
        ? { ...call, advisorId: advisor.id, advisorName: advisor.name }
        : call
    ));

    toast({
      title: "Advisor asignado",
      description: `${advisor.name} ha sido asignado a la videollamada`,
    });

    setSelectedCall(null);
    setSelectedAdvisor('');
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Asignar Videollamadas
          </h1>
          <p className="text-muted-foreground">
            Asigna advisors a las videollamadas pendientes
          </p>
        </div>

        {/* Video Calls Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videoCalls.map((call) => (
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
                    <span className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      categoryColors[call.category]
                    )}>
                      {categoryLabels[call.category]}
                    </span>
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

              <div className="pt-4 border-t border-border">
                {call.advisorName ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full gradient-warm flex items-center justify-center text-primary-foreground text-sm font-bold">
                        {call.advisorName.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-foreground">{call.advisorName}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedCall(call)}
                    >
                      Reasignar
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setSelectedCall(call)}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Asignar Advisor
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Assign Dialog */}
        <Dialog open={!!selectedCall} onOpenChange={() => setSelectedCall(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Asignar Advisor</DialogTitle>
              <DialogDescription>
                Selecciona un advisor para esta videollamada
              </DialogDescription>
            </DialogHeader>
            {selectedCall && (
              <div className="space-y-4 py-4">
                <div className="p-4 rounded-xl bg-secondary/50">
                  <p className="text-sm text-muted-foreground mb-1">Cliente</p>
                  <p className="font-semibold text-foreground">{selectedCall.clientName}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {format(selectedCall.scheduledAt, "EEEE d 'de' MMMM, HH:mm", { locale: es })}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Seleccionar Advisor</Label>
                  <Select value={selectedAdvisor} onValueChange={setSelectedAdvisor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Elige un advisor" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAdvisors.map((advisor) => (
                        <SelectItem key={advisor.id} value={advisor.id}>
                          {advisor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedCall(null)}>
                Cancelar
              </Button>
              <Button variant="warm" onClick={handleAssignAdvisor} disabled={!selectedAdvisor}>
                Asignar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminVideoCalls;
