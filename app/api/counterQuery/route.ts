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
  const { opttyp, title: title1, groupName: groupName1, type: type1, } = await req.json();
  /* 去除空格 */
  const title = title1?.trim();
  const groupName = groupName1?.trim();
  const type = type1?.trim();
  try {
    if (!opttyp) return NextResponse.json({ message: "查询类型不能为空，请稍后重试！" }, { status: 422 });
    await connectToDatabase();
    let counter: any;
    if (opttyp === 'groupName') {
      counter = await prisma.countergroup.findMany({
        where: { groupName },
        include: { counters: { orderBy: { createdAt: 'desc' } } },
        orderBy: { createdAt: 'desc' }// 按时间倒序排序
      });
      return NextResponse.json({ counter: counter.map(item => { return { ...item, typeList: JSON.parse(item.typeList || '[]') } }) }, { status: 200 });
    } else {
      counter = await prisma.counter.findMany({
        where: { groupName, ...(title ? { title } : null), ...(type ? { type } : null) },
        orderBy: { createdAt: 'desc' }// 按时间倒序排序
      });
    }

    return NextResponse.json({ counter }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "服务器错误，请稍后重试！" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }

};
