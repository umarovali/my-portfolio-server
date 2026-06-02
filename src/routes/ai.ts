import { Router, Request, Response } from "express";
import Groq from "groq-sdk";

const router = Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MY_RESUME = `
Имя: Умаров Али Бахтиярович
Возраст: 18 лет
Город: Ош, Кыргызстан
Email: umarovali.345@gmail.com

Специализация: Frontend Developer (с опытом в Backend)

Frontend стек:
- React, Next.js, TypeScript, JavaScript
- HTML, CSS, SCSS/Sass
- Tailwind CSS, Bootstrap, MUI, Ant Design, Styled Components
- Vite

Backend стек:
- Node.js, Express.js, NestJS
- MongoDB, PostgreSQL
- Swagger
- Python, Django, DRF

Проекты:
1. Barber Shop KG — React приложение с корзиной, фильтрацией, поиском и бронированием. Чистый React + SCSS.
2. BBK CRM System — командная разработка CRM системы для компании BBK. Автоматизация процессов.
3. Techno Shop — pixel perfect вёрстка интернет-магазина на чистом HTML/CSS.

Подход к работе:
- Пишу чистый, читаемый код
- Активно использую AI инструменты для ускорения разработки
- Умею работать в команде и самостоятельно
- Выстраиваю проект с нуля до деплоя
`;

// POST cover letter

router.post("/cover-letter", async (req: Request, res: Response) => {
  const { vacancy } = req.body;

  if (!vacancy || vacancy.trim().length < 3) {
    res
      .status(400)
      .json({ success: false, message: "Vacancy name is required" });
    return;
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024,
      messages: [
        {
          role: "system",
          content: `Ты — Умаров Али, Frontend разработчик. Вот информация обо мне: ${MY_RESUME}`,
        },
        {
          role: "user",
          content: `Напиши сопроводительное письмо на вакансию "${vacancy}". 
          Требования:
          - От первого лица (я, мне, мой)
          - Коротко и по делу (3-4 абзаца)
          - Покажи релевантный опыт под эту вакансию
          - Живой тон, не шаблонный
          - На русском языке`,
        },
      ],
    });

    const text = completion.choices[0].message.content || "";
    res.status(200).json({ success: true, text });
  } catch (err) {
    console.error("Groq error:", err);
    res.status(500).json({ success: false, message: "Generation failed" });
  }
});

// POST chat

router.post("/chat", async (req: Request, res: Response) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ success: false, message: "Messages are required" });
    return;
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 512,
      messages: [
        {
          role: "system",
          content: `Ты — Умаров Али, Frontend разработчик. Отвечай на вопросы о себе от первого лица, коротко и по делу. Вот информация обо мне: ${MY_RESUME}. 
          
          Правила:
          - Отвечай только на вопросы связанные с работой, опытом, стеком
          - Если спрашивают не по теме — вежливо переводи на тему разработки
          - Отвечай на том языке на котором спрашивают
          - Максимум 3-4 предложения`,
        },
        ...messages,
      ],
    });

    const text = completion.choices[0].message.content || "";
    res.status(200).json({ success: true, text });
  } catch (err) {
    console.error("Groq chat error:", err);
    res.status(500).json({ success: false, message: "Chat failed" });
  }
});

export { router as aiRouter };
