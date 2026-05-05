import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Product list placeholder',
    products: []
  })
})

router.get('/:id', (req, res) => {
  res.json({
    success: true,
    message: `Product details for ${req.params.id}`,
    product: null
  })
})

export default router
