import fs from 'fs/promises'
import path from 'path'
import handlebars from 'handlebars'
import { config } from '../../config'
import { logger } from '../../../../shared/utils/logger'

export type TemplateType = 
  | 'order_confirmation'
  | 'order_shipped'
  | 'order_delivered'
  | 'order_cancelled'
  | 'welcome'
  | 'password_reset'
  | 'payment_receipt'
  | 'review_request'
  | 'account_verification'
  | 'promotional'

export interface TemplateData {
  [key: string]: any
}

export class TemplateService {
  private templateCache: Map<string, HandlebarsTemplateDelegate> = new Map()

  async compileTemplate(templateName: TemplateType, data: TemplateData): Promise<string> {
    try {
      let template = this.templateCache.get(templateName)
      
      if (!template) {
        const templatePath = path.join(
          __dirname,
          `../../templates/${templateName}.hbs`
        )
        
        const templateContent = await fs.readFile(templatePath, 'utf-8')
        template = handlebars.compile(templateContent)
        this.templateCache.set(templateName, template)
      }

      return template(data)
    } catch (error) {
      logger.error(`Failed to compile template ${templateName}:`, error)
      throw error
    }
  }

  async getOrderConfirmationTemplate(order: any, user: any): Promise<string> {
    const data = {
      orderNumber: order.orderNumber,
      orderDate: order.createdAt.toLocaleDateString(),
      customerName: user.name,
      customerEmail: user.email,
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress || order.shippingAddress,
      items: order.items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price.toFixed(2),
        total: (item.price * item.quantity).toFixed(2)
      })),
      subtotal: order.subtotal.toFixed(2),
      shippingFee: order.shippingFee.toFixed(2),
      tax: order.tax.toFixed(2),
      total: order.total.toFixed(2),
      paymentMethod: order.paymentMethod,
      estimatedDelivery: order.estimatedDelivery 
        ? order.estimatedDelivery.toLocaleDateString()
        : '5-7 business days',
      supportEmail: config.support.email,
      supportPhone: config.support.phone,
      companyName: config.company.name,
      companyAddress: config.company.address,
      logoUrl: config.company.logoUrl,
      websiteUrl: config.company.websiteUrl
    }

    return this.compileTemplate('order_confirmation', data)
  }

  async getPasswordResetTemplate(user: any, resetUrl: string): Promise<string> {
    const data = {
      userName: user.name,
      resetUrl,
      expiryHours: 24,
      supportEmail: config.support.email,
      companyName: config.company.name,
      logoUrl: config.company.logoUrl
    }

    return this.compileTemplate('password_reset', data)
  }

  async getWelcomeTemplate(user: any): Promise<string> {
    const data = {
      userName: user.name,
      welcomeMessage: `Welcome to ${config.company.name}!`,
      dashboardUrl: `${config.company.websiteUrl}/dashboard`,
      supportEmail: config.support.email,
      companyName: config.company.name,
      logoUrl: config.company.logoUrl,
      features: [
        'Browse thousands of products',
        'Secure payment processing',
        'Fast shipping options',
        '24/7 customer support'
      ]
    }

    return this.compileTemplate('welcome', data)
  }

  async getReviewRequestTemplate(order: any, user: any, product: any): Promise<string> {
    const data = {
      userName: user.name,
      productName: product.name,
      productImage: product.images?.[0] || config.company.logoUrl,
      reviewUrl: `${config.company.websiteUrl}/products/${product.id}/review`,
      orderNumber: order.orderNumber,
      supportEmail: config.support.email,
      companyName: config.company.name,
      logoUrl: config.company.logoUrl
    }

    return this.compileTemplate('review_request', data)
  }
}