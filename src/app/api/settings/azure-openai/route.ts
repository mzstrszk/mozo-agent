import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth, firestore } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const sessionCookie = cookies().get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify the session cookie
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    
    // Get user settings from Firestore
    const userDoc = await firestore.collection("users").doc(decodedClaims.uid).get();
    
    if (!userDoc.exists) {
      return NextResponse.json({ settings: null });
    }

    const userData = userDoc.data();
    
    return NextResponse.json({
      settings: userData?.azureOpenAI || null,
    });
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json(
      { message: "Failed to get settings" },
      { status: 500 }
    );
  }
}

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
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    
    const settings = await request.json();
    
    // Save settings to Firestore
    await firestore.collection("users").doc(decodedClaims.uid).set({
      azureOpenAI: settings,
      updatedAt: new Date(),
    }, { merge: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save settings error:", error);
    return NextResponse.json(
      { message: "Failed to save settings" },
      { status: 500 }
    );
  }
}