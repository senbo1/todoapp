import { NextResponse } from "next/server"

export const GET = () => {
  NextResponse.json({ message: '418 I am teapot, I refuse to brew coffee.'}, { status: 418 });
} 