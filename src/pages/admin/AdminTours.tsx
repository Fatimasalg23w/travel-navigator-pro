import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockTours, mockTour } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Image, 
  Trash2, 
  Pencil,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tour, TourDay } from '@/types';

const AdminTours = () => {
  const [tours, setTours] = useState<Tour[]>(mockTours);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingDay, setIsAddingDay] = useState(false);
  const [newDay, setNewDay] = useState<Partial<TourDay>>({
    activity: '',
    pickup: '',
    dropOff: '',
    totalTime: '',
    description: '',
    pricing: { adultPriceMXN: 0, childPriceMXN: 0 },
    pictures: [],
  });
  const { toast } = useToast();

  const handleAddDay = () => {
    if (!selectedTour || !newDay.activity) return;

    const day: TourDay = {
      day: selectedTour.days.length + 1,
      activity: newDay.activity || '',
      pickup: newDay.pickup || '',
      dropOff: newDay.dropOff || '',
      departures: 'Daily',
      totalTime: newDay.totalTime || '',
      cancelationPolicy: 'No returnable',
      description: newDay.description || '',
      pricing: newDay.pricing || { adultPriceMXN: 0, childPriceMXN: 0 },
      pictures: newDay.pictures || [],
    };

    const updatedTour = {
      ...selectedTour,
      days: [...selectedTour.days, day],
    };

    setTours(tours.map(t => t.id === selectedTour.id ? updatedTour : t));
    setSelectedTour(updatedTour);
    setIsAddingDay(false);
    setNewDay({
      activity: '',
      pickup: '',
      dropOff: '',
      totalTime: '',
      description: '',
      pricing: { adultPriceMXN: 0, childPriceMXN: 0 },
      pictures: [],
    });

    toast({
      title: "Día agregado",
      description: `El día ${day.day} ha sido agregado al tour`,
    });
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

    setTours(tours.map(t => t.id === selectedTour.id ? updatedTour : t));
    setSelectedTour(updatedTour);

    toast({
      title: "Día eliminado",
      description: "El día ha sido eliminado del tour",
    });
  };

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
          <Button variant="warm">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Tour
          </Button>
        </div>

        {/* Tours Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Tours List */}
          <div className="space-y-4">
            <h2 className="font-display text-lg font-semibold text-foreground">Tours Disponibles</h2>
            {tours.map((tour) => (
              <div
                key={tour.id}
                onClick={() => setSelectedTour(tour)}
                className={`p-5 rounded-xl border cursor-pointer transition-all duration-300 ${
                  selectedTour?.id === tour.id 
                    ? 'bg-primary/5 border-primary shadow-warm' 
                    : 'bg-card border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl gradient-warm flex items-center justify-center shadow-warm">
                    <Map className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-transform ${
                    selectedTour?.id === tour.id ? 'text-primary rotate-90' : 'text-muted-foreground'
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
            ))}
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
                    <Button variant="outline" size="icon">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="text-destructive hover:text-destructive">
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
                              <div className="flex gap-2 pt-2">
                                {day.pictures.map((pic, idx) => (
                                  <img 
                                    key={idx}
                                    src={pic} 
                                    alt={`${day.activity} ${idx + 1}`}
                                    className="w-20 h-20 rounded-lg object-cover"
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
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Agregar Nuevo Día</DialogTitle>
              <DialogDescription>
                Agrega un nuevo día al itinerario del tour
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <Label>Actividad *</Label>
                <Input
                  placeholder="Ej: Tour Chichén Itzá"
                  value={newDay.activity}
                  onChange={(e) => setNewDay({ ...newDay, activity: e.target.value })}
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
              <div className="space-y-2">
                <Label>Duración</Label>
                <Input
                  placeholder="Ej: 8 hrs"
                  value={newDay.totalTime}
                  onChange={(e) => setNewDay({ ...newDay, totalTime: e.target.value })}
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingDay(false)}>
                Cancelar
              </Button>
              <Button variant="warm" onClick={handleAddDay}>
                Agregar Día
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminTours;
