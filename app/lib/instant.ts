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

Reply here to get started. Or start a new chat!`;

const faq = `
### Who made G3 Chat?

Me. Griffin. Follow me on [twitter](https://x.com/gxweste). 

I also made [Cheli](https://cheli.vercel.app).

### How did you make G3 Chat so fast???

Literally just instandb and router.push.

### Any pro tips?

- Nope!

### What's next for G3 Chat?

Great question. I have a long list of wishes that I'm hoping to get added soon, like...
- Hotkeys
- Support for various LLMs
- Better markdown parsing
- Real auth
- Real-time response syncing
- Idk maybe abandon the T3 bit and make it it's own app
`;

export async function initDefaultPages(sessionId: string) {

  const welcomeChatId = id();
  const faqChatId = id();

  await db.transact([
    db.tx.chats[welcomeChatId].update({
      urlId: 'welcome',
      sessionId: sessionId,
      title: 'Welcome to G3 Chat'
    })],
  );

  await db.transact([
    db.tx.chats[faqChatId].update({
      urlId: 'faq',
      sessionId: sessionId,
      title: 'FAQ'
    })],
  );

  await db.transact(
    db.tx.messages[id()].update({
      chatId: welcomeChatId,
      text: 'What is G3 Chat?',
      type: 'question',
    }).link({ chats: welcomeChatId }),
  );

  await db.transact(
    db.tx.messages[id()].update({
      chatId: welcomeChatId,
      text: welcome,
      type: 'answer',
    }).link({ chats: welcomeChatId }),
  );

  await db.transact(
    db.tx.messages[id()].update({
      chatId: faqChatId,
      text: faq,
      type: 'answer',
    }).link({ chats: faqChatId }),
  );
}