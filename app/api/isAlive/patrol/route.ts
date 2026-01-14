import { connectToDatabase } from "@/helpers/server-helpers";
import { NextResponse } from "next/server";
import prisma from '@/prisma';
import moment from "moment-timezone";

/**
 * 巡逻定时任务 - 超过三天没签到的用户发送提醒邮件
 * @param req 
 * @returns 
 */
export const POST = async (req: Request) => {
  try {
    await connectToDatabase();
    const date = moment().tz('Asia/Shanghai').format('YYYYMMDD');
    const [sendRecord, records] = await Promise.all([
      prisma.sendRecord.findUnique({ where: { date }, select: { number: true } }),
      prisma.isAlive.findMany({
        where: {
          status: 1,
          checkInCount: { gt: 1 },
          lastCheckIn: { lte: moment().tz('Asia/Shanghai').subtract(3, 'days').valueOf() },
        },
        select: {
          id: true,
          aliveName: true,
          aliveEmail: true,
        },
        orderBy: {
          lastCheckIn: 'asc', // 按时间升序排列
        },
        take: 10, // 每页的记录数量
      })
    ]);
    if (sendRecord && sendRecord.number >= 60) {
      return NextResponse.json({ message: "今天已经发送60封邮件了！" }, { status: 200 });
    }
    const ids = records.map(item => item.id);
    const fetchs = records.map((item) => {
      return fetch('https://messagebox.laory.cn/api/timedEmail/send/aliveSend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      })
    })

    await Promise.allSettled([
      /* 更新发送状态 */
      await prisma.isAlive.updateMany({
        where: { id: { in: ids } },
        data: { status: 0 },
      }),
      /** 更新今日发送数量 */
      await prisma.sendRecord.upsert({
        where: { date },
        update: { number: { increment: records.length || 0 } },
        create: { date, number: records.length },
      }),
      ...fetchs,
    ]);

    return NextResponse.json({ message: "执行成功" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "服务器错误，请稍后重试！" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }

}
