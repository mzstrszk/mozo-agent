"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  endpoint: z.string().url({ message: "Please enter a valid URL" }),
  apiKey: z.string().min(1, { message: "API key is required" }),
  apiVersion: z.string().min(1, { message: "API version is required" }),
  deploymentName: z.string().min(1, { message: "Deployment name is required" }),
});

export function AzureOpenAISettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      endpoint: "",
      apiKey: "",
      apiVersion: "2023-05-15",
      deploymentName: "",
    },
  });

  useEffect(() => {
    // Load saved settings
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/settings/azure-openai");
        const data = await response.json();
        
        if (data.settings) {
          form.reset({
            endpoint: data.settings.endpoint || "",
            apiKey: data.settings.apiKey || "",
            apiVersion: data.settings.apiVersion || "2023-05-15",
            deploymentName: data.settings.deploymentName || "",
          });
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };

    loadSettings();
  }, [form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/settings/azure-openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      toast({
        title: "Settings saved",
        description: "Your Azure OpenAI settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Azure OpenAI Settings</CardTitle>
        <CardDescription>
          Configure your Azure OpenAI API settings. These settings are required to use the chat functionality.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="endpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Endpoint</FormLabel>
                  <FormControl>
                    <Input placeholder="https://your-resource-name.openai.azure.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    The endpoint URL for your Azure OpenAI resource.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Your API key" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your Azure OpenAI API key.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apiVersion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Version</FormLabel>
                  <FormControl>
                    <Input placeholder="2023-05-15" {...field} />
                  </FormControl>
                  <FormDescription>
                    The API version to use (e.g., 2023-05-15).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deploymentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deployment Name</FormLabel>
                  <FormControl>
                    <Input placeholder="gpt-35-turbo" {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of your Azure OpenAI deployment.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Settings"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}