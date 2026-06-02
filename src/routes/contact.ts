import { Router, Request, Response } from 'express'
import { sendOwnerEmail, sendUserEmail } from '../services/mailer'

export const contactRouter = Router()

interface ContactBody {
  name: string
  phone: string
  email: string
  message: string
}

function validate(body: ContactBody): string | null {
  if (!body.name || body.name.trim().length < 2)
    return 'Invalid name'
  if (!body.phone || !/^\+?[\d\s\-()]{7,}$/.test(body.phone.trim()))
    return 'Invalid phone number'
  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim()))
    return 'Invalid email'
  if (!body.message || body.message.trim().length < 5)
    return 'Message is too short'
  return null
}

contactRouter.post('/contact', async (req: Request, res: Response) => {
  const body = req.body as ContactBody

  const error = validate(body)
  if (error) {
    res.status(400).json({ success: false, message: error })
    return
  }

  try {
    await Promise.all([
      sendOwnerEmail(body),
      sendUserEmail(body),
    ])
    res.status(200).json({ success: true, message: 'Emails sent successfully' })
  } catch (err) {
    console.error('Mailer error:', err)
    res.status(500).json({ success: false, message: 'Failed to send email' })
  }
})