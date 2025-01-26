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
    /* 查询用户五子棋对局记录 */
    const records = await prisma.wuziqirecord.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc', // 按时间降序排列
      },
      skip: (page - 1) * pageSize, // 跳过前面的记录
      take: pageSize, // 每页的记录数量
    });
    /* 查询同局对手信息 */
    const rivalRecords = await prisma.wuziqirecord.findMany({
      where: {
        /* 查询同局对局信息 */
        gameId: {
          in: records.map(record => record.gameId)
        },
        /* 并且不返回自己的数据 */
        userId: {
          not: userId
        }
      },
      /* 仅返回gameId和对手的userInfo */
      select: {
        gameId: true,
        userInfo: {
          select: {
            nickName: true,
            avatarUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc', // 按时间降序排列
      },
    })
    /* 每局对局拼接上对手信息 */
    const res = records.map((item)=>{
      return {
        ...item,
        rivalInfo: rivalRecords.find(record => record.gameId === item.gameId)?.userInfo
      }
    })

    return NextResponse.json({ message: "查询成功！", data: res }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "服务器错误，请稍后重试！" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }

}
