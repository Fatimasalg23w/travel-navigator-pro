import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockAdvisors } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Mail, Phone, Calendar, Video, FileText, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

const AdminAdvisors = () => {
  const [advisors, setAdvisors] = useState(mockAdvisors);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAdvisor, setNewAdvisor] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const { toast } = useToast();

  const handleCreateAdvisor = () => {
    if (!newAdvisor.name || !newAdvisor.email || !newAdvisor.password) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    const advisor = {
      id: String(advisors.length + 1),
      name: newAdvisor.name,
      email: newAdvisor.email,
      phone: newAdvisor.phone,
      createdAt: new Date(),
      videoCalls: 0,
      quotes: 0,
    };

    setAdvisors([...advisors, advisor]);
    setNewAdvisor({ name: '', email: '', phone: '', password: '' });
    setIsDialogOpen(false);
    
    toast({
      title: "Advisor creado",
      description: `${advisor.name} ha sido agregado exitosamente`,
    });
  };

  const handleDeleteAdvisor = (id: string) => {
    setAdvisors(advisors.filter(a => a.id !== id));
    toast({
      title: "Advisor eliminado",
      description: "El advisor ha sido eliminado del sistema",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Gestión de Advisors
            </h1>
            <p className="text-muted-foreground">
              Administra los perfiles de tus asesores de viajes
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="warm">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Advisor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">Crear Nuevo Advisor</DialogTitle>
                <DialogDescription>
                  Ingresa los datos del nuevo asesor de viajes
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo *</Label>
                  <Input
                    id="name"
                    placeholder="Ej: Juan Pérez"
                    value={newAdvisor.name}
                    onChange={(e) => setNewAdvisor({ ...newAdvisor, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="advisor@3enruta.com"
                    value={newAdvisor.email}
                    onChange={(e) => setNewAdvisor({ ...newAdvisor, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    placeholder="+52 999 123 4567"
                    value={newAdvisor.phone}
                    onChange={(e) => setNewAdvisor({ ...newAdvisor, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={newAdvisor.password}
                    onChange={(e) => setNewAdvisor({ ...newAdvisor, password: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="warm" onClick={handleCreateAdvisor}>
                  Crear Advisor
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Advisors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advisors.map((advisor) => (
            <div
              key={advisor.id}
              className="p-6 rounded-2xl bg-card border border-border shadow-soft hover:shadow-elevated transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full gradient-warm flex items-center justify-center text-primary-foreground font-bold text-xl shadow-warm">
                    {advisor.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {advisor.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">Advisor</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDeleteAdvisor(advisor.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{advisor.email}</span>
                </div>
                {advisor.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{advisor.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Desde {format(advisor.createdAt, "MMMM yyyy", { locale: es })}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{advisor.videoCalls} llamadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber" />
                  <span className="text-sm font-medium text-foreground">{advisor.quotes} cotizaciones</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAdvisors;
