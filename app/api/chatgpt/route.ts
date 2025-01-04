
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { message } = await req.json();
  
  if(!message) return NextResponse.json({ message: "Invalid Data" }, { status: 422 });

  const requestOptions = {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "User-Agent": "Apifox/1.0.0 (https://apifox.com)",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "model": "gpt-4o-mini",
      "messages": [
        {
          "role": "user",
          "content": message
        }
      ]
    }),
    redirect: 'follow'
  };

  try {
    const response = await fetch(process.env.OPENAI_URL, requestOptions as any)
    const result = await response.text();
    const answerRes = JSON.parse(result);
    if(answerRes.choices && answerRes.choices.length > 0) {
      return NextResponse.json(answerRes.choices[0].message?.content , { status: 200 });
    } else {
      return NextResponse.json("Sorry, I don't know the answer to that question.", { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ message: "服务器错误，请稍后重试！" }, { status: 500 });
  }

}