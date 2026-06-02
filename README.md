# Portfolio Backend — Умаров Али

API сервер для лендинга: форма обратной связи и AI-интеграция.

**Бэкенд URL:** https://my-portfolio-server-r15h.onrender.com/  
**Фронт репо:** https://github.com/umarovali/my-portfolio

---

## Как запустить

\```bash
git clone https://github.com/umarovali/my-portfolio-server.git
cd my-portfolio-server
npm install
npm run dev
\```

Создай файл `.env`:
\```
RESEND*API_KEY=твой*ключ
OWNER*EMAIL=твой_email
GROQ_API_KEY=твой*ключ
PORT=3000
\```

\```bash
npm run dev
\```
Сервер запустится на `http://localhost:3000`

---

## Стек

- Node.js + Express.js
- TypeScript
- Resend — отправка писем
- Groq SDK — AI генерация (LLaMA 3.3)

---

## Структура проекта

\```
my-portfolio-server/
├── src/
│ ├── index.ts
│ ├── routes/
│ │ ├── contact.ts
│ │ └── ai.ts
│ └── services/
│ └── mailer.ts
├── .env
├── package.json
└── tsconfig.json
\```

---

## Роуты

| Метод | URL                  | Описание         |
| ----- | -------------------- | ---------------- |
| GET   | /                    | Health check     |
| POST  | /api/contact         | Отправка формы   |
| POST  | /api/ai/cover-letter | Генерация письма |
| POST  | /api/ai/chat         | AI чат           |

---

## Как реализована форма

- Принимает: имя, телефон, email, комментарий
- Валидация данных на сервере
- Два письма через Resend параллельно (Promise.all):
  - Владельцу сайта — с данными пользователя
  - Пользователю — копия с подтверждением

---

## AI-инструменты

**Groq API** с моделью `llama-3.3-70b-versatile`

**POST /api/ai/cover-letter** — принимает название вакансии, генерирует сопроводительное письмо на основе резюме разработчика

**POST /api/ai/chat** — принимает историю сообщений, отвечает от имени разработчика на основе системного промпта с резюме

---

## Что делалось с помощью ИИ

- Черновики роутов и middleware — AI давал основу, дорабатывалось вручную
- Системные промпты для AI роутов составлены совместно с AI

---

## Что исправлялось и делалось вручную

- Все API запросы писались вручную — логика fetch, обработка ответов, состояния; AI помогал с отдельными частями
- dotenv.config() перенесён в mailer.ts — переменные окружения не читались без явного вызова
- Смена AI провайдера: Anthropic → OpenAI → Groq (первые два оказались платными)
- Модель llama3-8b-8192 устарела — заменена на llama-3.3-70b-versatile вручную
- CORS настроен вручную после получения реального URL деплоя
- Обработка ошибок переведена на английский язык вручную
- Валидация данных на сервере написана вручную, AI помог с регулярными выражениями
