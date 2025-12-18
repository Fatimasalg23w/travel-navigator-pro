import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockQuotes, mockTours, mockClients } from '@/data/mockData';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, FileText, DollarSign, Calendar, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Quote } from '@/types';

const AdvisorQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>(mockQuotes);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all');
  const [newQuote, setNewQuote] = useState({
    clientId: '',
    tourId: '',
    type: 'hotel_flight' as 'hotel_flight' | 'hotel_flight_tour',
    totalPrice: 0,
    comments: '',
  });
  const { toast } = useToast();

  const filteredQuotes = quotes.filter(q => {
    if (filter === 'all') return true;
    return q.status === filter;
  });

  const handleCreateQuote = () => {
    if (!newQuote.clientId) {
      toast({
        title: "Error",
        description: "Por favor selecciona un cliente",
        variant: "destructive",
      });
      return;
    }

    const client = mockClients.find(c => c.id === newQuote.clientId);
    const tour = mockTours.find(t => t.id === newQuote.tourId);

    const quote: Quote = {
      id: String(quotes.length + 1),
      clientId: newQuote.clientId,
      clientName: client?.name || '',
      advisorId: '1',
      tourId: newQuote.tourId || undefined,
      tourName: tour?.tourName,
      status: 'pending',
      type: newQuote.type,
      totalPrice: newQuote.totalPrice,
      comments: newQuote.comments,
      createdAt: new Date(),
    };

    setQuotes([quote, ...quotes]);
    setNewQuote({
      clientId: '',
      tourId: '',
      type: 'hotel_flight',
      totalPrice: 0,
      comments: '',
    });
    setIsDialogOpen(false);

    toast({
      title: "Cotización creada",
      description: `Cotización para ${client?.name} creada exitosamente`,
    });
  };

  const handleUpdateStatus = (quoteId: string, newStatus: 'pending' | 'done') => {
    setQuotes(quotes.map(q => 
      q.id === quoteId ? { ...q, status: newStatus } : q
    ));
    toast({
      title: "Estado actualizado",
      description: `La cotización ha sido marcada como ${newStatus === 'done' ? 'completada' : 'pendiente'}`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Mis Cotizaciones
            </h1>
            <p className="text-muted-foreground">
              Gestiona las cotizaciones para tus clientes
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="warm">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Cotización
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">Crear Cotización</DialogTitle>
                <DialogDescription>
                  Crea una nueva cotización para un cliente
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Cliente *</Label>
                  <Select 
                    value={newQuote.clientId} 
                    onValueChange={(value) => setNewQuote({ ...newQuote, clientId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockClients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Paquete</Label>
                  <Select 
                    value={newQuote.type} 
                    onValueChange={(value: 'hotel_flight' | 'hotel_flight_tour') => 
                      setNewQuote({ ...newQuote, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hotel_flight">Hotel + Vuelo</SelectItem>
                      <SelectItem value="hotel_flight_tour">Hotel + Vuelo + Tour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newQuote.type === 'hotel_flight_tour' && (
                  <div className="space-y-2">
                    <Label>Tour</Label>
                    <Select 
                      value={newQuote.tourId} 
                      onValueChange={(value) => setNewQuote({ ...newQuote, tourId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tour" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockTours.map((tour) => (
                          <SelectItem key={tour.id} value={tour.id}>
                            {tour.tourName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Precio Total (MXN)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newQuote.totalPrice || ''}
                    onChange={(e) => setNewQuote({ ...newQuote, totalPrice: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Comentarios</Label>
                  <Textarea
                    placeholder="Notas adicionales sobre la cotización..."
                    value={newQuote.comments}
                    onChange={(e) => setNewQuote({ ...newQuote, comments: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="warm" onClick={handleCreateQuote}>
                  Crear Cotización
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 p-1 rounded-xl bg-secondary/50 w-fit">
          {(['all', 'pending', 'done'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                filter === status 
                  ? "bg-card text-foreground shadow-soft" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {status === 'all' && 'Todas'}
              {status === 'pending' && 'Pendientes'}
              {status === 'done' && 'Completadas'}
            </button>
          ))}
        </div>

        {/* Quotes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuotes.map((quote) => (
            <div
              key={quote.id}
              className="p-5 rounded-xl bg-card border border-border shadow-soft hover:shadow-elevated transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-warm flex items-center justify-center shadow-warm">
                    <FileText className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{quote.clientName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {quote.type === 'hotel_flight_tour' ? 'Hotel + Vuelo + Tour' : 'Hotel + Vuelo'}
                    </p>
                  </div>
                </div>
              </div>

              {quote.tourName && (
                <div className="mb-3 px-3 py-2 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="text-sm font-medium text-primary">{quote.tourName}</p>
                </div>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    Total
                  </span>
                  <span className="font-bold text-foreground">${quote.totalPrice.toLocaleString()} MXN</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Fecha
                  </span>
                  <span className="text-sm text-foreground">
                    {format(quote.createdAt, "d MMM yyyy", { locale: es })}
                  </span>
                </div>
              </div>

              {quote.comments && (
                <div className="mb-4 p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <MessageSquare className="w-4 h-4" />
                    Comentarios
                  </div>
                  <p className="text-sm text-foreground">{quote.comments}</p>
                </div>
              )}

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                  quote.status === 'done' 
                    ? 'bg-success/20 text-success' 
                    : 'bg-amber/20 text-amber'
                )}>
                  {quote.status === 'done' ? (
                    <><CheckCircle className="w-3 h-3" /> Completada</>
                  ) : (
                    <><Clock className="w-3 h-3" /> Pendiente</>
                  )}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleUpdateStatus(
                    quote.id, 
                    quote.status === 'done' ? 'pending' : 'done'
                  )}
                >
                  {quote.status === 'done' ? 'Marcar Pendiente' : 'Marcar Completada'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredQuotes.length === 0 && (
          <div className="p-12 text-center rounded-xl bg-card border border-border">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No hay cotizaciones
            </h3>
            <p className="text-muted-foreground mb-4">
              No se encontraron cotizaciones con el filtro seleccionado
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdvisorQuotes;
