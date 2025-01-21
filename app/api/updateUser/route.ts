import { connectToDatabase } from "@/helpers/server-helpers";
import { NextResponse } from "next/server";
import prisma from '@/prisma';

export const POST = async (req: Request) => {
  const { user_id, avatarUrl, nickName } = await req.json();
  try {
    if (!user_id) return NextResponse.json({ message: "user_id字段不能同时为空" }, { status: 422 });
    await connectToDatabase();
    // 校验用户信息是否以存在
    const currentUser = await prisma.user.findUnique({
      where: { user_id },
    });
    // 用户不存在直接报错
    if (!currentUser) {
      return NextResponse.json({ message: "用户不存在，保存失败" }, { status: 404 });
    }

    // 动态构建更新对象
    const updateData = {
      ...(avatarUrl && { avatarUrl }), // 只有 avatarUrl 有值时才会添加到对象中
      ...(nickName && { nickName }),   // 只有 nickName 有值时才会添加到对象中
    };

    // 如果没有需要更新的字段，直接返回
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "没有需要更新的字段" }, { status: 200 });
    }

    await prisma.user.update({
      where: { user_id },
      data: updateData,
    });
    return NextResponse.json({ message: "更新成功！", data: updateData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "服务器错误，请稍后重试！" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }

}
