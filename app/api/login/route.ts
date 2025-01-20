import { connectToDatabase } from "@/helpers/server-helpers";
import { NextResponse } from "next/server";
import axios from "axios";
import prisma from '@/prisma';

// 微信接口地址
const WX_API_URL = 'https://api.weixin.qq.com/sns/jscode2session'
const appid = process.env.APPID
const secret = process.env.AppSecret
export const POST = async (req: Request) => {
  const { code, avatarUrl, nickName } = await req.json();
  try {
    if (!code) return NextResponse.json({ message: "code字段不能为空" }, { status: 422 });
    const response = await axios.get(WX_API_URL, {
      params: {
        appid,
        secret,
        js_code: code,
        grant_type: 'authorization_code',
      }
    })
    console.log(222, response.data);
    const { openid, session_key } = response.data;
    await connectToDatabase();
    // 如果记录存在则更新，如果不存在则创建
    await prisma.user.upsert({
      where: { user_id: openid },
      update: {
        nickName,
        avatarUrl,
      },
      create: {
        user_id: openid,
        openid,
        nickName,
        avatarUrl,
      },
    });
    return NextResponse.json({ openid }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "服务器错误，请稍后重试！" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }

}



export const GET = async () => {
  try {
    await connectToDatabase();
    const user = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc' // 按时间倒序排序
      }
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "服务器错误，请稍后重试！" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};