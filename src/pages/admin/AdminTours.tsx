import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  Plus, 
  Map, 
  Calendar, 
  Plane, 
  Clock, 
  DollarSign, 
  Trash2, 
  Pencil,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Types
interface Pricing {
  adultPriceMXN: number;
  childPriceMXN: number;
}

interface TourDay {
  day: number;
  activity: string;
  link: string | null;
  pickup: string;
  dropOff: string;
  departures: string;
  totalTime: string;
  startTime: string | null;
  finishTime: string | null;
  cancelationPolicy: string;
  mealsIncluded: string | null;
  provider: string | null;
  pricing: Pricing;
  description: string;
  pictures: string[];
}

interface Airport {
  name: string;
  code: string;
  transfersIncluded: string;
}

interface Tour {
  _id?: string;
  tourName: string;
  year: number;
  month: string;
  arrivalDate: number;
  departureDate: number;
  airport: Airport;
  days: TourDay[];
  compania: string[];
  destino: string[];
  especial: string[];
  plan: string[];
}

const AdminTours = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [isAddingDay, setIsAddingDay] = useState(false);
  const [isAddingTour, setIsAddingTour] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [newTour, setNewTour] = useState<Partial<Tour>>({
    tourName: '',
    year: new Date().getFullYear(),
    month: '',
    arrivalDate: 1,
    departureDate: 1,
    airport: {
      name: '',
      code: '',
      transfersIncluded: 'Todos'
    },
    days: [],
    compania: [],
    destino: [],
    especial: [],
    plan: []
  });

  const [newDay, setNewDay] = useState<Partial<TourDay>>({
    activity: '',
    link: null,
    pickup: '',
    dropOff: '',
    departures: 'Daily',
    totalTime: '',
    startTime: null,
    finishTime: null,
    cancelationPolicy: 'No returnable',
    mealsIncluded: null,
    provider: null,
    pricing: { adultPriceMXN: 0, childPriceMXN: 0 },
    description: '',
    pictures: [],
  });

  const { toast } = useToast();

  // Fetch tours from MongoDB
  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tours');
      const data = await response.json();
      setTours(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los tours",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTour = async () => {
    if (!newTour.tourName || !newTour.month) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa el nombre y mes del tour",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/tours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTour)
      });

      if (response.ok) {
        const createdTour = await response.json();
        setTours([...tours, createdTour]);
        toast({
          title: "Tour creado",
          description: "El tour ha sido creado exitosamente"
        });
        setIsAddingTour(false);
        resetNewTour();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el tour",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTour = async (tour: Tour) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/tours/${tour._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tour)
      });

      if (response.ok) {
        const updatedTour = await response.json();
        setTours(tours.map(t => t._id === tour._id ? updatedTour : t));
        setSelectedTour(updatedTour);
        toast({
          title: "Tour actualizado",
          description: "Los cambios han sido guardados"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el tour",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTour = async (tourId: string) => {
    if (!confirm('¿Estás seguro de eliminar este tour?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/tours/${tourId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setTours(tours.filter(t => t._id !== tourId));
        setSelectedTour(null);
        toast({
          title: "Tour eliminado",
          description: "El tour ha sido eliminado"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el tour",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddDay = () => {
    if (!selectedTour || !newDay.activity) {
      toast({
        title: "Campo requerido",
        description: "La actividad es obligatoria",
        variant: "destructive"
      });
      return;
    }

    const day: TourDay = {
      day: selectedTour.days.length + 1,
      activity: newDay.activity || '',
      link: newDay.link || null,
      pickup: newDay.pickup || '',
      dropOff: newDay.dropOff || '',
      departures: newDay.departures || 'Daily',
      totalTime: newDay.totalTime || '',
      startTime: newDay.startTime || null,
      finishTime: newDay.finishTime || null,
      cancelationPolicy: newDay.cancelationPolicy || 'No returnable',
      mealsIncluded: newDay.mealsIncluded || null,
      provider: newDay.provider || null,
      pricing: newDay.pricing || { adultPriceMXN: 0, childPriceMXN: 0 },
      description: newDay.description || '',
      pictures: newDay.pictures || [],
    };

    const updatedTour = {
      ...selectedTour,
      days: [...selectedTour.days, day],
    };

    handleUpdateTour(updatedTour);
    setIsAddingDay(false);
    resetNewDay();
  };

  const handleRemoveDay = (dayNumber: number) => {
    if (!selectedTour) return;

    const updatedDays = selectedTour.days
      .filter(d => d.day !== dayNumber)
      .map((d, index) => ({ ...d, day: index + 1 }));

    const updatedTour = {
      ...selectedTour,
      days: updatedDays,
    };

    handleUpdateTour(updatedTour);
  };

  const resetNewDay = () => {
    setNewDay({
      activity: '',
      link: null,
      pickup: '',
      dropOff: '',
      departures: 'Daily',
      totalTime: '',
      startTime: null,
      finishTime: null,
      cancelationPolicy: 'No returnable',
      mealsIncluded: null,
      provider: null,
      pricing: { adultPriceMXN: 0, childPriceMXN: 0 },
      description: '',
      pictures: [],
    });
  };

  const resetNewTour = () => {
    setNewTour({
      tourName: '',
      year: new Date().getFullYear(),
      month: '',
      arrivalDate: 1,
      departureDate: 1,
      airport: {
        name: '',
        code: '',
        transfersIncluded: 'Todos'
      },
      days: [],
      compania: [],
      destino: [],
      especial: [],
      plan: []
    });
  };

  const monthOptions = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Gestión de Tours
            </h1>
            <p className="text-muted-foreground">
              Administra los tours disponibles para tus clientes
            </p>
          </div>
          <Button variant="warm" onClick={() => setIsAddingTour(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Tour
          </Button>
        </div>

        {/* Tours Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Tours List */}
          <div className="space-y-4">
            <h2 className="font-display text-lg font-semibold text-foreground">Tours Disponibles</h2>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Cargando...</div>
            ) : tours.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No hay tours disponibles</div>
            ) : (
              tours.map((tour) => (
                <div
                  key={tour._id}
                  onClick={() => setSelectedTour(tour)}
                  className={`p-5 rounded-xl border cursor-pointer transition-all duration-300 ${
                    selectedTour?._id === tour._id 
                      ? 'bg-primary/5 border-primary shadow-warm' 
                      : 'bg-card border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl gradient-warm flex items-center justify-center shadow-warm">
                      <Map className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-transform ${
                      selectedTour?._id === tour._id ? 'text-primary rotate-90' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                    {tour.tourName}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {tour.month} {tour.year}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {tour.days.length} días
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Tour Details */}
          <div className="lg:col-span-2">
            {selectedTour ? (
              <div className="p-6 rounded-2xl bg-card border border-border shadow-soft space-y-6">
                {/* Tour Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                      {selectedTour.tourName}
                    </h2>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {selectedTour.arrivalDate} - {selectedTour.departureDate} {selectedTour.month} {selectedTour.year}
                      </span>
                      <span className="flex items-center gap-1">
                        <Plane className="w-4 h-4" />
                        {selectedTour.airport.code}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => selectedTour._id && handleDeleteTour(selectedTour._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Days Accordion */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      Itinerario ({selectedTour.days.length} días)
                    </h3>
                    <Button variant="outline" size="sm" onClick={() => setIsAddingDay(true)}>
                      <Plus className="w-4 h-4 mr-1" />
                      Agregar Día
                    </Button>
                  </div>

                  <Accordion type="single" collapsible className="space-y-2">
                    {selectedTour.days.map((day) => (
                      <AccordionItem 
                        key={day.day} 
                        value={`day-${day.day}`}
                        className="border border-border rounded-xl px-4 bg-secondary/30"
                      >
                        <AccordionTrigger className="hover:no-underline py-4">
                          <div className="flex items-center gap-4 text-left">
                            <span className="w-10 h-10 rounded-lg gradient-warm flex items-center justify-center text-primary-foreground font-bold">
                              {day.day}
                            </span>
                            <div>
                              <p className="font-semibold text-foreground">{day.activity}</p>
                              <p className="text-sm text-muted-foreground">
                                {day.totalTime} • ${day.pricing.adultPriceMXN} MXN
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                          <div className="space-y-4 pt-2">
                            <p className="text-muted-foreground text-sm whitespace-pre-line">
                              {day.description}
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Recogida:</span>
                                <p className="font-medium text-foreground">{day.pickup}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Dejada:</span>
                                <p className="font-medium text-foreground">{day.dropOff}</p>
                              </div>
                              {day.startTime && (
                                <div>
                                  <span className="text-muted-foreground">Hora inicio:</span>
                                  <p className="font-medium text-foreground">{day.startTime}</p>
                                </div>
                              )}
                              {day.mealsIncluded && (
                                <div>
                                  <span className="text-muted-foreground">Comidas:</span>
                                  <p className="font-medium text-foreground">{day.mealsIncluded}</p>
                                </div>
                              )}
                              {day.provider && (
                                <div>
                                  <span className="text-muted-foreground">Proveedor:</span>
                                  <p className="font-medium text-foreground">{day.provider}</p>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1 text-sm">
                                  <DollarSign className="w-4 h-4 text-success" />
                                  Adulto: ${day.pricing.adultPriceMXN} MXN
                                </span>
                                <span className="flex items-center gap-1 text-sm">
                                  <DollarSign className="w-4 h-4 text-amber" />
                                  Niño: ${day.pricing.childPriceMXN} MXN
                                </span>
                              </div>
                              <div className="flex gap-2">
                                {day.link && (
                                  <Button variant="ghost" size="sm" asChild>
                                    <a href={day.link} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="w-4 h-4" />
                                    </a>
                                  </Button>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleRemoveDay(day.day)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            {day.pictures.length > 0 && (
                              <div className="flex gap-2 pt-2 overflow-x-auto">
                                {day.pictures.map((pic, idx) => (
                                  <img 
                                    key={idx}
                                    src={pic} 
                                    alt={`${day.activity} ${idx + 1}`}
                                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                {/* Tags */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <h4 className="text-sm font-medium text-muted-foreground">Etiquetas</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTour.compania.map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                        {tag}
                      </span>
                    ))}
                    {selectedTour.destino.map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-amber/10 text-amber text-sm">
                        {tag}
                      </span>
                    ))}
                    {selectedTour.plan.map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-success/10 text-success text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-12 rounded-2xl bg-card border border-border">
                <div className="text-center">
                  <Map className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    Selecciona un Tour
                  </h3>
                  <p className="text-muted-foreground">
                    Haz clic en un tour para ver y editar sus detalles
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Day Dialog */}
        <Dialog open={isAddingDay} onOpenChange={setIsAddingDay}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Agregar Nuevo Día</DialogTitle>
              <DialogDescription>
                Agrega un nuevo día al itinerario del tour
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Actividad *</Label>
                <Input
                  placeholder="Ej: Tour Chichén Itzá"
                  value={newDay.activity}
                  onChange={(e) => setNewDay({ ...newDay, activity: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Link (Opcional)</Label>
                <Input
                  placeholder="https://..."
                  value={newDay.link || ''}
                  onChange={(e) => setNewDay({ ...newDay, link: e.target.value || null })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Recogida</Label>
                  <Input
                    placeholder="Ej: Hotel"
                    value={newDay.pickup}
                    onChange={(e) => setNewDay({ ...newDay, pickup: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dejada</Label>
                  <Input
                    placeholder="Ej: Hotel"
                    value={newDay.dropOff}
                    onChange={(e) => setNewDay({ ...newDay, dropOff: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duración</Label>
                  <Input
                    placeholder="Ej: 8 hrs"
                    value={newDay.totalTime}
                    onChange={(e) => setNewDay({ ...newDay, totalTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Proveedor</Label>
                  <Input
                    placeholder="Ej: Viator"
                    value={newDay.provider || ''}
                    onChange={(e) => setNewDay({ ...newDay, provider: e.target.value || null })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hora Inicio</Label>
                  <Input
                    type="time"
                    value={newDay.startTime || ''}
                    onChange={(e) => setNewDay({ ...newDay, startTime: e.target.value || null })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hora Fin</Label>
                  <Input
                    type="time"
                    value={newDay.finishTime || ''}
                    onChange={(e) => setNewDay({ ...newDay, finishTime: e.target.value || null })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Comidas Incluidas</Label>
                <Input
                  placeholder="Ej: Regional Mexican Food"
                  value={newDay.mealsIncluded || ''}
                  onChange={(e) => setNewDay({ ...newDay, mealsIncluded: e.target.value || null })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Precio Adulto (MXN)</Label>
                  <Input
                    type="number"
                    value={newDay.pricing?.adultPriceMXN || 0}
                    onChange={(e) => setNewDay({ 
                      ...newDay, 
                      pricing: { 
                        ...newDay.pricing!, 
                        adultPriceMXN: Number(e.target.value) 
                      } 
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Precio Niño (MXN)</Label>
                  <Input
                    type="number"
                    value={newDay.pricing?.childPriceMXN || 0}
                    onChange={(e) => setNewDay({ 
                      ...newDay, 
                      pricing: { 
                        ...newDay.pricing!, 
                        childPriceMXN: Number(e.target.value) 
                      } 
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea
                  placeholder="Describe la actividad del día..."
                  value={newDay.description}
                  onChange={(e) => setNewDay({ ...newDay, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>URLs de Imágenes (una por línea)</Label>
                <Textarea
                  placeholder="https://ejemplo.com/imagen1.jpg"
                  value={newDay.pictures?.join('\n') || ''}
                  onChange={(e) => setNewDay({ 
                    ...newDay, 
                    pictures: e.target.value.split('\n').filter(url => url.trim()) 
                  })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingDay(false)}>
                Cancelar
              </Button>
              <Button variant="warm" onClick={handleAddDay} disabled={loading}>
                {loading ? 'Guardando...' : 'Agregar Día'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Tour Dialog */}
        <Dialog open={isAddingTour} onOpenChange={setIsAddingTour}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Crear Nuevo Tour</DialogTitle>
              <DialogDescription>
                Completa la información básica del tour
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nombre del Tour *</Label>
                <Input
                  placeholder="Ej: Merida PLUS"
                  value={newTour.tourName}
                  onChange={(e) => setNewTour({ ...newTour, tourName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Mes *</Label>
                  <Select 
                    value={newTour.month} 
                    onValueChange={(value) => setNewTour({ ...newTour, month: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona mes" />
                    </SelectTrigger>
                    <SelectContent>
                      {monthOptions.map(month => (
                        <SelectItem key={month} value={month}>{month}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Año</Label>
                  <Input
                    type="number"
                    value={newTour.year}
                    onChange={(e) => setNewTour({ ...newTour, year: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fecha de Llegada</Label>
                  <Input
                    type="number"
                    min="1"
                    max="31"
                    value={newTour.arrivalDate}
                    onChange={(e) => setNewTour({ ...newTour, arrivalDate: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fecha de Salida</Label>
                  <Input
                    type="number"
                    min="1"
                    max="31"
                    value={newTour.departureDate}
                    onChange={(e) => setNewTour({ ...newTour, departureDate: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Información del Aeropuerto</Label>
                <div className="space-y-2">
                  <Input
                    placeholder="Nombre del aeropuerto"
                    value={newTour.airport?.name}
                    onChange={(e) => setNewTour({ 
                      ...newTour, 
                      airport: { ...newTour.airport!, name: e.target.value } 
                    })}
                  />
                  <Input
                    placeholder="Código (Ej: MID)"
                    value={newTour.airport?.code}
                    onChange={(e) => setNewTour({ 
                      ...newTour, 
                      airport: { ...newTour.airport!, code: e.target.value.toUpperCase() } 
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Compañía (separados por coma)</Label>
                <Input
                  placeholder="family, partner, friends"
                  value={newTour.compania?.join(', ')}
                  onChange={(e) => setNewTour({ 
                    ...newTour, 
                    compania: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label>Destino (separados por coma)</Label>
                <Input
                  placeholder="beach, nature, city"
                  value={newTour.destino?.join(', ')}
                  onChange={(e) => setNewTour({ 
                    ...newTour, 
                    destino: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label>Plan (separados por coma)</Label>
                <Input
                  placeholder="adventure, relaxation, cultural"
                  value={newTour.plan?.join(', ')}
                  onChange={(e) => setNewTour({ 
                    ...newTour, 
                    plan: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label>Especial (separados por coma)</Label>
                <Input
                  placeholder="none, traveling with kids, elderly"
                  value={newTour.especial?.join(', ')}
                  onChange={(e) => setNewTour({ 
                    ...newTour, 
                    especial: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingTour(false)}>
                Cancelar
              </Button>
              <Button variant="warm" onClick={handleCreateTour} disabled={loading}>
                {loading ? 'Creando...' : 'Crear Tour'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminTours;