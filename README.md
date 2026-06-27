# BCS Marina Ops Mobile Lite

This repository contains a simplified, mobile‑friendly starter application for small marine service companies.  
It is built with Next.js (App Router) and integrates Supabase authentication out of the box.  
The goal of this project is to provide a clean foundation with a premium look and feel, while remaining easy to customize for your own business.

## Features

- **Login first** – the home page is a beautiful login screen.  
  After you sign in you are redirected to the dashboard.  
- **Role‑based access control** – each user has a role (owner, manager, office, technician).  
  Pages and actions are protected on both the server and client side.  
- **Customers and vessels** – add and edit customers and their boats.  
- **Estimates** – create estimates, approve them and convert them into invoices or work orders.  
- **Invoices** – generate invoices from estimates or create them from scratch.  
- **Work orders** – create jobs from estimates or from scratch and assign them to technicians.  
- **Convert estimate to invoice** – a one‑click action on an estimate that copies its line items into a new invoice.  
- **Supabase** – user accounts, sessions and database integration.  
- **Stripe** – the project is structured so that you can easily wire up payments and subscriptions.  
- **Resend** – use Resend to send system e‑mails like login magic links, estimates and invoices.

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/bcs-marina-ops-mobile-lite.git
   cd bcs-marina-ops-mobile-lite
   ```
2. **Install dependencies** (requires Node.js >=18)  
   ```bash
   npm install
   ```
3. **Copy the environment example**  
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` and fill in your Supabase credentials (URL and anon/public key) and Stripe/Resend keys if you plan to use those features.
4. **Run the development server**  
   ```bash
   npm run dev
   ```
5. **Open the app** at `http://localhost:3000` and sign in.

## Deployment

This project has been designed to work smoothly on Vercel.  
Once connected to a GitHub repository, any push to `main` will trigger a new deploy.  
Just remember to set your environment variables in the Vercel dashboard for production.

## License

This project is provided as a starting point for your own marina operations application.  
You are free to modify and use it for commercial purposes.