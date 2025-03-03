"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsHeader } from "@/components/settings/settings-header";
import { AppearanceSettings } from "@/components/settings/appearance-settings";
import { AzureOpenAISettings } from "@/components/settings/azure-openai-settings";

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SettingsHeader />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="mx-auto max-w-[840px]">
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your app settings and preferences.
          </p>

          <Tabs defaultValue="appearance" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="azure-openai">Azure OpenAI</TabsTrigger>
            </TabsList>
            <TabsContent value="appearance" className="mt-6">
              <AppearanceSettings />
            </TabsContent>
            <TabsContent value="azure-openai" className="mt-6">
              <AzureOpenAISettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}