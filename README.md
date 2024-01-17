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

## Development

1.  Clone the repo into a public GitHub repository:

        git clone https://github.com/ShubhamPalriwala/investment-tracker.git

2.  Go to the project folder

        cd investment-tracker

3.  Install packages with npm

        npm i

4.  Set up your `.env` file
    - Duplicate `.env.example`to `.env`
    - Use `openssl rand -base64 32` to generate a key and add it under `NEXTAUTH_SECRET` in the `.env` file.
5.  Quick start with `npm run dev`
