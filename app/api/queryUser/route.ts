import { connectToDatabase } from "@/helpers/server-helpers";
import { NextResponse } from "next/server";
import prisma from '@/prisma';

export const POST = async (req: Request) => {
  const { userId } = await req.json();
  try {
    if (!userId) return NextResponse.json({ message: "userId字段不能同时为空" }, { status: 422 });
    await connectToDatabase();
    const userInfo = await prisma.user.findMany({
      where: { userId },
    });
    // 用户不存在直接报错
    if (userInfo.length === 0) {
      return NextResponse.json({ message: "用户不存在!" }, { status: 404 });
    }
    const { nickName, avatarUrl } = userInfo[0];

    return NextResponse.json({ message: "查询成功！", data: { nickName, avatarUrl } }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "服务器错误，请稍后重试！" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }

}
