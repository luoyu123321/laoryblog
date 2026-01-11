import { connectToDatabase } from "@/helpers/server-helpers";
import { NextResponse } from "next/server";
import prisma from '@/prisma';

/**
 * 同步计课时数据
 * @param req 
 * @returns 
 */
export const POST = async (req: Request) => {
  const { userId, month, handleTime, slots } = await req.json();
  try {
    await connectToDatabase();

    await prisma.classRecord.upsert({
      where: { userId_month: { userId, month } },
      create: { userId, month, handleTime, slots },
      update: { handleTime, slots },
    });

    return NextResponse.json({ message: "同步成功！" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "服务器错误，请稍后重试！" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }

}
