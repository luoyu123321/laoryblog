import { connectToDatabase } from "@/helpers/server-helpers";
import { NextResponse } from "next/server";
import prisma from '@/prisma';

/**
 * 新增对局记录
 * @param req 
 * @returns 
 */
export const POST = async (req: Request) => {
  const { player1Id, player2Id, winnerId, totalSteps } = await req.json();
  try {
    let checkmsg = [player1Id, player2Id, winnerId].filter((item) => !item);
    if (checkmsg.length > 0) return NextResponse.json({ message: `${checkmsg.join('、')}字段不能同时为空` }, { status: 422 });
    await connectToDatabase();

    const newRecord = {
      player1Id,
      player2Id,
      winnerId,
      totalSteps
    }
    await prisma.wuziqiRecord.create({
      data: newRecord
    });
    return NextResponse.json({ message: "保存对局成功！", data: newRecord }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "服务器错误，请稍后重试！" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }

}
