import { connectToDatabase } from "@/helpers/server-helpers";
import { NextResponse } from "next/server";
import prisma from '@/prisma';

export const POST = async (req: Request) => {
  const { email, name, message, ip } = await req.json();
  const ipjson = JSON.stringify(ip || '{}');
  try {
    if (!name || !message) return NextResponse.json({ message: "Invalid Data" }, { status: 422 });
    await connectToDatabase();
    const newMessage = await prisma.guestbook.create({
      data: {
        email,
        name,
        message,
        ip: ipjson
      }
    });
    return NextResponse.json({ message: "User Created", guestbook: newMessage }, { status: 200 });
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
    const guestbook = await prisma.guestbook.findMany({
      orderBy: {
        createdAt: 'desc' // 按时间倒序排序
      }
    });
    return NextResponse.json({ guestbook: guestbook.map(item => { return { ...item, ip: JSON.parse(item.ip || '{}') } }) }, { status: 200 });
  } catch (error) {

    throw NextResponse.json({ message: "Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};