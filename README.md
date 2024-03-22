# Welcome to Jaayedaad

## Description

`Jaayedaad` is a portfolio management application where users can track their investments by adding transactions for buying and selling various assets. The application provides features such as viewing line charts, doughnut charts, realized profit/loss, unrealized profit/loss, current asset values and much more.

## Features

1. Add transactions for buying and selling assets of various types.
2. View line charts and doughnut charts for better visualization of investments.
3. Track realized and unrealized profit/loss.
4. Track your current asset values.

## Tech Stack

- **Next.js**: Used for building the frontend/backend of the application.
- **Prisma**: ORM used for database operations.
- **PostgreSQL**: Database used for storing user and transaction data.

## Setup

To set up the project locally, follow these steps:

1.  Clone the repo into a public GitHub repository:

        git clone https://github.com/jaayedaad/jaayedaad.git

2.  Go to the project folder

        cd investment-tracker

3.  Install packages with npm

        npm install

4.  Set up your `.env` file
    - Duplicate `.env.example`to `.env`
    - Use `openssl rand -base64 32` to generate a key and add it under `NEXTAUTH_SECRET` in the `.env` file.
5.  Set up the database using the Prisma schema

        npx prisma migrate dev

6.  Quick start with `npm run dev`
7.  Access the application at `http://localhost:3000`

## Usage

- Register a new account or log in if you already have one.
- Add transactions for buying and selling assets.
- Navigate through different sections to view graphs, charts, and profit/loss information.
