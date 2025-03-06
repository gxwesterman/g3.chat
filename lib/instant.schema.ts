// // instant.schema.ts
// import { i } from '@instantdb/core';

// const _schema = i.schema({
//   entities: {
//     $users: i.entity({
//       email: i.string().unique().indexed(),
//     }),
//     profiles: i.entity({
//       nickname: i.string(),
//       createdAt: i.date(),
//     }),
//     posts: i.entity({
//       title: i.string(),
//       body: i.string(),
//       createdAt: i.date(),
//     }),
//     comments: i.entity({
//       body: i.string(),
//       createdAt: i.date(),
//     }),
//     tags: i.entity({
//       title: i.string(),
//     }),
//   },
//   links: {
//     postAuthor: {
//       forward: { on: 'posts', has: 'one', label: 'author' },
//       reverse: { on: 'profiles', has: 'many', label: 'authoredPosts' },
//     },
//     commentPost: {
//       forward: { on: 'comments', has: 'one', label: 'post' },
//       reverse: { on: 'posts', has: 'many', label: 'comments' },
//     },
//     commentAuthor: {
//       forward: { on: 'comments', has: 'one', label: 'author' },
//       reverse: { on: 'profiles', has: 'many', label: 'authoredComments' },
//     },
//     postsTags: {
//       forward: { on: 'posts', has: 'many', label: 'tags' },
//       reverse: { on: 'tags', has: 'many', label: 'posts' },
//     },
//     profileUser: {
//       forward: { on: 'profiles', has: 'one', label: '$user' },
//       reverse: { on: '$users', has: 'one', label: 'profile' },
//     },
//   },
// });

// // This helps Typescript display better intellisense
// type _AppSchema = typeof _schema;
// interface AppSchema extends _AppSchema {}
// const schema: AppSchema = _schema;

// export type { AppSchema };
// export default schema;