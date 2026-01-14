import { connectToDatabase } from "@/helpers/server-helpers";
import { NextResponse } from "next/server";
import prisma from '@/prisma';
import moment from 'moment-timezone';

/**
 * 活着么-保存用户数据
 * @param req 
 * @returns 
 */
export const POST = async (req: Request) => {
  const { userId, aliveName, aliveEmail, lastCheckIn } = await req.json();
  try {
    // 参数验证
    if (!userId) {
      return NextResponse.json(
        { message: "参数不完整！" },
        { status: 400 }
      );
    }
    await connectToDatabase();

    // 构建更新数据对象
    const updateData: any = {};

    // 如果提供了用户名和邮箱，则更新它们
    if (aliveName) {
      updateData.aliveName = aliveName;
    }
    if (aliveEmail) {
      updateData.aliveEmail = aliveEmail;
    }

    let todaySignNbr = 0;
    // 如果提供了最后签到时间，则更新签到相关信息
    if (lastCheckIn) {
      updateData.lastCheckIn = lastCheckIn;
      updateData.status = 1; // 更新状态为1

      // 增加签到次数，如果不存在则设为1
      updateData.checkInCount = {
        increment: 1
      };

      // 获取今天的开始时间和结束时间
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      // 查询当天签到的记录数量
      todaySignNbr = await prisma.isAlive.count({
        where: {
          lastCheckIn: {
            gte: startOfDay.getTime(), // 大于等于今天开始时间
            lte: endOfDay.getTime()    // 小于等于今天结束时间
          }
        }
      });

    }

    // 使用upsert更新或创建记录
    await prisma.isAlive.upsert({
      where: {
        userId
      },
      update: updateData,
      create: {
        userId,
        aliveName: aliveName || '',
        aliveEmail: aliveEmail || '',
        ...(lastCheckIn && {
          lastCheckIn,
          status: 1, // 如果提供了lastCheckIn，默认状态为1
          checkInCount: 1 // 如果提供了lastCheckIn，默认签到次数为1
        })
      }
    });

    const hours = moment().tz('Asia/Shanghai').hours();

    return NextResponse.json({ message: "保存成功！", data: { todaySignNbr: hours * 50 + todaySignNbr + 1 } }, { status: 200 });
  } catch (error) {
    console.error("保存用户数据时发生错误:", error);
    return NextResponse.json({ message: "服务器错误:" + error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}