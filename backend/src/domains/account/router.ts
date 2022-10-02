import {
  AuthenticatedRequest,
  ensureAuthentication,
  ensureOrphans,
} from '@/lib/auth-strategies'
import { AsyncRouter } from 'express-async-router'
import passport from 'passport'

const router = AsyncRouter()

router.get('/', ensureAuthentication, (req: AuthenticatedRequest) => {
  return req.user
})

router.post(
  '/session',
  ensureOrphans,
  passport.authenticate('local', { failWithError: true }),
  (req: AuthenticatedRequest) => {
    return req.user
  }
)

router.delete('/session', ensureAuthentication, req => {
  req.logout({}, err => {
    if (err) throw err

    return { success: true }
  })
})

export default router
