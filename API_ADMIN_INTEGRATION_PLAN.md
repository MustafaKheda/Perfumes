# API And Admin Panel Integration Plan

This plan is for turning the current Scentora Next.js perfume storefront into a full ecommerce app with APIs, payment gateway integration, and an admin panel.

## Recommended Stack

```txt
Frontend + Backend: Next.js App Router
Database: PostgreSQL
ORM: Prisma
Auth: Auth.js / NextAuth or Clerk
Payment: Razorpay if India-focused, Stripe if international
Image Upload: Cloudinary / UploadThing / S3
Admin Panel: Built inside /admin
```

For this project, Razorpay is recommended if most customers are in India.

## Phase 1: Project Setup

- [x] Create `.env.example`
- [x] Add database connection config
- [x] Install Prisma
- [ ] Install auth package
- [ ] Install payment gateway SDK
- [ ] Install validation library like `zod`
- [ ] Create shared API response helper
- [ ] Create error handling helper
- [ ] Create protected admin route middleware

Suggested folder structure:

```txt
app/
  api/
  admin/
  shop/
  collections/

lib/
  prisma.ts
  auth.ts
  payment.ts
  api-response.ts
  validations/

prisma/
  schema.prisma
```

## Phase 2: Database Design

- [x] Create `User` model
- [x] Create `Product` model
- [x] Create `Category` model
- [x] Create `Collection` model
- [x] Create `Order` model
- [x] Create `OrderItem` model
- [x] Create `CartItem` model
- [x] Create `NewsletterSubscriber` model
- [x] Create `Payment` model
- [x] Create admin role support

Core schema idea:

```txt
User
- id
- name
- email
- passwordHash
- role: USER | ADMIN

Product
- id
- name
- slug
- description
- price
- image
- categoryId
- stock
- isBestSeller
- isFeatured
- isActive

Category
- id
- name
- slug

Collection
- id
- name
- slug
- image

Order
- id
- userId
- status
- paymentStatus
- totalAmount
- shippingAddress

Payment
- id
- orderId
- provider
- providerOrderId
- providerPaymentId
- status
```

## Phase 3: Public Product APIs

- [x] `GET /api/products`
- [x] `GET /api/products/[id]`
- [x] Filter by category
- [x] Filter by collection
- [x] Search by product name
- [x] Sort by price/newest
- [x] Pagination
- [x] Return only active products

Example query support:

```txt
/api/products?category=men
/api/products?collection=luxury
/api/products?search=amber
/api/products?sort=price_asc
/api/products?page=1&limit=12
```

## Phase 4: Collection And Category APIs

- [x] `GET /api/categories`
- [x] `GET /api/categories/[slug]/products`
- [x] `GET /api/collections`
- [x] `GET /api/collections/[slug]`
- [x] `GET /api/collections/[slug]/products`

These APIs should replace the current hard-coded arrays in:

```txt
app/shop/[category]/page.tsx
app/collections/[collection]/page.tsx
components/FeaturedCollections.tsx
components/CategorySection.tsx
```

## Phase 5: Cart APIs

- [ ] `GET /api/cart`
- [ ] `POST /api/cart/items`
- [ ] `PATCH /api/cart/items/[id]`
- [ ] `DELETE /api/cart/items/[id]`
- [ ] Validate stock before adding
- [ ] Validate quantity before checkout
- [ ] Show cart count in navbar
- [ ] Create cart drawer or cart page

Cart behavior:

```txt
Guest user: localStorage cart or session cart
Logged-in user: database cart
Before checkout: cart must be saved in database
```

## Phase 6: Checkout And Payment Gateway

- [ ] Create checkout page
- [ ] Collect shipping address
- [ ] Validate cart items
- [ ] Calculate subtotal
- [ ] Calculate shipping fee
- [ ] Calculate final total
- [ ] Create pending order in database
- [ ] Create payment order/session with gateway
- [ ] Redirect/open payment UI
- [ ] Verify payment on backend
- [ ] Handle webhook
- [ ] Mark order as paid
- [ ] Reduce product stock after successful payment
- [ ] Clear cart after successful order

Payment APIs:

```txt
POST /api/checkout
POST /api/payments/create-order
POST /api/payments/verify
POST /api/payments/webhook
```

Order statuses:

```txt
PENDING
PAID
PROCESSING
SHIPPED
DELIVERED
CANCELLED
REFUNDED
```

Payment statuses:

```txt
PENDING
SUCCESS
FAILED
REFUNDED
```

Important payment checklist:

- [ ] Never trust payment success from frontend only
- [ ] Always verify payment signature on backend
- [ ] Use webhook as final source of truth
- [ ] Store payment gateway IDs in database
- [ ] Make webhook idempotent so duplicate events do not break orders

## Phase 7: Admin Authentication

