import dotenv from "dotenv";
dotenv.config();
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const OWNER_EMAIL = process.env.OWNER_EMAIL!;

interface MailData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export async function sendOwnerEmail(data: MailData): Promise<void> {
 const result  = await resend.emails.send({
    from: "Portfolio <delivered@resend.dev>",
    to: OWNER_EMAIL,
    subject: `Новое сообщение от ${data.name}`,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="color: #e8ff47; background: #0a0a0a; padding: 24px; border-radius: 8px 8px 0 0; margin: 0;">
          Новое сообщение с сайта
        </h2>
        <div style="background: #111; padding: 24px; border-radius: 0 0 8px 8px; color: #fff;">
          <p><strong style="color:#888">Имя:</strong> ${data.name}</p>
          <p><strong style="color:#888">Телефон:</strong> ${data.phone}</p>
          <p><strong style="color:#888">Email:</strong> ${data.email}</p>
          <p><strong style="color:#888">Сообщение:</strong></p>
          <p style="background:#1a1a1a; padding:16px; border-radius:6px; color:#ccc;">
            ${data.message}
          </p>
        </div>
      </div>
    `,
  });
console.log('Resend owner result:', result)

}

export async function sendUserEmail(data: MailData): Promise<void> {
  await resend.emails.send({
    from: "Умаров Али <onboarding@resend.dev>",
    to: data.email,
    subject: "Ваше сообщение получено",
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="color: #e8ff47; background: #0a0a0a; padding: 24px; border-radius: 8px 8px 0 0; margin: 0;">
          Сообщение получено!
        </h2>
        <div style="background: #111; padding: 24px; border-radius: 0 0 8px 8px; color: #ccc;">
          <p>Привет, <strong style="color:#fff">${data.name}</strong>!</p>
          <p>Я получил ваше сообщение и отвечу в течение дня.</p>
          <hr style="border-color:#222; margin: 20px 0;" />
          <p style="color:#888; font-size:13px;">Ваше сообщение:</p>
          <p style="background:#1a1a1a; padding:16px; border-radius:6px;">
            ${data.message}
          </p>
          <hr style="border-color:#222; margin: 20px 0;" />
          <p style="color:#888; font-size:13px;">
            С уважением,<br/>
            <strong style="color:#fff">Умаров Али</strong> — Frontend Developer<br/>
            Ош, Кыргызстан
          </p>
        </div>
      </div>
    `,
  });
}
