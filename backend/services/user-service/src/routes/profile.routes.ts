// @ts-nocheck
import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'User profile route is working'
  })
})

export default router

