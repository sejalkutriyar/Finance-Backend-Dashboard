# Finance Dashboard Backend

A RESTful backend API for a finance dashboard system with role-based access control, built with Node.js, Express, Prisma, and PostgreSQL.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma v5
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Password Hashing**: bcryptjs

## Features

- User authentication (Register & Login)
- Role-based access control (VIEWER, ANALYST, ADMIN)
- Financial records management with soft delete
- Dashboard summary APIs with aggregated data
- Filtering and pagination for transactions
- Monthly trends and category-wise analytics

## Roles & Permissions

| Action                        | VIEWER | ANALYST | ADMIN |
|-------------------------------|--------|---------|-------|
| Register / Login              | ✅     | ✅      | ✅    |
| View own transactions         | ✅     | ✅      | ✅    |
| View all transactions         | ❌     | ❌      | ✅    |
| Create transactions           | ❌     | ✅      | ✅    |
| Update transactions           | ❌     | ❌      | ✅    |
| Delete transactions           | ❌     | ❌      | ✅    |
| View dashboard summary        | ✅     | ✅      | ✅    |
| View category & trends        | ❌     | ✅      | ✅    |
| Manage users                  | ❌     | ❌      | ✅    |

## Project Structure
```
finance-backend/
├── prisma/
│   ├── schema.prisma        # Database models
│   └── migrations/          # Migration files
├── src/
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Auth & role middleware
│   ├── routes/              # API route definitions
│   ├── services/            # Business logic
│   ├── validators/          # Zod validation schemas
│   ├── prisma.js            # Prisma client instance
│   └── index.js             # App entry point
├── .env
├── package.json
└── README.md
```

## Setup & Installation

### Prerequisites
- Node.js v18+
- PostgreSQL

### Steps

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd finance-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**

Create a `.env` file in root:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/finance_db"
JWT_SECRET="your-secret-key"
PORT=3000
```

4. **Run database migrations**
```bash
npx prisma migrate dev
```

5. **Start the server**
```bash
npm run dev
```

Server will start at `http://localhost:3000`

## API Endpoints

### Auth
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/register | Register new user | Public |
| POST | /api/auth/login | Login user | Public |

### Users
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/users | Get all users | ADMIN |
| GET | /api/users/:id | Get user by ID | ADMIN |
| PUT | /api/users/:id | Update user | ADMIN |
| DELETE | /api/users/:id | Delete user | ADMIN |

### Transactions
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/transactions | Get all transactions | ALL |
| GET | /api/transactions/:id | Get transaction by ID | ALL |
| POST | /api/transactions | Create transaction | ANALYST, ADMIN |
| PUT | /api/transactions/:id | Update transaction | ADMIN |
| DELETE | /api/transactions/:id | Soft delete transaction | ADMIN |

### Dashboard
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/dashboard/summary | Total income, expense, balance | ALL |
| GET | /api/dashboard/categories | Category-wise totals | ANALYST, ADMIN |
| GET | /api/dashboard/trends | Monthly trends (last 6 months) | ANALYST, ADMIN |
| GET | /api/dashboard/recent | Recent 10 transactions | ANALYST, ADMIN |

## Query Parameters (Transactions)
```
GET /api/transactions?type=INCOME&category=Salary&startDate=2026-01-01&endDate=2026-04-01&page=1&limit=10
```

| Param | Description | Example |
|-------|-------------|---------|
| type | Filter by type | INCOME or EXPENSE |
| category | Filter by category | Salary |
| startDate | Filter from date | 2026-01-01 |
| endDate | Filter to date | 2026-04-01 |
| page | Page number | 1 |
| limit | Records per page | 10 |

## Sample Request & Response

### Register
```json
POST /api/auth/register
{
  "name": "Sejal",
  "email": "sejal@example.com",
  "password": "password123",
  "role": "ADMIN"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": 1,
      "name": "Sejal",
      "email": "sejal@example.com",
      "role": "ADMIN"
    }
  }
}
```

### Create Transaction
```json
POST /api/transactions
Authorization: Bearer <token>
{
  "amount": 5000,
  "type": "INCOME",
  "category": "Salary",
  "date": "2026-04-01",
  "notes": "Monthly salary"
}

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "amount": 5000,
    "type": "INCOME",
    "category": "Salary",
    "date": "2026-04-01T00:00:00.000Z",
    "notes": "Monthly salary",
    "userId": 1
  }
}
```

## Assumptions Made

1. Only ADMIN can assign roles during registration — in real world this would have a separate admin panel
2. Soft delete is implemented for transactions — data is never permanently lost
3. VIEWER and ANALYST can only see their own transactions, ADMIN sees all
4. JWT token expires in 7 days
5. Pagination default is 10 records per page

## Tradeoffs

1. **Prisma v5 over v7** — Prisma 7 had breaking changes with PostgreSQL adapter config, so v5 was chosen for stability
2. **JWT over Sessions** — Stateless auth is better for API-first backends
3. **Soft Delete** — Chosen over hard delete to preserve financial data integrity