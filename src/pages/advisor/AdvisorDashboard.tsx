import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/cards/StatCard';
import VideoCallCard from '@/components/cards/VideoCallCard';
import { mockQuotes, mockVideoCalls } from '@/data/mockData';
import { FileText, Video, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const AdvisorDashboard = () => {
  const myVideoCalls = mockVideoCalls.filter(v => v.advisorId === '1').slice(0, 3);
  const pendingQuotes = mockQuotes.filter(q => q.status === 'pending');
  const completedQuotes = mockQuotes.filter(q => q.status === 'done');

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              ¡Hola, María!
            </h1>
            <p className="text-muted-foreground">
              Aquí está tu resumen de actividades
            </p>
          </div>
          <Button variant="warm" asChild>
            <Link to="/advisor/quotes">
              <FileText className="w-4 h-4 mr-2" />
              Nueva Cotización
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Videollamadas Hoy"
            value={myVideoCalls.length}
            icon={Video}
          />
          <StatCard
            title="Cotizaciones Pendientes"
            value={pendingQuotes.length}
            icon={Clock}
          />
          <StatCard
            title="Cotizaciones Completadas"
            value={completedQuotes.length}
            icon={CheckCircle}
            trend={{ value: 15, isPositive: true }}
          />
          <StatCard
            title="Total Cotizaciones"
            value={mockQuotes.length}
            icon={FileText}
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* My Video Calls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Mis Videollamadas
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/advisor/videocalls" className="text-primary">
                  Ver todas <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="space-y-4">
              {myVideoCalls.length > 0 ? (
                myVideoCalls.map((call) => (
                  <VideoCallCard key={call.id} videoCall={call} />
                ))
              ) : (
                <div className="p-8 text-center rounded-xl bg-card border border-border">
                  <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No tienes videollamadas asignadas</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Quotes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Cotizaciones Recientes
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/advisor/quotes" className="text-primary">
                  Ver todas <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="space-y-3">
              {mockQuotes.map((quote) => (
                <div 
                  key={quote.id}
                  className="p-4 rounded-xl bg-card border border-border flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{quote.clientName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {quote.tourName || 'Hotel + Vuelo'} • ${quote.totalPrice.toLocaleString()} MXN
                    </p>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium",
                    quote.status === 'done' 
                      ? 'bg-success/20 text-success' 
                      : 'bg-amber/20 text-amber'
                  )}>
                    {quote.status === 'done' ? 'Completada' : 'Pendiente'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdvisorDashboard;
