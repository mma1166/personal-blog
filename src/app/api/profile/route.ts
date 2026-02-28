import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = 'force-dynamic';

// GET /api/profile - Fetch admin profile (first user)
export async function GET() {
    try {
        const user = await prisma.user.findFirst();
        if (!user) return NextResponse.json({ error: "No user found" }, { status: 404 });

        // Return without password
        const { password, ...safeUser } = user;
        return NextResponse.json(safeUser);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// PUT /api/profile - Update profile or password
export async function PUT(request: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const { current_password, new_password, ...profileUpdates } = body;

        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const updates: any = {};

        // Profile update
        if (profileUpdates.name !== undefined) updates.name = profileUpdates.name;
        if (profileUpdates.bio !== undefined) updates.bio = profileUpdates.bio;
        if (profileUpdates.profile_url !== undefined) updates.profile_url = profileUpdates.profile_url;
        if (profileUpdates.email !== undefined) updates.email = profileUpdates.email;

        // Password change logic
        if (current_password && new_password) {
            const currentHash = crypto.createHash('sha256').update(current_password).digest('hex');
            if (user.password !== currentHash) {
                return NextResponse.json({ error: "Current password incorrect" }, { status: 400 });
            }
            updates.password = crypto.createHash('sha256').update(new_password).digest('hex');
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: updates
        });

        const { password, ...safeUser } = updatedUser;
        return NextResponse.json({ success: true, user: safeUser });
    } catch (err: any) {
        console.error("PROFILE UPDATE ERROR:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
