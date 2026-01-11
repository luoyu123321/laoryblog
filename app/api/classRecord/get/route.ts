import { connectToDatabase } from "@/helpers/server-helpers";
import { NextResponse } from "next/server";
import prisma from '@/prisma';

/**
 * 查询弹幕信息
 * @param req 
 * @returns 
 */
export const POST = async (req: Request) => {
  const { userId, month, handleTime } = await req.json();
  try {
    await connectToDatabase();

    const targetData: any = await prisma.classRecord.findFirst({
      where: { userId, month },
    }) || {};
    const isLatest = parseInt(targetData.handleTime || '0') <= parseInt(handleTime || '0');

    const data = {
      isLatest: isLatest ? 'Y' : 'N',
      slots: isLatest ? [] : targetData.slots || [],
    }

    return NextResponse.json({ message: "查询成功！", data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "服务器错误，请稍后重试！" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }

}
