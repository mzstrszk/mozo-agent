import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const sessionCookie = cookies().get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify the session cookie
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    
    // Update the user's email
    await auth.updateUser(decodedClaims.uid, { email });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email update error:", error);
    return NextResponse.json(
      { message: "Failed to update email" },
      { status: 500 }
    );
  }
}