import type { NextApiRequest, NextApiResponse } from "next";
import { ChatGPTAPIBrowser } from "chatgpt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prompt = req.body.prompt;
  if (!prompt) return res.status(500);
  const api = new ChatGPTAPIBrowser({
    email: process.env.OPENAI_EMAIL as string,
    password: process.env.OPENAI_PASSWORD as string,
  });
  console.log("initiating chatGPT session...");
  await api.initSession();
  let apiRes = await api.sendMessage(prompt);
  console.log("finished chatGPT session...");

  return res.status(200).json(apiRes);
}
