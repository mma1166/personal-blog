import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { login } from "@/lib/auth";
import crypto from "crypto";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // Standard SHA-256 hashing (same as previous client-side for compatibility)
        const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

        // Check if ANY users exist. If not, create a default one (Emergency Setup)
        const userCount = await prisma.user.count();
        if (userCount === 0) {
            console.log("No users found. Creating initial admin...");
            const defaultUser = await prisma.user.create({
                data: {
                    email: "muntasir145@gmail.com",
                    password: passwordHash, // Setting provided password as default
                    name: "Muntasir Mahmud Amit",
                    bio: "CS graduate from BRAC University & SQA Engineer at Tekarsh. I'm passionate about software quality, test automation, and the cutting edge of Data Science and Machine Learning. When I'm not debugging code, I'm out exploring the world — I love adventure, discovering new places, and experiencing cultures that broaden my perspective. This blog is where tech meets travel.",
                }
            });
            await login({ id: defaultUser.id, email: defaultUser.email });
            return NextResponse.json({ success: true, message: "Initial Admin created and logged in!" });
        }

        // Standard Login
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user || user.password !== passwordHash) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        await login({ id: user.id, email: user.email });
        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("LOGIN ERROR:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
