import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Settings, User, Bell, Shield, Database } from 'lucide-react';

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="p-5">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-anton text-gray-800 uppercase tracking-wider">Configuración</h1>
            <p className="mt-1 text-sm text-gray-500">Administra la configuración de la plataforma</p>
          </div>
          
          {/* Settings Tabs */}
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList className="grid grid-cols-4 gap-4 w-full max-w-md">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Perfil</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notificaciones</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Seguridad</span>
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Sistema</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Profile Settings */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-anton tracking-wider">Perfil</CardTitle>
                  <CardDescription>
                    Administra tu información de perfil y preferencias.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre</Label>
                      <Input id="name" placeholder="Tu nombre" defaultValue="Ana Rodríguez" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" placeholder="tu@email.com" defaultValue="ana.rodriguez@econova.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Rol</Label>
                    <Input id="role" defaultValue="Administrador" disabled />
                  </div>
                  <div className="flex justify-end">
                    <Button className="bg-navy hover:bg-navy-light">Guardar Cambios</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Notifications Settings */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-anton tracking-wider">Notificaciones</CardTitle>
                  <CardDescription>
                    Configura tus preferencias de notificaciones.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Alertas por email</p>
                      <p className="text-sm text-gray-500">Recibir alertas de discrepancias por email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificaciones de nuevos documentos</p>
                      <p className="text-sm text-gray-500">Recibir notificaciones cuando se sube un nuevo documento</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Reportes semanales</p>
                      <p className="text-sm text-gray-500">Recibir un resumen semanal por email</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex justify-end">
                    <Button className="bg-navy hover:bg-navy-light">Guardar Cambios</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Security Settings */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-anton tracking-wider">Seguridad</CardTitle>
                  <CardDescription>
                    Administra tu contraseña y seguridad de la cuenta.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Contraseña Actual</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nueva Contraseña</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button className="bg-navy hover:bg-navy-light">Actualizar Contraseña</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* System Settings */}
            <TabsContent value="system">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-anton tracking-wider">Configuración del Sistema</CardTitle>
                  <CardDescription>
                    Configura los parámetros del sistema.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Procesamiento automático de PDFs</p>
                      <p className="text-sm text-gray-500">Procesa automáticamente los PDFs al subirlos</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Detección de discrepancias</p>
                      <p className="text-sm text-gray-500">Detecta automáticamente discrepancias en los datos</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="threshold">Umbral de alerta (%)</Label>
                    <Input id="threshold" type="number" defaultValue="5" min="1" max="100" />
                    <p className="text-xs text-gray-500">Porcentaje de desviación para generar alertas</p>
                  </div>
                  <div className="flex justify-end">
                    <Button className="bg-navy hover:bg-navy-light">Guardar Cambios</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}
