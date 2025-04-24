import 'server-only'
import { admin_db as db } from '@/lib/instant';
import { id } from '@instantdb/admin';

const welcome = `
## G3 Chat is the second best AI Chat ever made.

### 1. We're fast.

I don't know how much faster we are than ChatGPT or DeepSeek - I haven't done the math. But you'll feel the difference - trust me.

### 2. We have Gemini 2.0 Flash.

Want to use **Gemini 2.0** for code? We got you. **Gemini 2.0** for math? Of course. **Gemini 2.0** for picture analysis? Actually you can't do that.

When new models come out, we still only provide Gemini 2.0 (at least for now).

### 3. We're free.

We're free. It's a personal project that uses a free API. Why would we charge?

### Whatcha waiting for?

Reply here to get started. Or you can [check out the FAQ](https://t3.chat/chat/faq)`;

export async function initDefaultPages(sessionId: string) {
  //console.log(db);
  await db.transact([
    db.tx.chats[id()].update({
      urlId: 'welcome',
      sessionId: sessionId,
      title: 'Welcome to G3 Chat'
    })],
  );

  //const res = await db.transact([db.tx.chats[id()].update({ title: 'chicken', sessionId: sessionId })])


  // db.transact(
  //   db.tx.messages[id()].update({
  //     chatId: 'welcome',
  //     text: 'What is G3 Chat',
  //     type: 'question',
  //   }).link({ chats: 'welcome' }),
  // );

  // db.transact(
  //   db.tx.messages[id()].update({
  //     chatId: 'welcome',
  //     text: welcome,
  //     type: 'answer',
  //   }).link({ chats: 'welcome' }),
  // );
}