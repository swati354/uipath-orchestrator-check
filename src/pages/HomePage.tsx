import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity } from 'lucide-react';
import { ProcessesAssetsTab } from '@/components/ProcessesAssetsTab';
import { ActionCenterTab } from '@/components/ActionCenterTab';
import { UiPathAuthProvider } from '@/contexts/UiPathAuthContext';
import { AuthWrapper } from '@/components/AuthWrapper';
import { Toaster } from 'sonner';
export function HomePage() {
  return (
    <UiPathAuthProvider>
      <AuthWrapper>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            {/* Header */}
            <header className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FA4616] to-[#E55A1B] flex items-center justify-center shadow-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">UiPath Orchestrator Console</h1>
                  <p className="text-muted-foreground">
                    Centralized monitoring and control of automation resources
                  </p>
                </div>
              </div>
            </header>
            {/* Main Tabbed Interface */}
            <Tabs defaultValue="processes-assets" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                <TabsTrigger value="processes-assets" className="text-sm font-medium">
                  Processes & Assets
                </TabsTrigger>
                <TabsTrigger value="action-center" className="text-sm font-medium">
                  Action Center Tasks
                </TabsTrigger>
              </TabsList>
              <TabsContent value="processes-assets" className="space-y-6">
                <ProcessesAssetsTab />
              </TabsContent>
              <TabsContent value="action-center" className="space-y-6">
                <ActionCenterTab />
              </TabsContent>
            </Tabs>
            {/* Footer */}
            <footer className="mt-16 pt-8 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                © Powered by UiPath
              </p>
            </footer>
          </div>
        </div>
        <Toaster richColors closeButton />
      </AuthWrapper>
    </UiPathAuthProvider>
  );
}