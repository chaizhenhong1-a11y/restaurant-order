# Restaurant Order

Professional mobile-first QR restaurant ordering system.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- PostgreSQL
- Prisma ORM 7 + PostgreSQL driver adapter
- Mobile-first responsive web UI

## Product areas

- `/` — customer QR ordering
- `/kitchen` — Kitchen Display System
- `/admin` — restaurant management
- `/api/health` — health endpoint
- `/api/orders` — persistent order submission
- `/api/orders/[orderNumber]` — order status

## Increment 004 database setup

This increment makes order submission persistent. PostgreSQL is now required to complete checkout.

### 1. Install the new dependencies

```powershell
npm install
```

### 2. Create `.env`

Copy:

```text
.env.example
```

to:

```text
.env
```

For a typical local PostgreSQL installation:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/restaurant_order"
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

### 3. Create the PostgreSQL database

Create an empty database named:

```text
restaurant_order
```

You can do that with pgAdmin or PostgreSQL tooling.

### 4. Generate Prisma Client

```powershell
npm run db:generate
```

### 5. Apply the schema

```powershell
npm run db:migrate -- --name init_order_system
```

### 6. Seed restaurant data

```powershell
npm run db:seed
```

The seed creates:

- Mellow Kitchen
- menu categories
- menu items
- menu customisation options
- tables A01–A05, B01–B05 and B08

### 7. Start the app

```powershell
npm run dev
```

Open:

```text
http://localhost:3000/?table=A01
```

Complete an order. The order is now written to PostgreSQL.

## Inspect stored orders

```powershell
npm run db:studio
```

Open the `Order` and `OrderItem` tables in Prisma Studio.

## Security rule

The browser does not decide the final price.

`POST /api/orders` loads current menu prices and option prices from PostgreSQL, validates selections, and calculates the total on the server before creating the order.
