This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run docker container for database:

```bash
docker compose up
```

Then, run the development server:

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

## Description

It is an online auction platform. Users can post items by specifying a title, starting price, bid interval, as well as attaching a picture and selecting an end date. Once item's been posted, other users can bid on it, receiving notifications if their current bid is “outbid” by someone else.

## Architechture

The basis of the project is next.js. The database is postgres running under the docker container. Communication with the database is done via Drizzle ORM. For pre-styled UI-components shadCN is used. User authorization is done using auth.js. All user product photos are stored in R2 Bucket from cloudflare. Knock is used to send notifications.

So User (Browser/Client) <--> Frontend (Next.js (React) shadCN/UI) <--> Backend (API routes Drizzle ORM) <--> PostgreSQL DB.

## User paths

### Registration

User clicks on 'sign in' button at the right upper corner, which asks them to log in via google account. They can sign out and choose a different account if they like.

### Choosing an auction

At the home ('all auctions') page, list of all auctions is presented. User can choose one and either start bidding by pressing 'place bid' button or view history of bids by pressing 'view bids history' if auction is over.

### Bidding

On particular item page that user chose, they can see list of bids made so far. If they press 'place a bid' button, ther own bid of (last_bid + bid_interval) will be placed
In-app notification to all previous bidders will be sent that they were outbidded.

### Creating an auction

To create an auction, user can press 'create auction' button on the header, which will take them to another 'create' page. There they can specify an item name, starting price of the auction, bid interval, attach photo of the item and pick auction end date.
Once all fields are filled, user can press 'post item' button which will add the item to list of all items on home page, which user will be redirected to.

### Checking out list of your auctioned items

In order to see not all the items, but just the ones published by you, you can follow 'my auctions' link on the header.
