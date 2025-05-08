# 📘 Elimu-Online

**Elimu-Online** is a full-stack e-learning platform designed for students and teachers to access digital educational resources in a structured, curriculum-aligned format. It supports secure login, file uploads, categorized browsing, and integration with cloud storage.

---

## ✅ Project Requirements Met

- ✔ **Backend:** Flask + SQLAlchemy
- ✔ **Many-to-Many Relationship:** `users` ↔ `resources` via `user_resources`
- ✔ **Minimum 4 Models:** `User`, `Resource`, `Category`, `Purchase`, `Feedback`
- ✔ **Frontend Routes:** 5+ React-style routes using custom router logic
- ✔ **Full CRUD:** Admins can upload, list, rename, and delete resources
- ✔ **Validations:** Backend validation and error handling on all endpoints
- ✔ **Something New:** Google Cloud Storage integration + Email Reset via SMTP
- ✔ **State Management:** `localStorage` and `useContext` used for authentication/session control

---

## ✨ Key Features

- 🔐 User & Admin authentication with token-based security
- ☁️ Google Cloud Storage integration for file uploads
- 📂 Organized resource display by level, category, subject, and term
- 📤 Admin panel with upload, rename, delete, and categorize capabilities
- 🛒 Payment-ready structure for file access (M-Pesa, Paystack)
- 📧 Password reset via secure email token
- 📱 Fully responsive UI with TailwindCSS and Vanilla JS

---

## 🧰 Tech Stack

| Layer      | Tools Used                                             |
| ---------- | ------------------------------------------------------ |
| Frontend   | HTML, CSS, Tailwind, Vanilla JS, Vite                  |
| Backend    | Flask, SQLAlchemy, Flask-Migrate                       |
| Storage    | Google Cloud Storage (GCS)                             |
| Deployment | Cloudflare Pages (frontend), Render/Truehost (backend) |
| Auth       | JWT Tokens + Context                                   |
| Email      | SMTP (Gmail) via `smtplib`                             |

---

## 🚀 Getting Started

### 🖥️ Backend Setup (Flask)

```bash
cd server
pipenv install
pipenv shell
python run.py
```

- Backend will run on: `http://127.0.0.1:5555/`

### 🌐 Frontend Setup (Vite + Tailwind)

```bash
cd client
npm install
npm run dev
```

- Frontend will run on: `http://localhost:5173/`

---

## 🗂 Project Structure

```
Elimu-Online/
├── client/             # Frontend SPA
│   ├── index.html
│   ├── src/            # JS Components, Pages, Routers
│   └── public/images/
├── server/             # Backend (Flask API)
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── instance/       # SQLite DB & GCS credentials
│   └── run.py
├── .env
├── README.md
└── requirements.txt
```

---

## 📦 Database Models

- **User**: `id`, `full_name`, `email`, `password_hash`, `is_admin`
- **Resource**: `id`, `filename`, `file_url`, `subject`, `form_class`, `level`, `term`, `price`, `category_id`
- **Category**: `id`, `name`, `description`
- **Purchase**: Tracks who paid for what
- **Feedback**: User-submitted feedback with timestamps
- **user_resources**: Join table for downloads/purchases

---

## 🔐 Authentication

- Token-based login (JWT)
- Protected admin routes
- Reset password via emailed token link
- `localStorage` and custom `useContext` implementation

---

## 📤 Admin Functionalities

- Upload resources to GCS
- View, rename, or delete files
- Auto-detect resource categories/levels
- Add pricing for paid resources
- View usage and access stats (in progress)

---

## 🤝 Contributing

We welcome contributions!

```bash
git clone https://github.com/PaulMwaz/Elimu-Online.git
cd Elimu-Online
```

1. Create your feature branch (`git checkout -b feature/yourFeature`)
2. Commit your changes (`git commit -m 'add new feature'`)
3. Push to GitHub (`git push origin feature/yourFeature`)
4. Submit a Pull Request

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- Built with ❤️ at Moringa School, Phase 5
- Thanks to instructors, mentors, and testers
- Inspired by Kenya’s CBC & 8-4-4 learning needs

---

© 2025 Elimu-Online — Empowering learners, one file at a time.

👨‍💻 Author: Paul Kyalo
