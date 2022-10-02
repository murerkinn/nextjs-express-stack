import {
  AuthenticatedRequest,
  ensureAuthentication,
  ensureOrphans,
} from '@/lib/auth-strategies'
import { AsyncRouter } from 'express-async-router'
import passport from 'passport'

const router = AsyncRouter()

export default router
