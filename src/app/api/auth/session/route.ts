import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const sessionCookie = cookies().get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Verify the session cookie
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const user = await auth.getUser(decodedClaims.uid);

    return NextResponse.json({
      user: {
        id: user.uid,
        email: user.email,
        createdAt: user.metadata.creationTime,
      },
    });
  } catch (error) {
    console.error("Error verifying session:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}