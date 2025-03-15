This is an attempt to reverse-engineer T3 Chat while leveraging InstantDB. It is still a work in progress.

## Interface

The interface is largely intended to mimic T3 Chat with a few changes that I prefer.

Although likely excessive for this use case, I am using Shadcn components.

## NextJS

This is technically a Next app, but I leverage few of Next's advantages.

## InstantDB

The backend is InstantDB. It allowed me to bypass writing a sync layer and easily render chats without traditional routing.
