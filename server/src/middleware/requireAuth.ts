import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export type AuthedPayload = { role: string }

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- Express augmentation
  namespace Express {
    interface Request {
      admin?: AuthedPayload
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    res.status(500).json({ error: 'JWT_SECRET missing' })
    return
  }
  const hdr = req.headers.authorization
  if (!hdr?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  try {
    const token = hdr.slice('Bearer '.length).trim()
    const payload = jwt.verify(token, secret) as jwt.JwtPayload & AuthedPayload
    if (!payload.role) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
    req.admin = payload
    next()
  } catch {
    res.status(401).json({ error: 'Unauthorized' })
  }
}
