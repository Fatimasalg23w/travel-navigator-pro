import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/cards/StatCard';
import VideoCallCard from '@/components/cards/VideoCallCard';
import { mockAdvisors, mockClients, mockVideoCalls, mockTours } from '@/data/mockData';
import { Calendar, Users, UserCircle, Map, Video, ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  const scheduledCalls = mockVideoCalls.filter(v => v.status === 'scheduled');
  const todayCalls = scheduledCalls.slice(0, 3);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              ¡Bienvenido de vuelta!
            </h1>
            <p className="text-muted-foreground">
              Aquí está el resumen de tu agencia hoy
            </p>
          </div>
          <Button variant="warm" asChild>
            <Link to="/admin/agenda">
              <Calendar className="w-4 h-4 mr-2" />
              Ver Agenda Completa
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Videollamadas Hoy"
            value={todayCalls.length}
            icon={Video}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Advisors Activos"
            value={mockAdvisors.length}
            icon={Users}
          />
          <StatCard
            title="Clientes Totales"
            value={mockClients.length}
            icon={UserCircle}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Tours Disponibles"
            value={mockTours.length}
            icon={Map}
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upcoming Video Calls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Próximas Videollamadas
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/videocalls" className="text-primary">
                  Ver todas <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="space-y-4">
              {todayCalls.length > 0 ? (
                todayCalls.map((call) => (
                  <VideoCallCard key={call.id} videoCall={call} />
                ))
              ) : (
                <div className="p-8 text-center rounded-xl bg-card border border-border">
                  <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No hay videollamadas programadas</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats & Actions */}
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Rendimiento del Equipo
            </h2>
            <div className="space-y-3">
              {mockAdvisors.map((advisor) => (
                <div 
                  key={advisor.id}
                  className="p-4 rounded-xl bg-card border border-border flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full gradient-warm flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {advisor.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{advisor.name}</h4>
                    <p className="text-sm text-muted-foreground">{advisor.email}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-success text-sm font-medium">
                      <TrendingUp className="w-4 h-4" />
                      {advisor.quotes} cotizaciones
                    </div>
                    <p className="text-xs text-muted-foreground">{advisor.videoCalls} llamadas</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="pt-4 space-y-3">
              <h3 className="font-display text-lg font-semibold text-foreground">
                Acciones Rápidas
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto py-4 flex-col" asChild>
                  <Link to="/admin/advisors">
                    <Users className="w-6 h-6 mb-2" />
                    <span>Agregar Advisor</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col" asChild>
                  <Link to="/admin/tours">
                    <Map className="w-6 h-6 mb-2" />
                    <span>Gestionar Tours</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
