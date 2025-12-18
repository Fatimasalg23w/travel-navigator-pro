import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockClients, mockQuotes } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Hash, User, MapPin, DollarSign, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const AdminReservations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<typeof mockClients[0] | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    setSearched(true);
    const client = mockClients.find(
      (c) => c.reservationNumber?.toLowerCase() === searchQuery.toLowerCase()
    );
    setSearchResult(client || null);
  };

  const clientQuotes = searchResult
    ? mockQuotes.filter((q) => q.clientId === searchResult.id)
    : [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Buscar Reservaciones
          </h1>
          <p className="text-muted-foreground">
            Busca reservaciones por número para ver los detalles del cliente
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-card border border-border shadow-soft">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Ingresa el número de reservación (ej: RES-2025-001)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button variant="warm" size="lg" onClick={handleSearch}>
              <Search className="w-5 h-5 mr-2" />
              Buscar
            </Button>
          </div>
        </div>

        {/* Search Results */}
        {searched && (
          <div className="max-w-4xl mx-auto">
            {searchResult ? (
              <div className="space-y-6 animate-fade-in">
                {/* Client Card */}
                <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
                  <div className="flex items-start gap-6">
                    <div className="w-20 h-20 rounded-2xl gradient-warm flex items-center justify-center text-primary-foreground font-bold text-3xl shadow-warm">
                      {searchResult.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="font-display text-2xl font-bold text-foreground">
                          {searchResult.name}
                        </h2>
                        <span className="px-3 py-1 rounded-full bg-success/20 text-success text-sm font-medium">
                          Cliente Activo
                        </span>
                      </div>
                      <div className="grid sm:grid-cols-3 gap-4 mt-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span>{searchResult.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{searchResult.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-primary font-semibold">
                          <Hash className="w-4 h-4" />
                          <span>{searchResult.reservationNumber}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quotes */}
                {clientQuotes.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      Cotizaciones del Cliente
                    </h3>
                    <div className="grid gap-4">
                      {clientQuotes.map((quote) => (
                        <div
                          key={quote.id}
                          className="p-5 rounded-xl bg-card border border-border flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                              <FileText className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground">
                                {quote.tourName || 'Hotel + Vuelo'}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {quote.type === 'hotel_flight_tour' ? 'Hotel + Vuelo + Tour' : 'Hotel + Vuelo'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-lg font-bold text-foreground">
                                <DollarSign className="w-5 h-5" />
                                {quote.totalPrice.toLocaleString()} MXN
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                {format(quote.createdAt, "d MMM yyyy", { locale: es })}
                              </div>
                            </div>
                            <span className={cn(
                              "px-3 py-1 rounded-full text-sm font-medium",
                              quote.status === 'done' 
                                ? 'bg-success/20 text-success' 
                                : 'bg-amber/20 text-amber'
                            )}>
                              {quote.status === 'done' ? 'Confirmado' : 'Pendiente'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center rounded-2xl bg-card border border-border animate-fade-in">
                <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  Reservación no encontrada
                </h3>
                <p className="text-muted-foreground">
                  No se encontró ninguna reservación con el número "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminReservations;
