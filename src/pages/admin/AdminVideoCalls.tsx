import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockVideoCalls, mockAdvisors, categoryLabels, categoryColors } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Video, UserPlus, Clock, Calendar, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { VideoCall } from '@/types';

const AdminVideoCalls = () => {
  const [videoCalls, setVideoCalls] = useState(mockVideoCalls);
  const [selectedCall, setSelectedCall] = useState<VideoCall | null>(null);
  const [selectedAdvisor, setSelectedAdvisor] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newCall, setNewCall] = useState({
    link: '',
    advisorId: '',
    callType: '', // 'reservacion' or 'cotizacion'
    reservationType: '', // 'hotel-vuelo' or 'hotel-vuelo-tour'
    tripType: '', // for cotizacion
    numPersonas: '',
    fechaInicio: '',
    fechaFin: '',
    origen: '',
    destino: '',
    needsFlight: false,
    needsHotel: false,
    presupuesto: '',
    descripcion: ''
  });
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

  const handleCreateCall = () => {
    if (!newCall.link || !newCall.advisorId || !newCall.callType) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    const advisor = mockAdvisors.find(a => a.id === newCall.advisorId);
    if (!advisor) return;

    const newVideoCall = {
      id: `call-${Date.now()}`,
      clientName: newCall.origen || 'Cliente',
      category: 'cotizacion' as const,
      status: 'scheduled' as const,
      scheduledAt: newCall.fechaInicio ? new Date(newCall.fechaInicio) : new Date(),
      advisorId: advisor.id,
      advisorName: advisor.name,
      link: newCall.link,
      callType: newCall.callType,
      reservationType: newCall.reservationType,
      tripType: newCall.tripType,
      details: {
        numPersonas: newCall.numPersonas,
        fechaInicio: newCall.fechaInicio,
        fechaFin: newCall.fechaFin,
        origen: newCall.origen,
        destino: newCall.destino,
        needsFlight: newCall.needsFlight,
        needsHotel: newCall.needsHotel,
        presupuesto: newCall.presupuesto,
        descripcion: newCall.descripcion
      }
    };

    setVideoCalls([newVideoCall, ...videoCalls]);

    toast({
      title: "Videollamada creada",
      description: `Videollamada asignada a ${advisor.name}`,
    });

    // Reset form
    setNewCall({
      link: '',
      advisorId: '',
      callType: '',
      reservationType: '',
      tripType: '',
      numPersonas: '',
      fechaInicio: '',
      fechaFin: '',
      origen: '',
      destino: '',
      needsFlight: false,
      needsHotel: false,
      presupuesto: '',
      descripcion: ''
    });
    setShowCreateDialog(false);
  };

  const tripTypeOptions = [
    { value: 'marriage-proposals', label: 'Marriage Proposals' },
    { value: 'weddings', label: 'Weddings' },
    { value: 'honeymoon', label: 'Honeymoon' },
    { value: 'bachelor-party', label: 'Bachelor/ette Party' },
    { value: 'birthday', label: 'Birthday' },
    { value: 'anniversary', label: 'Anniversary' },
    { value: 'custom-trips', label: 'Custom Trips' },
    { value: 'business-trips', label: 'Business Trips' },
    { value: 'group-trips', label: 'Group Trips' }
  ];

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Asignar Videollamadas
            </h1>
            <p className="text-muted-foreground">
              Crea y asigna videollamadas a los advisors
            </p>
          </div>
          <Button variant="warm" onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Videollamada
          </Button>
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

        {/* Create Video Call Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Nueva Videollamada</DialogTitle>
              <DialogDescription>
                Completa la información para crear una nueva videollamada
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Link de Videollamada */}
              <div className="space-y-2">
                <Label htmlFor="link">Link de Videollamada *</Label>
                <Input
                  id="link"
                  placeholder="https://meet.google.com/..."
                  value={newCall.link}
                  onChange={(e) => setNewCall({ ...newCall, link: e.target.value })}
                />
              </div>

              {/* Advisor */}
              <div className="space-y-2">
                <Label>Asesor Asignado *</Label>
                <Select value={newCall.advisorId} onValueChange={(value) => setNewCall({ ...newCall, advisorId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un asesor" />
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

              {/* Tipo de Llamada */}
              <div className="space-y-2">
                <Label>Tipo de Llamada *</Label>
                <Select value={newCall.callType} onValueChange={(value) => setNewCall({ ...newCall, callType: value, reservationType: '', tripType: '' })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reservacion">Reservación</SelectItem>
                    <SelectItem value="cotizacion">Cotización</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Subtipo para Reservación */}
              {newCall.callType === 'reservacion' && (
                <div className="space-y-2">
                  <Label>Tipo de Reservación *</Label>
                  <Select value={newCall.reservationType} onValueChange={(value) => setNewCall({ ...newCall, reservationType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hotel-vuelo">Hotel + Vuelo</SelectItem>
                      <SelectItem value="hotel-vuelo-tour">Hotel + Vuelo + Tour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Tipo de Viaje para Cotización */}
              {newCall.callType === 'cotizacion' && (
                <div className="space-y-2">
                  <Label>Motivo del Viaje *</Label>
                  <Select value={newCall.tripType} onValueChange={(value) => setNewCall({ ...newCall, tripType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el motivo" />
                    </SelectTrigger>
                    <SelectContent>
                      {tripTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Detalles del Viaje */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numPersonas">Número de Personas</Label>
                  <Input
                    id="numPersonas"
                    type="number"
                    placeholder="2"
                    value={newCall.numPersonas}
                    onChange={(e) => setNewCall({ ...newCall, numPersonas: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="presupuesto">Presupuesto</Label>
                  <Input
                    id="presupuesto"
                    placeholder="$5,000 USD"
                    value={newCall.presupuesto}
                    onChange={(e) => setNewCall({ ...newCall, presupuesto: e.target.value })}
                  />
                </div>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
                  <Input
                    id="fechaInicio"
                    type="date"
                    value={newCall.fechaInicio}
                    onChange={(e) => setNewCall({ ...newCall, fechaInicio: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaFin">Fecha de Fin</Label>
                  <Input
                    id="fechaFin"
                    type="date"
                    value={newCall.fechaFin}
                    onChange={(e) => setNewCall({ ...newCall, fechaFin: e.target.value })}
                  />
                </div>
              </div>

              {/* Origen y Destino */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origen">Origen</Label>
                  <Input
                    id="origen"
                    placeholder="Ciudad de México"
                    value={newCall.origen}
                    onChange={(e) => setNewCall({ ...newCall, origen: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destino">Destino</Label>
                  <Input
                    id="destino"
                    placeholder="Cancún"
                    value={newCall.destino}
                    onChange={(e) => setNewCall({ ...newCall, destino: e.target.value })}
                  />
                </div>
              </div>

              {/* Necesidades */}
              <div className="space-y-3">
                <Label>Necesidades</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCall.needsFlight}
                      onChange={(e) => setNewCall({ ...newCall, needsFlight: e.target.checked })}
                      className="w-4 h-4 rounded border-border"
                    />
                    <span className="text-sm">Necesita Vuelo</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCall.needsHotel}
                      onChange={(e) => setNewCall({ ...newCall, needsHotel: e.target.checked })}
                      className="w-4 h-4 rounded border-border"
                    />
                    <span className="text-sm">Necesita Hotel</span>
                  </label>
                </div>
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción General</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Detalles adicionales sobre el viaje..."
                  value={newCall.descripcion}
                  onChange={(e) => setNewCall({ ...newCall, descripcion: e.target.value })}
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancelar
              </Button>
              <Button variant="warm" onClick={handleCreateCall}>
                Crear Videollamada
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminVideoCalls;