# UniMove Backend API

## Tech Stack
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **ORM**: TypeORM
- **Database**: PostgreSQL
- **Auth**: JWT (access + refresh token rotation) + Google OAuth 2.0

## Cài đặt

```bash
cd backend
npm install

# Copy file env và điền thông tin
cp .env.example .env
```

## Chạy development

```bash
npm run dev
```

> TypeORM `synchronize: true` đang bật ở mode development — tự tạo/sửa table.
> **Tắt đi và dùng migration khi deploy production.**

## Cấu trúc thư mục

```
src/
├── config/
│   ├── database.ts        # TypeORM DataSource
│   └── passport.ts        # Google OAuth strategy
├── entities/              # TypeORM entities (khớp DBML)
│   ├── User.entity.ts
│   ├── RefreshToken.entity.ts
│   ├── Customer.entity.ts
│   └── DeviceToken.entity.ts
├── middleware/
│   ├── auth.middleware.ts  # JWT authenticate guard
│   ├── validate.middleware.ts # Zod schema validation
│   └── error.middleware.ts
├── modules/
│   └── auth/
│       ├── auth.controller.ts
│       ├── auth.service.ts
│       ├── auth.routes.ts
│       └── dto/auth.dto.ts  # Zod schemas
├── utils/
│   ├── jwt.util.ts
│   ├── password.util.ts
│   ├── email.util.ts
│   └── response.util.ts
├── app.ts
└── server.ts
```

## API Endpoints

### Authentication

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/auth/register` | Đăng ký tài khoản | - |
| POST | `/api/auth/login` | Đăng nhập | - |
| POST | `/api/auth/refresh` | Làm mới access token | - |
| POST | `/api/auth/logout` | Đăng xuất | - |
| POST | `/api/auth/forgot-password` | Gửi email reset mật khẩu | - |
| POST | `/api/auth/reset-password` | Đặt lại mật khẩu | - |
| GET | `/api/auth/google` | Bắt đầu Google OAuth | - |
| GET | `/api/auth/google/callback` | Google OAuth callback | - |
| GET | `/api/auth/me` | Lấy thông tin user hiện tại | Bearer Token |

### Request / Response mẫu

**POST /api/auth/register**
```json
// Request
{
  "email": "user@example.com",
  "password": "Password123",
  "fullName": "Nguyễn Văn A",
  "phone": "0901234567",
  "role": "customer"
}

// Response 201
{
  "success": true,
  "message": "Đăng ký thành công",
  "data": {
    "user": { "id": "...", "email": "...", "fullName": "...", "role": "customer", ... },
    "tokens": { "accessToken": "...", "refreshToken": "..." }
  }
}
```

**POST /api/auth/login**
```json
// Request
{ "email": "user@example.com", "password": "Password123" }

// Response 200
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": { "user": {...}, "tokens": { "accessToken": "...", "refreshToken": "..." } }
}
```

**POST /api/auth/refresh**
```json
// Request
{ "refreshToken": "..." }
```

**POST /api/auth/logout**
```json
// Request
{ "refreshToken": "..." }
```

**POST /api/auth/forgot-password**
```json
// Request
{ "email": "user@example.com" }
```

**POST /api/auth/reset-password**
```json
// Request
{ "token": "<token từ email>", "newPassword": "NewPass123" }
```

## Google OAuth Flow

1. FE redirect user đến `GET /api/auth/google`
2. Google xác thực xong, callback về `/api/auth/google/callback`
3. Server redirect FE về `{FRONTEND_URL}/auth/callback?accessToken=...&refreshToken=...`
4. FE lưu tokens và dùng bình thường

## Bảo mật

- Access token TTL: 15 phút
- Refresh token TTL: 30 ngày với **rotation** (mỗi lần refresh → token cũ bị revoke)
- Password hash: bcrypt với 12 salt rounds
- Reset password token: SHA-256 hashed, TTL 30 phút
- Helmet + CORS configured
