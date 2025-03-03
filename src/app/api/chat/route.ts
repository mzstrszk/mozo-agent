import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { firestore, auth } from "@/lib/firebase-admin";
import { Attachment } from "@/types/chat";
import { FirebaseUser } from "@/types/firebase";

export async function POST(request: Request) {
  try {
    const sessionCookie = cookies().get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify the session cookie
    await auth.verifySessionCookie(sessionCookie, true);

    const { message, attachments } = await request.json();

    // Verify the session cookie
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    
    // Get user settings from Firestore
    const userDoc = await firestore.collection("users").doc(decodedClaims.uid).get();
    
    if (!userDoc.exists) {
      return NextResponse.json({ settings: null });
    }

    const userData = userDoc.data() as FirebaseUser;

    // console.log("Azure Endpoint:", userData.azureOpenAI.endpoint);
    // console.log("Azure API Key:", userData.azureOpenAI.apiKey);
    // console.log("Azure API Version:", userData.azureOpenAI.apiVersion);
    // console.log("Azure Deployment Name:", userData.azureOpenAI.deploymentName);

    const azureEndpoint = userData.azureOpenAI.endpoint;
    const azureApiKey = userData.azureOpenAI.apiKey;
    const azureApiVersion = userData.azureOpenAI.apiVersion;
    const azureDeploymentName = userData.azureOpenAI.deploymentName;

    if (!azureEndpoint || !azureApiKey || !azureDeploymentName) {
      return NextResponse.json(
        { message: "Azure OpenAI settings not configured" },
        { status: 400 }
      );
    }

    // Process attachments if any
    let attachmentContents = "";
    if (attachments && attachments.length > 0) {
      attachmentContents = await processAttachments(attachments);
    }

    // Call Azure OpenAI API
    const response = await fetch(
      `${azureEndpoint}/openai/deployments/${azureDeploymentName}/chat/completions?api-version=${azureApiVersion}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": azureApiKey,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant.",
            },
            {
              role: "user",
              content: attachmentContents 
                ? `${message}\n\nAttached content:\n${attachmentContents}`
                : message,
            },
          ],
          max_tokens: 1000,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Azure OpenAI API error:", data);
      return NextResponse.json(
        { message: "Failed to get response from Azure OpenAI" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      response: data.choices[0].message.content,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { message: "Failed to process request" },
      { status: 500 }
    );
  }
}

// Function to process attachments
async function processAttachments(attachments: Attachment[]): Promise<string> {
  // In a real implementation, this would extract text from files
  // For now, we'll just return a placeholder
  return attachments.map(attachment => 
    `[Attachment: ${attachment.name} (${attachment.type})]`
  ).join("\n");
}