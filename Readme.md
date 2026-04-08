# Finance Dashboard Backend

A backend system for managing financial transactions with role-based access control, audit logging, and analytics support.

---
## 📌 POSTMAN API DOCUMENT 

```bash
https://drive.google.com/drive/folders/1Xazc5b2C7HgZXMRGUPznH5y-oc-tn4rL?usp=sharing
```
---

## 🚀 Tech Stack

- Node.js + Express (TypeScript)
- PostgreSQL + Prisma ORM
- Zod (validation)
- JWT Authentication
- Role-Based Access Control (RBAC)

---

## 🧠 Architecture

The project follows a layered architecture:

```bash
🌐 Routes → 🎮 Controllers → ⚙️ Services → 📦 Repositories → 🗄️ Database
```

- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic & rules
- **Repositories**: Database interaction (Prisma)
- **Middleware**: Auth, RBAC, Validation, Rate limiting

---

## 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control:
  - **Viewer** → Read-only
  - **Analyst** → Read + analytics
  - **Admin** → Full access

Middleware:

- `authenticate` → verifies token
- `requireRole` / `requireMinRole` → enforces permissions
- `requireOwnerOrAdmin` → ownership checks

---

## 📊 Core Features

### 1. User Management

- Register / Login / Logout
- Role assignment (Admin only)
- Activate / Deactivate users (Admin only)

---

### 2. Transactions

- Create / Read / Delete (soft delete)
- Filtering (type, category, date)
- Pagination support

---

### 3. Categories

- Dynamic category management
- Used for aggregation & filtering

---

### 4. Dashboard (Aggregation)

- Total income / expense
- Category breakdown
- Trends (monthly)

---

### 5. Audit Logging

Tracks:

- CREATE / UPDATE / DELETE / ROLE_CHANGE
- Stores before/after state
- Captures user + metadata

---

## 📦 API Endpoints

### Users (Admin)

- `POST /users/register`
- `POST /users/login`
- `POST /users/logout`
- `GET /users/:id`
- `DELETE /users/:id`
- `PATCH /users/:id/deactivate`
- `PATCH /users/:id/assign-role`

### Transactions

- `POST /transactions`
- `GET /transactions`
- `PATCH /transactions/:id`
- `DELETE /transactions/:id`
- `GET /transactions/dashboard`

### Categories

- `GET /categories`
- `POST /categories`
- `GET /categories/:id`

---

## 🔍 Query Features

- Pagination: `?page=1&limit=10`
- Filters:
  - `type=INCOME|EXPENSE`
  - `categoryId=...`
  - `startDate`, `endDate`
  - `search=keyword`

---

## ⚖️ Technical Decisions & Trade-offs

### 1. Layered Architecture

- Improves maintainability and separation of concerns
- Tradeoff: Slight increase in boilerplate

---

### 2. Prisma ORM

- Type-safe database access
- Faster development
- Tradeoff: Less control vs raw SQL

---

### 3. RBAC via Middleware

- Clean and reusable permission enforcement
- Tradeoff: Less flexible than policy-based systems

---

### 4. Validation via Zod Middleware

- Centralized validation
- Controllers remain clean
- Tradeoff: Requires strict schema design

---

### 5. Soft Delete for Transactions

- Preserves financial data for auditability
- Tradeoff: Additional query filtering (`deletedAt`)

---

### 6. Decimal for Amount

- Prevents floating point errors
- Tradeoff: Slight performance overhead

---

### 7. Simplified Refresh Token Model

- Easy to implement and organize
- Tradeoff: Does not include advanced rotation logic

---

## ⚠️ Limitations

- No advanced token rotation (can be extended)
- Rate limiting is not distributed (no Redis)
- Limited optimization on aggregation queries
- No automated tests due to time constraints (unit/integration)
- No caching layer implemented
- No full test coverage (due to time constraints)

---

## 🔧 Setup Instructions

```bash
git clone <repo>
cd project
npm install

# Setup env
cp .env.example .env

# Run migrations
npx prisma migrate dev

# Start server
npm run dev
```
