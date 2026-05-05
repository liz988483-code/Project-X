import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Category list placeholder',
    categories: []
  })
})

router.get('/:slug', (req, res) => {
  res.json({
    success: true,
    message: `Category details for ${req.params.slug}`,
    category: null
  })
})

export default router
