import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 1. Delete all existing users (Wipe)
        await prisma.user.deleteMany({});

        console.log("ADMIN RESET: All users deleted. The next login attempt will create a fresh admin account.");

        return new NextResponse(
            `<html>
                <body style="font-family: sans-serif; background: #0a0a0a; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; text-align: center;">
                    <div style="background: #111; padding: 2rem; border-radius: 20px; border: 1px solid #222;">
                        <h1 style="color: #7c3aed;">Admin Reset Successful! ✅</h1>
                        <p style="color: #888;">All existing admin users have been cleared from the database.</p>
                        <p><strong>Next Step:</strong> Go back to the <a href="/admin/login" style="color: #7c3aed; text-decoration: none; font-weight: bold;">Login Page</a> and sign in with your email and any password. It will automatically save that as the new admin account.</p>
                    </div>
                </body>
            </html>`,
            { headers: { 'Content-Type': 'text/html' } }
        );
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
