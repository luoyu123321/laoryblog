import { connectToDatabase } from "@/helpers/server-helpers";
import { NextResponse } from "next/server";
import prisma from '@/prisma';

/**
 * 
 * opttyp 操作类型   add 增加计数组  edit 计数
 * groupName 计数集合名称 
 * typeList 计数项列表 
 * title 标题 
 * type 计数项
 * accumulate 计数值 
 */
export const POST = async (req: Request) => {
  const { opttyp = 'edit', title, typeList, groupName, type, accumulate, } = await req.json();
  const typeListjson = JSON.stringify(typeList || '[]');
  try {
    if (opttyp === 'edit' && (!title || !groupName)) return NextResponse.json({ message: "标题或计数组名不能为空！" }, { status: 422 });
    if (opttyp === 'add' && (!typeList.length || !groupName)) return NextResponse.json({ message: "计数项组合或计数集合名不能为空！" }, { status: 422 });
    await connectToDatabase();

    if (opttyp === 'edit') {
      await prisma.counter.create({
        data: {
          groupName,
          title,
          type,
          accumulate,
        }
      });
    } else {
      /* 如果是新建计数组合集，需先判断计数组名是否已存在 */
      const groupInfo = await prisma.countergroup.findMany({ where: { groupName } });
      if (groupInfo.length > 0) return NextResponse.json({ message: "计数组名已存在" }, { status: 422 });

      await prisma.countergroup.create({
        data: {
          groupName,
          typeList: typeListjson,
        }
      });
    }
    return NextResponse.json({ message: "successful" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "服务器错误，请稍后重试！" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }

};