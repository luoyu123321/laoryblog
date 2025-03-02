import { connectToDatabase } from "@/helpers/server-helpers";
import { NextResponse } from "next/server";
import prisma from '@/prisma';

/**
 * 新增对局记录
 * @param req 
 * @returns 
 */
export const POST = async (req: Request) => {
  const { gameId, userId, playerType, isWinner, totalSteps } = await req.json();
  try {
    let ckeckKeys = { gameId, userId, playerType, isWinner };
    let checkmsg = Object.values(ckeckKeys).filter((item) => !item);
    if (checkmsg.length > 0) {
      let keyarr = Object.keys(ckeckKeys).map(item => {
        if (!ckeckKeys[item]) {
          return item;
        }
      });
      keyarr = keyarr.filter((item) => item);
      return NextResponse.json({ message: `${keyarr.join('、')}字段不能为空` }, { status: 422 });
    }
    await connectToDatabase();

    const newRecord = {
      gameId,
      userId,
      playerType,
      isWinner,
      ...(totalSteps && { totalSteps }),
    }
    await prisma.wuziqirecord.create({
      data: newRecord,
    });
    return NextResponse.json({ message: "保存对局成功！", data: newRecord }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "服务器错误，请稍后重试！" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }

}
