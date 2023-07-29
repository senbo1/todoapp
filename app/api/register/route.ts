import db from "@/lib/db";
import { RegisterSchema } from "@/lib/validators/authValidators";
import { NextResponse, NextRequest } from "next/server"
import bcrypt from "bcrypt";
import { z } from "zod";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { name, email, password } = RegisterSchema.parse(body);

    // check if email already registered
    const emailExists = await db.user.findUnique({
      where: { email }
    });

    if (emailExists) {
      return new NextResponse('Email already exists', { status: 409 })
    }
    
    // hash password and register user
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: {
        name,
        email,
        hashedPassword
      }
    });

    return new NextResponse('Successfully registered', { status: 201 }); 
  } catch(error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 })
    }

    return new Response('Could not register user', { status: 500 });
  }
} 