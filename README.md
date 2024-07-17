# Real-Time Chat Forum

![image](https://github.com/user-attachments/assets/54d73060-4e47-42c0-a550-710134963b2e)


A modern, real-time chat application built with Next.js, TypeScript, and Supabase. This project demonstrates the implementation of a live chat forum with user authentication, real-time message updates, and profanity filtering.

## Features

- Real-time messaging using Supabase's real-time subscriptions
- User authentication and session management
- Profanity filtering for maintaining a friendly chat environment
- Responsive UI design using custom components
- Avatar support for users
- Efficient message rendering with virtualized scrolling

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework for building server-side rendered and static web applications
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript
- [Supabase](https://supabase.io/) - Open-source Firebase alternative for backend services
- [bad-words](https://github.com/web-mech/badwords) - JavaScript filter for bad words
- Custom UI components (likely using a component library or custom-built)

## Getting Started

1. Clone the repository:
git clone https://github.com/your-username/real-time-chat-forum.git


2. Install dependencies:
cd real-time-chat-forum npm install


3. Set up your Supabase project and add the necessary environment variables to a `.env.local` file:
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key


4. Run the development server:
npm run dev


5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Code Examples

### Real-time Message Subscription

```typescript
useEffect(() => {
fetchMessages()
const messagesSubscription = supabase
 .channel('public:messages')
 .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
   setMessages(prevMessages => [...prevMessages, payload.new as Message])
 })
 .subscribe()

return () => {
 messagesSubscription.unsubscribe()
}
}, [supabase, fetchMessages])

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
