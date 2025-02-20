// import { openai } from '@ai-sdk/openai';
// import { streamText } from 'ai';
'use server'

import { redirect } from 'next/navigation';
import { randomUUID } from 'crypto'
import { GoogleGenerativeAI } from "@google/generative-ai";

// Allow streaming responses up to 30 seconds

export async function generateResponse(formData: FormData) {
  const message = formData.get('message');

  //redirect(`/chat/${randomUUID()}`);
  //return formData.get('message');
  // const { messages } = await req.json();

  // const genAI = new GoogleGenerativeAI("GEMINI_API_KEY");
  // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // const result = await model.generateContentStream(messages);

  // for await (const chunk of result.stream) {
  //   const chunkText = chunk.text();
  //   console.log(chunkText);
  //   process.stdout.write(chunkText);
  // }

//   const result = streamText({
//     model: openai('gpt-4o'),
//     messages,
//   });

//   return result.toDataStreamResponse();
}