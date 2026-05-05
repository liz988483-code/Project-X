import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Review list placeholder',
    reviews: []
  })
})

router.post('/', (req, res) => {
  res.json({
    success: true,
    message: 'Create review placeholder',
    review: req.body
  })
})

export default router
