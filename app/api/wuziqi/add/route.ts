import { connectToDatabase } from "@/helpers/server-helpers";
import { NextResponse } from "next/server";
import prisma from '@/prisma';

/**
 * 新增对局记录
 * @param req 
 * @returns 
 */
export const POST = async (req: Request) => {
  const { gameId, player1Id, player2Id, winnerId, totalSteps } = await req.json();
  try {
    if (!gameId || (!player1Id && !player2Id)) {
      let checkmsg = !gameId ? 'gameId字段不能为空' : 'player1Id、player2Id字段不能同时为空';
      return NextResponse.json({ message: checkmsg }, { status: 422 });
    }
    await connectToDatabase();

    const newRecord = {
      gameId,
      ...(player1Id && { player1Id }),
      ...(player2Id && { player2Id }),
      ...(winnerId && { winnerId }),
      ...(totalSteps && { totalSteps }),
    }
    await prisma.wuziqirecord.upsert({
      where: {
        gameId
      },
      update: newRecord,
      create: newRecord,
    });
    return NextResponse.json({ message: "保存对局成功！", data: newRecord }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "服务器错误，请稍后重试！" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }

}
