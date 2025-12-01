# Note buat Nelson Dokumentasi IDOR

Jadi ini proyek yang sengaja dibuat untuk vulnerability IDOR (Insecure Direct Object Reference) menggunakan stack Next.js di frontend dan Node.js dengan Express serta Prisma di backend. 

## Fitur

-   **User Authentication**: Sistem login dan registrasi yang setidaknya jalan lah ya.
-   **User Dashboard**: Menampilkan informasi profil user yang berhasil login.
-   **IDOR Vulnerability**: Endpoint yang sengaja dibuat rentan supaya IDORnya keliatan.
- **Dockerized**: Proyek ini sudah di-dockerize supaya ga repot.

## Tech Stack

-   **Frontend**:
    -   [Next.js](https://nextjs.org/) - Dari Template
    -   [React](https://reactjs.org/) - Dari Template
    -   [TypeScript](https://www.typescriptlang.org/)applications.
    -   [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
-   **Backend**:
    -   [Node.js](https://nodejs.org/)
    -   [Express](https://expressjs.com/)
    -   [Prisma](https://www.prisma.io/) - Karena malas bikin query SQL manual
    -   [PostgreSQL](https://www.postgresql.org/) - Ada di NeonDB

## Project Structure

Proyel ini memiliki struktur sebagai berikut:

```
.
├── backend/
│   ├── controllers/
│   │   ├── authController.js      # Login & register (hash password, return user data)
│   │   └── usersController.js     # IDOR demo: fetch user by id tanpa otorisasi
│   ├── prisma/
│   │   ├── schema.prisma          # Definisi model User (Prisma)
│   │   └── seed.js                # Seed awal user demo (hash password)
│   ├── routes/
│   │   ├── auth.js                # /auth/login & /auth/register
│   │   └── users.js               # /api/users/:id (vulnerable endpoint)
│   ├── Dockerfile                 # Image build backend (port 4000)
│   ├── .dockerignore              # Eksklusi saat build docker
│   ├── .env                       # DATABASE_URL Postgres (Neon/local)
│   ├── index.js                   # Entrypoint Express + mount routes
│   └── package.json               # Dependency & scripts (dev, seed, migrate)
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx               # Halaman login (fetch backend)
│   │   ├── register/page.tsx      # Form registrasi (tema hijau)
│   │   ├── dashboard/page.tsx     # Dashboard user (IDOR test via userId)
│   │   └── layout.tsx             # Root layout Next.js
│   ├── components/
│   │   └── ui/                    # Kumpulan komponen UI (Button, Card, dsb)
│   ├── lib/
│   │   └── utils.ts               # Utilitas (helper umum)
│   ├── public/                    # Asset statis
│   ├── styles/
│   │   └── globals.css            # Global stylesheet
│   ├── Dockerfile                 # Multi-stage build Next.js (port 3000)
│   ├── .dockerignore              # Eksklusi saat build docker
│   ├── next.config.mjs            # Konfigurasi Next.js
│   ├── tsconfig.json              # Konfigurasi TypeScript
│   └── package.json               # Dependency frontend & scripts
│
├── docker-compose.yml             # Orkestrasi Postgres + backend + frontend
├── README.md                      # Dokumentasi proyek & IDOR demo
├── .gitignore                     # Eksklusi git
└── (mungkin file lock seperti pnpm-lock.yaml / dll bila diperlukan)
```

## Getting Started

This guide will walk you through setting up and running the project on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/en/download/) (v20 or later)
-   [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/) (optional, for containerized setup)

### Setup dengan Docker

Cara termudah menjalankan proyek ini adalah menggunakan Docker, supaya ga repot install apa aja kalau laptop penuh atau apa.

1.  **Clone repository:**
    ```bash
    git clone [https://github.com/sleepingpolice-afk/KemjarIDOR.git](https://github.com/sleepingpolice-afk/KemjarIDOR.git)
    cd KemjarIDOR
    ```

2.  **Konfigurasi Environment:**
    Buat file `.env` di root folder, lalu isi dengan kredensial database NeonDB (Sudah diberikan ke Nelson):
    ```env
    # .env
    DATABASE_URL="postgresql://neondb_owner:PASSWORD_RAHASIA@ep-cool-cloud.aws.neon.tech/neondb?sslmode=require"
    ```

3.  **Run:**
    Buka terminal di root folder, lalu jalankan command docker:
    ```bash
    docker-compose up --build
    ```

    Tunggu sampai build selesai. Setelah itu, akses aplikasi di:
    - **Frontend:** http://localhost:3000
    - **Backend:** http://localhost:4000

### Setup manual kalau malas Docker

1.  **Setup Backend:**
    ```bash
    cd backend
    npm install
    # Buat file .env di dalam folder backend berisi DATABASE_URL
    npm run dev
    ```
    *(Catatan: Jangan jalankan migrate/seed)*

2.  **Setup Frontend:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## API Endpoints

The backend server runs on `http://localhost:4000`.

| Method | Endpoint| Description| Example (With Postman) |
| :-- | :-- | :-- | :-- |
| `POST` | `/auth/login`        | Login | ![picture 2](https://i.imgur.com/OhYXsSb.png)  |
| `POST` | `/auth/register`     | Buat user baru | ![picture 1](https://i.imgur.com/JO7hU1x.png)  |
| `GET`  | `/api/users/:id`     | Return user data berdasarkan ID mereka. Ini yang vulnerable ke IDOR karena tidak ada autentikasi tambahan untuk verifikasi request ini, jadi semua orang bisa request ke ini dan bisa membocorkan data orang | ![picture 0](https://i.imgur.com/q1WicEf.png) |

## IDOR Vulnerability

Endpoint `/api/users/:id` di backend sengaja dibuat rentan terhadap IDOR. Endpoint ini mengembalikan data user berdasarkan ID yang diberikan tanpa memeriksa apakah user yang melakukan request berhak mengakses data tersebut.

**Cara cek vulnerability:**
- Buka http://localhost:3000 dan coba register 2 account.
- Login sebagai User 1.
- Klik F12 dan bagian network, perhatikan URL API atau ID.
- Gunakan tools seperti Postman atau Burp Suite lalu ubah ID URL API ke ID User 2.
- Hasilnya, anda akan melihat data pribadi User 2 (Email, Alamat, No HP) meskipun sedang login sebagai User 1.

## Screenshots
- Dashboard setelah login  
  ![picture 3](https://i.imgur.com/V2i5Xr3.png)  

- Login 
    
    ![picture 4](https://i.imgur.com/ojIFoIb.png)  

- Register
    ![picture 5](https://i.imgur.com/VzLQG4W.png)  