- [ ] Add login page
- [ ] Add admin role
- [ ] Protect `/admin`
- [ ] Protect `/api/admin/*`
- [ ] Redirect non-admin users
- [ ] Add logout
- [ ] Add session check API

Routes:

```txt
/admin/login
/admin/dashboard
```

Admin protection rule:

```txt
Only users with role ADMIN can access admin pages and admin APIs.
```

## Phase 8: Admin Dashboard

- [ ] Total orders
- [ ] Total revenue
- [ ] Pending orders
- [ ] Low stock products
- [ ] Recent orders
- [ ] Newsletter subscribers count
- [ ] Best-selling products

Admin API:

```txt
GET /api/admin/dashboard
```

Dashboard response:

```json
{
  "totalRevenue": 0,
  "totalOrders": 0,
  "pendingOrders": 0,
  "lowStockProducts": [],
  "recentOrders": [],
  "bestSellers": []
}
```

## Phase 9: Admin Product Management

- [ ] Product list page
- [ ] Create product page/modal
- [ ] Edit product page/modal
- [ ] Delete/archive product
- [ ] Upload product image
- [ ] Manage category
- [ ] Manage collections
- [ ] Manage stock
- [ ] Toggle active/inactive
- [ ] Toggle best seller
- [ ] Toggle featured
- [ ] Set product tags like HOT/NEW

Admin APIs:

```txt
GET    /api/admin/products
POST   /api/admin/products
GET    /api/admin/products/[id]
PATCH  /api/admin/products/[id]
DELETE /api/admin/products/[id]
```

Prefer soft delete:

```txt
isActive = false
```

Do not permanently delete products unless there is a clear reason.

## Phase 10: Admin Order Management

- [ ] Order list
- [ ] Order detail page
- [ ] Filter by order status
- [ ] Filter by payment status
- [ ] Search by customer email/order ID
- [ ] Update order status
- [ ] Add tracking ID
- [ ] Cancel order
- [ ] Refund status field

Admin APIs:

```txt
GET   /api/admin/orders
GET   /api/admin/orders/[id]
PATCH /api/admin/orders/[id]
```

## Phase 11: Admin Collection And Category Management

- [ ] Category list
- [ ] Create category
- [ ] Edit category
- [ ] Disable category
- [ ] Collection list
- [ ] Create collection
- [ ] Edit collection
- [ ] Add/remove products from collection
- [ ] Upload collection image

Admin APIs:

```txt
GET    /api/admin/categories
POST   /api/admin/categories
PATCH  /api/admin/categories/[id]

GET    /api/admin/collections
POST   /api/admin/collections
PATCH  /api/admin/collections/[id]
DELETE /api/admin/collections/[id]
```

## Phase 12: Newsletter API

- [ ] Connect newsletter form
- [x] Validate email
- [ ] Prevent duplicate subscription
- [ ] Store created date
- [ ] Admin can view subscribers

APIs:

```txt
POST /api/newsletter
GET  /api/admin/newsletter
```

## Phase 13: Frontend Integration

- [ ] Replace hard-coded products with API/database data
- [ ] Replace hard-coded collections with API/database data
- [ ] Connect filter bar to API query params
- [ ] Connect sort dropdown
- [ ] Connect pagination
- [ ] Connect add-to-cart button
- [ ] Connect cart count in navbar
- [ ] Connect checkout page
- [ ] Connect payment success/failure pages
- [ ] Connect newsletter form

Pages to update:

```txt
/
/shop/[category]
/collections/[collection]
/guide
/cart
/checkout
/order-success
/order-failed
```

## Phase 14: Security Checklist

- [ ] Validate every API input with `zod`
- [ ] Protect admin APIs
- [ ] Verify payment webhook signature
- [ ] Do not expose payment secret keys to frontend
- [ ] Do not trust frontend price/quantity
- [ ] Calculate order total on backend
- [ ] Rate-limit login, newsletter, checkout APIs
- [ ] Use HTTPS in production
- [ ] Store secrets only in `.env`
- [ ] Add CORS only if needed

## Phase 15: Testing Checklist

- [ ] Product listing works
- [ ] Product filters work
- [ ] Pagination works
- [ ] Admin login works
- [ ] Admin product CRUD works
- [ ] Add to cart works
- [ ] Checkout creates pending order
- [ ] Payment success updates order
- [ ] Payment failure keeps order unpaid
- [ ] Webhook handles duplicate events safely
- [ ] Stock decreases only after successful payment
- [ ] Non-admin users cannot access admin APIs
- [ ] Build passes with `npm run build`

## Suggested Build Order

1. Database + Prisma - done
2. Product/category/collection models - done
3. Public product APIs - done
4. Connect public APIs to PostgreSQL through Prisma - done
5. Replace frontend hard-coded data
6. Admin auth
7. Admin product CRUD
8. Cart
9. Checkout
10. Payment gateway
11. Orders admin
12. Dashboard
13. Newsletter/admin extras

This order avoids building payment before the product and order data is stable.
