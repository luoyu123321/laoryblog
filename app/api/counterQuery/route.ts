import { connectToDatabase } from "@/helpers/server-helpers";
import { NextResponse } from "next/server";
import prisma from '@/prisma';

/**
 * 
 * opttyp  查询条件
 * title  按title查询
 * groupName  俺计数集查询
 * type  按计数类型查询
 */
export const POST = async (req: Request) => {
  const { opttyp = 'edit', title, groupName, type,  } = await req.json();
  try {
    if (!opttyp) return NextResponse.json({ message: "Invalid Data" }, { status: 422 });
    await connectToDatabase();
    let counter: any;
    if (opttyp === 'groupName') {
      counter = await prisma.countergroup.findMany({
        where: { groupName },
        include: { counters: true },
        orderBy: { createdAt: 'desc' }// 按时间倒序排序
      });
    return NextResponse.json({ counter: counter.map(item => { return { ...item, typeList: JSON.parse(item.typeList || '[]') } }) }, { status: 200 });
    } else if (opttyp === 'title') {
      counter = await prisma.counter.findMany({
        where: { title, groupName },
        orderBy: { createdAt: 'desc' }// 按时间倒序排序
      });
    } else {
      counter = await prisma.counter.findMany({
        where: { type, groupName },
        orderBy: { createdAt: 'desc' } // 按时间倒序排序
      });
    }

    return NextResponse.json({ counter }, { status: 200 });
  } catch (error) {

    console.error(error);

    throw NextResponse.json({ message: "Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }

};
