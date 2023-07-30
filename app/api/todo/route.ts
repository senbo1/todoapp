import { getAuthSession } from "@/lib/auth"
import db from "@/lib/db";
import { TodoSchema } from "@/lib/validators/todoValidators";
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod";

export const POST = async (req: NextRequest) => {
  try {
    const session = await getAuthSession();
  
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  
    const data = await req.json();
    const { title, description }= TodoSchema.parse(data);
  
    const todo = await db.todo.create({
      data: {
        title,
        description,
        userId: session.user.id
      }
    });
  
    return new NextResponse('Todo Created Successfully', { status: 201 }); 
  } catch (error) {
    if(error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 422 });
    }

    return new NextResponse('The Server could not create a todo, please try again', { status: 500 });
  }
}