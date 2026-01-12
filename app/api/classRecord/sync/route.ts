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
    // 参数验证
    if (!userId || !month || !handleTime || !slots) {
      return NextResponse.json(
        { message: "参数不完整！" }, 
        { status: 400 }
      );
    }
    await connectToDatabase();
    console.log('connectToDatabase',userId, month, handleTime, slots);
    await prisma.classRecord.upsert({
      where: { userId_month: { userId, month } },
      create: { userId, month, handleTime, slots: JSON.stringify(slots) },
      update: { handleTime, slots: JSON.stringify(slots) },
    });
    console.log('upsert');

    return NextResponse.json({ message: "同步成功！" }, { status: 200 });
  } catch (error) {
    console.error('Error in /api/classRecord/sync:', error);
    return NextResponse.json({ message: "服务器错误，请稍后重试！" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }

}
