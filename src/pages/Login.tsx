import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserRole } from '@/types';
import { Plane, Users, Shield, Eye, EyeOff, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('advisor');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password, role);
      if (success) {
        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión correctamente.",
        });
        navigate(role === 'admin' ? '/admin' : '/advisor');
      } else {
        toast({
          title: "Error de autenticación",
          description: "Credenciales incorrectas. Intenta de nuevo.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al iniciar sesión.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 gradient-warm relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-primary-foreground">
          <div className="animate-float mb-8">
            <div className="w-24 h-24 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
              <Plane className="w-12 h-12" />
            </div>
          </div>
          
          <h1 className="font-display text-5xl font-bold mb-4 text-center">
            3 en Ruta
          </h1>
          <p className="text-xl opacity-90 text-center max-w-md mb-8">
            Tu agencia de viajes de confianza. Creando experiencias inolvidables.
          </p>
          
          <div className="flex items-center gap-4 opacity-80">
            <MapPin className="w-5 h-5" />
            <span>Mérida, Yucatán • México</span>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="w-2 h-2 rounded-full bg-primary-foreground/50"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 rounded-full gradient-warm mx-auto flex items-center justify-center mb-4 shadow-warm">
              <Plane className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">3 en Ruta</h1>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">
              Iniciar Sesión
            </h2>
            <p className="text-muted-foreground">
              Ingresa tus credenciales para acceder al panel
            </p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRole('advisor')}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                role === 'advisor'
                  ? 'border-primary bg-primary/5 shadow-warm'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Users className={`w-8 h-8 mx-auto mb-2 ${role === 'advisor' ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`block font-semibold ${role === 'advisor' ? 'text-primary' : 'text-foreground'}`}>
                Advisor
              </span>
              <span className="text-xs text-muted-foreground">Asesor de viajes</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                role === 'admin'
                  ? 'border-primary bg-primary/5 shadow-warm'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Shield className={`w-8 h-8 mx-auto mb-2 ${role === 'admin' ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`block font-semibold ${role === 'admin' ? 'text-primary' : 'text-foreground'}`}>
                Admin
              </span>
              <span className="text-xs text-muted-foreground">Administrador</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Correo Electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              variant="warm" 
              size="lg" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Iniciando...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="p-4 rounded-xl bg-secondary/50 border border-border">
            <p className="text-sm font-medium text-foreground mb-2">Credenciales de demostración:</p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Admin:</strong> admin@3enruta.com / demo123</p>
              <p><strong>Advisor:</strong> advisor@3enruta.com / demo123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
