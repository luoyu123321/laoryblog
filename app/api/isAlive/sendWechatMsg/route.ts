import { connectToDatabase } from "@/helpers/server-helpers";
import { NextResponse } from "next/server";
import prisma from '@/prisma';
import axios from 'axios'; // 假设使用axios发送HTTP请求

/**
 * 发送微信通知
 * @param req 
 * @returns 
 */
export const POST = async (req: Request) => {
  const { userId, name, email } = await req.json();
  
  try {
    await connectToDatabase();

    // 获取用户信息
    const userRecord = await prisma.isAlive.findUnique({
      where: { userId },
    });

    if (!userRecord) {
      return NextResponse.json({ message: "用户不存在" }, { status: 404 });
    }

    // 构建微信消息内容
    const wechatMessage = {
      touser: userId, // 假设数据库中有存储用户的openid
      template_id: process.env.WECHAT_TEMPLATE_ID, // 微信模板消息ID
      data: {
        thing1: {
          value: "赛博平安提醒",
          color: "#173177"
        },
        time3: {
          value: "2026-01-14 20:00:00",
          color: "#173177"
        },
        time19: {
          value: `2026-01-14 21:00:00`,
          color: "#173177"
        },
        thing7: {
          value: "请及时签到以确保安全状态更新",
          color: "#173177"
        }
      }
    };

    // 发送微信通知
    const accessToken = await getAccessToken(); // 获取access token的函数
    const response = await axios.post(
      `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${accessToken}`,
      wechatMessage,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.errcode !== 0) {
      throw new Error(`发送微信通知失败: ${response.data.errmsg}`);
    }

    return NextResponse.json({ message: "发送成功！" }, { status: 200 });
  } catch (error) {
    console.error("发送微信通知时发生错误:", error);
    return NextResponse.json({ message: "服务器错误:" + error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

// 获取微信access token的辅助函数
async function getAccessToken(): Promise<string> {
  const appId = process.env.APPID;
  const appSecret = process.env.AppSecret;
  
  if (!appId || !appSecret) {
    throw new Error('缺少微信应用配置');
  }
  
  const response = await axios.get(
    `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`
  );
  
  if (response.data.access_token) {
    return response.data.access_token;
  } else {
    throw new Error('获取access token失败');
  }
}