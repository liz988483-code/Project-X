import Stripe from 'stripe'
import { config } from '../config'
import { PaymentModel } from '../models/payment.model'
import { logger } from '../../../shared/utils/logger'
import { MessageBroker } from '../../../message-broker'

export class StripeService {
  private stripe: Stripe

  constructor() {
    this.stripe = new Stripe(config.stripe.secretKey, {
      apiVersion: '2023-10-16',
      typescript: true,
    })
  }

  async createPaymentIntent(options: {
    amount: number
    currency: string
    customerEmail?: string
    customerId?: string
    orderId: string
    metadata?: Record<string, any>
  }) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(options.amount * 100), // Convert to cents
        currency: options.currency,
        customer: options.customerId,
        receipt_email: options.customerEmail,
        metadata: {
          orderId: options.orderId,
          ...options.metadata
        },
        automatic_payment_methods: {
          enabled: true,
        },
      })

      // Save payment record
      await PaymentModel.create({
        orderId: options.orderId,
        paymentIntentId: paymentIntent.id,
        amount: options.amount,
        currency: options.currency,
        status: 'pending',
        paymentMethod: 'stripe',
        metadata: {
          clientSecret: paymentIntent.client_secret,
          customerEmail: options.customerEmail
        }
      })

      return {
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status
      }
    } catch (error) {
      logger.error('Failed to create payment intent:', error)
      throw error
    }
  }

  async handleWebhook(event: Stripe.Event) {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent)
          break
        
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent)
          break
        
        case 'charge.refunded':
          await this.handleRefund(event.data.object as Stripe.Charge)
          break
        
        case 'charge.dispute.created':
          await this.handleDispute(event.data.object as Stripe.Dispute)
          break
      }

      logger.info('Stripe webhook processed:', { type: event.type })
    } catch (error) {
      logger.error('Failed to process Stripe webhook:', error)
      throw error
    }
  }
    handlePaymentFailure(arg0: Stripe.PaymentIntent) {
        throw new Error('Method not implemented.')
    }
    handleRefund(arg0: Stripe.Charge) {
        throw new Error('Method not implemented.')
    }
    handleDispute(arg0: Stripe.Dispute) {
        throw new Error('Method not implemented.')
    }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata?.orderId
    
    if (!orderId) {
      throw new Error('Order ID missing from payment intent metadata')
    }

    // Update payment record
    await PaymentModel.findOneAndUpdate(
      { paymentIntentId: paymentIntent.id },
      {
        $set: {
          status: 'completed',
          completedAt: new Date(),
          transactionId: paymentIntent.charges?.data[0]?.id,
          metadata: {
            ...paymentIntent.metadata,
            stripeCustomer: paymentIntent.customer
          }
        }
      }
    )

    // Publish payment success event
    await MessageBroker.publish('payment_events', {
      type: 'payment_succeeded',
      data: {
        orderId,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        timestamp: new Date()
      }
    })
  }

  async createCustomer(options: {
    email: string
    name?: string
    phone?: string
    metadata?: Record<string, any>
  }) {
    try {
      const customer = await this.stripe.customers.create({
        email: options.email,
        name: options.name,
        phone: options.phone,
        metadata: options.metadata
      })

      return customer
    } catch (error) {
      logger.error('Failed to create Stripe customer:', error)
      throw error
    }
  }

  async createRefund(options: {
    paymentIntentId: string
    amount?: number
    reason?: string
    metadata?: Record<string, any>
  }) {
    try {
      const payment = await PaymentModel.findOne({ paymentIntentId: options.paymentIntentId })
      
      if (!payment) {
        throw new Error('Payment not found')
      }

      const refund = await this.stripe.refunds.create({
        payment_intent: options.paymentIntentId,
        amount: options.amount ? Math.round(options.amount * 100) : undefined,
        reason: options.reason as any,
        metadata: options.metadata
      })

      // Update payment record
      payment.refundId = refund.id
      payment.refundAmount = options.amount || payment.amount
      payment.refundReason = options.reason
      payment.refundedAt = new Date()
      payment.status = 'refunded'
      await payment.save()

      // Publish refund event
      await MessageBroker.publish('payment_events', {
        type: 'refund_processed',
        data: {
          paymentIntentId: options.paymentIntentId,
          refundId: refund.id,
          amount: refund.amount / 100,
          reason: refund.reason,
          timestamp: new Date()
        }
      })

      return refund
    } catch (error) {
      logger.error('Failed to create refund:', error)
      throw error
    }
  }

  async getPaymentMethods(customerId: string) {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: 'card'
      })

      return paymentMethods.data.map(method => ({
        id: method.id,
        type: method.type,
        card: method.card ? {
          brand: method.card.brand,
          last4: method.card.last4,
          expMonth: method.card.exp_month,
          expYear: method.card.exp_year
        } : null,
        created: method.created
      }))
    } catch (error) {
      logger.error('Failed to get payment methods:', error)
      throw error
    }
  }
}