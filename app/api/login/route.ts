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
    const userInfo = await prisma.user.findMany({
      where: { openid },
    });
    let res: any = userInfo[0] || {};
    if (userInfo.length === 0) {
      // 如果用户不存在，存库，并随机生成初始化用户名
      res = {
        userId: openid,
        openid,
        nickName: '用户' + new Date().getTime(),
        avatarUrl: 'https://gitee.com/luoyu123321/cdn/raw/master/image/miniProgram/laoryTools/default_avatar.jpg',
      };
      await prisma.user.create({
        data: res
      });
    }
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "服务器错误，请稍后重试！" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }

}
