import { connectToDatabase } from "@/helpers/server-helpers";
import { NextResponse } from "next/server";
import axios from "axios";
import prisma from '@/prisma';

// 微信接口地址
const WX_API_URL = 'https://api.weixin.qq.com/sns/jscode2session'
const appid = process.env.APPID
const secret = process.env.AppSecret
export const POST = async (req: Request) => {
  const { code } = await req.json();
  try {
    if (!code) return NextResponse.json({ message: "code字段不能同时为空" }, { status: 422 });
    const response = await axios.get(WX_API_URL, {
      params: {
        appid,
        secret,
        js_code: code,
        grant_type: 'authorization_code',
      }
    })
    const { openid, session_key } = response.data;
    await connectToDatabase();
    // 校验用户信息是否以存在
    const currentUser = await prisma.user.findUnique({
      where: { openid },
    });
    if (!currentUser) {
      // 如果用户不存在，存库
      await prisma.user.create({
        data: {
          user_id: openid,
          openid,
          nickName: '用户' + new Date().getTime(),
        },
      });
    }
    return NextResponse.json({ openid }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "服务器错误，请稍后重试！" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }

}
