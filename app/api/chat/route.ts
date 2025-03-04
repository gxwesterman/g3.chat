import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  const { message, messages } = await req.json();

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const chat = model.startChat({
    history: messages.map((message: { type: string, text: string }) => {
      return {
        role: message.type === 'question' ? 'user' : 'model',
        parts: [{ text: message.text }]
      }
    })
  })
    
  const result = await chat.sendMessageStream(message);
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        const chunkText = await chunk.text();
        controller.enqueue(chunkText);
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked',
    },
  });
}

// import { streamText } from 'ai';
// import { google } from "@ai-sdk/google";

// // Allow streaming responses up to 30 seconds
// export const maxDuration = 30;

// export async function POST(req: Request) {
//   const { messages } = await req.json();
//   const coreMessages = messages.map((message: {type: string, text: string}) => {
//     return {
//       role: message.type === 'question' ? 'user' : 'system',
//       content: message.text
//     }
//   })

//   const result = streamText({
//     model: google('gemini-2.0-flash'),
//     messages: coreMessages,
//   });

//   return result.toDataStreamResponse({});
// }