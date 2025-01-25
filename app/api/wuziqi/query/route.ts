import { connectToDatabase } from "@/helpers/server-helpers";
import { NextResponse } from "next/server";
import prisma from '@/prisma';

/**
 * 查询用户五子棋对局记录
 * @param req userId必填
 * @returns 
 */
export const POST = async (req: Request) => {
  const { userId, page = 1, pageSize = 10 } = await req.json();
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
        player1: { select: { nickName: true, avatarUrl: true } }, // 只查询玩家1的nickName
        player2: { select: { nickName: true, avatarUrl: true } }, // 只查询玩家2的nickName
      },
      orderBy: {
        startTime: 'desc', // 按时间降序排列
      },
      skip: (page - 1) * pageSize, // 跳过前面的记录
      take: pageSize, // 每页的记录数量
    });
    const filteredRecords = records.map(record => {
      return {
        ...record,
        rival: record.player1Id === userId ? record.player1 : record.player2,
        player1: undefined,
        player2: undefined,
      };
    });

    return NextResponse.json({ message: "查询成功！", data: filteredRecords }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "服务器错误，请稍后重试！" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }

}
