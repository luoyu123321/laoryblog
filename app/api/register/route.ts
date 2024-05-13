import { connectToDatabase } from "@/helpers/server-helpers";
import { NextResponse } from "next/server";
import prisma from '@/prisma';

export const POST = async (req: Request) => {
  const { email, name } = await req.json();
  try {
    if (!email || !name) return NextResponse.json({ message: "Invalid Data" }, { status: 422 });
    await connectToDatabase();
    const newuser = await prisma.user.create({
      data: {
        email,
        name
      }
    });
    return NextResponse.json({ message: "User Created" }, { status: 201 });
  } catch (error) {

    console.error(error);

    throw NextResponse.json({ message: "Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }

}



export const GET = async () => {
  try {
    await connectToDatabase();
    const user = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc' // 按时间倒序排序
      }
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {

    throw NextResponse.json({ message: "Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};