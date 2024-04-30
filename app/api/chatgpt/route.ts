// import { OpenAIApi, Configuration } from 'openai';
import { NextResponse } from "next/server";
import OpenAI from 'openai';


// export default async (req, res) => {

//   const { requstion } = req.body;
//   if (!requstion) {
//     return res.status(400).json({ error: "Question is required" });
//   }
//   const configuration = new Configuration({
//     base_url: process.env.OPENAI_API_BASE_URL,
//     apiKey: process.env.OPENAI_API_KEY,
//   });
//   const openai = new OpenAIApi(configuration);
//   try {
//     const result = await openai.createCompletion({
//       model: "text-davinci-003",
//       prompt: requstion,
//       // temperature: 0.5,
//       max_tokens: 500,
//       // top_p: 1,
//       // frequency_penalty: 0.5,
//       // presence_penalty: 0,
//     });
//     return res.json({answer: result.data.choices[0].text });
//     // return NextResponse.json({ message: "get answer", answer: result.data.choices[0].text }, { status: 200 });
//   } catch (error) {
//     return res.status(500).json({ error: 'Error fetching answer' });
    
//   }

// }
