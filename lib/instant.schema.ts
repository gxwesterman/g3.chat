// instant.schema.ts
import { i } from '@instantdb/core';

const schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),
    chats: i.entity({
      sessionId: i.string(),
    }),
    messages: i.entity({
      chatId: i.string(),
      text: i.string(),
      type: i.string(),
    }),
  },
});

export default schema;