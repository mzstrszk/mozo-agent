export interface FirebaseUser {
  azureOpenAI: AzureOpenAIConfig;
  updatedAt: Date;
}

export interface AzureOpenAIConfig {
  apiKey: string;
  apiVersion: string;
  deploymentName: string;
  endpoint: string;
}
