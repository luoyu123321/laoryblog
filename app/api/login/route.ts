import { connectToDatabase } from "@/helpers/server-helpers";
import { NextResponse } from "next/server";
import axios from "axios";
import prisma from '@/prisma';

// 微信接口地址
const WX_API_URL = 'https://api.weixin.qq.com/sns/jscode2session'
const appid = process.env.APPID
const secret = process.env.AppSecret
export const POST = async (req: Request) => {
  const { code  } = await req.json();
  try {
    if (!code) return NextResponse.json({ message: "code字段不能为空" }, { status: 422 });
    const response = await axios.get(WX_API_URL, {
      params: {
        appid,
        secret,
        js_code: code,
        grant_type: 'authorization_code',
      },
      // method: 'POST',
      // body: JSON.stringify({
      //   appid: process.env.APPID,
      //   secret: process.env.AppSecret,
      //   js_code: code,
      //   grant_type: 'authorization_code'
      // }),
    })
    console.log(222,response.data);
    return NextResponse.json(response.data , { status: 200 });
    await connectToDatabase();
    const newuser = await prisma.user.create({
      data: {
        email,
        name
      }
    });
    return NextResponse.json({ message: "User Created" }, { status: 201 });
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