<p align="center">
    <a target="_blank" href="https://jaayedaad.com">
        <img alt="Effortlessly and Securely Track All Your Investments Logo" src="./public/jaayedaad_transparent.svg">
    </a>
<p align="center">
Effortlessly and Securely, Track All Your Investments!
<br/>
From market stocks to vintage clocks, crypto coins to fine wines, track every asset while keeping your data confined!
<br/>
<a target="_blank" href="https://jaayedaad.com/">Check us out!</a>
</p>
</p>

<p align="center">
    We're currently in an <b>Invite Only Phase</b> to get early feedback from our users. If you're interested in trying out Jaayedaad, please DM us on <a target="_blank" href="https://x.com/jaayedaad">X</a>
</p>

## Description

Jaayedaad (Hindi for _Wealth_) is an investment portfolio tracking web-app that allows you to meticulously track all your investments in one place without linking your personal accounts in a privacy-first way.

## Features

- Diverse Asset Management: Track stocks, crypto, mutual funds, metals, and more from 90 countries.
- Custom Categories: Create custom categories for any type of asset, including collectibles, Yachts, Angel Investments, anything you can imagine.
- Multiple currencies: Add different investments in different currencies.
- Visual Analytics: Simplified visualization with graphs and charts for multiple timelines including portfolio diversification.
- Detailed P/L Tracking: Monitor both realized and unrealized profits and losses instantly.
- Secure Data: Strong per-user AES encryption ensures your investment data is private and secure.
- Decentralised Data Storage: Have your Data stored on the Sia Network & IPFS for added decentralisation and control with the help of Renterd.
- User-Defined Privacy: Customize visibility of your profile and assets on the dashboard for easy monitoring in public places.
- Personalized Profiles: Claim a unique username and customize your public profile.
- Optional Public Profile: Share your public profile with friends and family to showcase your investment journey with meticulous enabling of what you want to show.
- Delete your Data: Delete your account & its associated data anytime you want with a single click.

## Tech Stack

- **Next.js**: React SSR framework for the core web-app.
- **Typescript**: Strongly typed JS.
- **Prisma**: ORM for database.
- **PostgreSQL**: SQL Database.
- **Renterd**: Interface to access the Sia Network with REST.
- [**Sia**](https://sia.tech/): Decentralized storage for assets.
- **Tailwind CSS**: Utility-first CSS framework.

## Setup

We recommend using our hosted version at [Jaayedaad](https://jaayedaad.com) for a seamless experience. However, if you want to run it locally, follow these steps:

1. Clone the repo:

    ```sh
         git clone https://github.com/jaayedaad/jaayedaad.git
    ```

2. Go to the project folder:

    ```sh
        cd jaayedaad
    ```

3. Install packages with yarn:

    ```sh
        yarn
    ```

4. Set up your `.env` file:

    - Duplicate `.env.example` to `.env`
    - Use `openssl rand -base64 32` to generate a key and add it under `NEXTAUTH_SECRET` in the `.env` file.
    - [Generate Google OAuth credentials](https://support.google.com/cloud/answer/6158849?hl=en) and add them to the `.env` file.
    - [Generate TwelveData API Key](https://twelvedata.com/) and add it to the `.env` file.
    - Set `USE_SIA` to `0` to use PostgresDB in the `.env` file.

    > Want to use Sia for decentralised storage? Follow these steps:

    - [Generate a BIP 39 Passhphrase & store it as Renterd Seed](https://it-tools.tech/bip39-generator) and add it to the `.env` file.
    - Set a secure `RENTERD_API_PASSWORD` as per your preference in the `.env` file.
    - Set a secure `SIA_ADMIN_USERNAME` and `SIA_ADMIN_PASSWORD` as per your preference in the `.env` file.
    - Set `USE_SIA` to `1` in the `.env` file.
    - Now edit the same values in the `docker-compose.yml` file.

5. Set up Postgres Database & Sia Renterd locally using Docker

    ```sh
    docker-compose up -d
    ```

6. Quick start with `yarn dev`
7. Access the application at `http://localhost:3000`
