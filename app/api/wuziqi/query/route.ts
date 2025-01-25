import { connectToDatabase } from "@/helpers/server-helpers";
import { NextResponse } from "next/server";
import prisma from '@/prisma';

/**
 * 查询用户五子棋对局记录
 * @param req userId必填
 * @returns 
 */
export const POST = async (req: Request) => {
  const { userId } = await req.json();
  try {
    if (!userId) return NextResponse.json({ message: "userId字段不能同时为空" }, { status: 422 });
    await connectToDatabase();
    const records = await prisma.wuziqiRecord.findMany({
      where: {
        OR: [
          { player1Id: userId },
          { player2Id: userId },
        ],
      },
      include: {
        player1: { select: { nickName: true } }, // 只查询玩家1的nickName
        player2: { select: { nickName: true } }, // 只查询玩家2的nickName
      }
    });

    return NextResponse.json({ message: "查询成功！", data: records }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "服务器错误，请稍后重试！" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }

}
