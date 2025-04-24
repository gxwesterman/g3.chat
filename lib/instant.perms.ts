// instant.perms.ts
import type { InstantRules } from '@instantdb/react';

const rules = {
  chats: {
    allow: {
      view: 'auth.id != null',
      create: 'isOwner',
      update: 'isOwner',
      delete: 'isOwner',
    },
    bind: ['isOwner', 'auth.id != null && auth.id == data.creatorId'],
  },
} satisfies InstantRules;

export default rules;