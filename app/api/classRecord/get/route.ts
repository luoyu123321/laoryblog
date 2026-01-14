import { connectToDatabase } from "@/helpers/server-helpers";
import { NextResponse } from "next/server";
import prisma from '@/prisma';

/**
 * 查询前后一年的计课时信息
 * @param req 
 * @returns 
 */
export const POST = async (req: Request) => {
  const { userId, month, handleTime } = await req.json();
  try {
    await connectToDatabase();

    // 解析 month 为年和月
    const [year, mon] = month.split('-').map(Number);
    const startYear = year - 1;
    const endYear = year + 1;
    const startMonth = `${startYear}-${mon.toString().padStart(2, '0')}`;
    const endMonth = `${endYear}-${mon.toString().padStart(2, '0')}`;

    const targetData: any[] = await prisma.classRecord.findMany({
      where: {
        userId,
        month: {
          gte: startMonth,
          lte: endMonth,
        },
      },
    });


    // 筛选出 handleTime 中月份时间戳大于传入 handleTime 的记录，或传入时间戳不存在的记录
    const filteredData = targetData.filter(record => {
      const recordMonth = record.month;
      const inputTimestamp = handleTime[recordMonth];
      // 如果传入的时间戳不存在，认为需要更新；如果存在，则比较时间戳
      if (!inputTimestamp) {
        return true;
      }
      return record.handleTime && record.handleTime > inputTimestamp;
    });

    // 按月份分组 slots
    const monthSlots: { [key: string]: any } = {};
    filteredData.forEach(record => {
      const recordMonth = record.month;
      monthSlots[recordMonth]= record.slots ? JSON.parse(record.slots || '{}') : {};
    });

    return NextResponse.json({ message: "查询成功！", data: JSON.stringify(monthSlots) }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "服务器错误，请稍后重试！" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }

}
