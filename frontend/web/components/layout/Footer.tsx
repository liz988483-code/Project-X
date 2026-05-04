import Link from 'next/link'
import { 
  ShoppingBag, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Shield,
  Truck
} from 'lucide-react'

export default function Footer() {
  const footerLinks = {
    Shop: [
      { label: 'All Products', href: '/products' },
      { label: 'New Arrivals', href: '/products/new' },
      { label: 'Best Sellers', href: '/products/best-sellers' },
      { label: 'Deals', href: '/deals' },
      { label: 'Gift Cards', href: '/gift-cards' },
    ],
    Categories: [
      { label: 'Electronics', href: '/category/electronics' },
      { label: 'Fashion', href: '/category/fashion' },
      { label: 'Home & Kitchen', href: '/category/home-kitchen' },
      { label: 'Sports & Fitness', href: '/category/sports-fitness' },
      { label: 'Beauty', href: '/category/beauty' },
    ],
    Help: [
      { label: 'FAQ', href: '/help/faq' },
      { label: 'Shipping', href: '/help/shipping' },
      { label: 'Returns', href: '/help/returns' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
    'Become a Seller': [
      { label: 'Seller Registration', href: '/sellers/register' },
      { label: 'Seller Dashboard', href: '/sellers/dashboard' },
      { label: 'Seller Fees', href: '/sellers/fees' },
      { label: 'Seller Support', href: '/sellers/support' },
      { label: 'Success Stories', href: '/sellers/stories' },
    ],
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-lg mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Middle Section - Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-900/20 rounded-lg">
              <Truck className="h-6 w-6 text-primary-400" />
            </div>
            <div>
              <h4 className="font-semibold">Free Shipping</h4>
              <p className="text-sm text-gray-400">On orders over $50</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-900/20 rounded-lg">
              <CreditCard className="h-6 w-6 text-primary-400" />
            </div>
            <div>
              <h4 className="font-semibold">Secure Payment</h4>
              <p className="text-sm text-gray-400">100% secure</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-900/20 rounded-lg">
              <Shield className="h-6 w-6 text-primary-400" />
            </div>
            <div>
              <h4 className="font-semibold">Quality Guarantee</h4>
              <p className="text-sm text-gray-400">30-day returns</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-900/20 rounded-lg">
              <Phone className="h-6 w-6 text-primary-400" />
            </div>
            <div>
              <h4 className="font-semibold">24/7 Support</h4>
              <p className="text-sm text-gray-400">Dedicated support</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo and Description */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary-600 flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">SOKO Marketplace</h2>
                  <p className="text-gray-400 text-sm">Your trusted online shopping destination</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>123 Market Street, City, Country</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>support@soko.com</span>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} SOKO Marketplace. All rights reserved.</p>
            <p className="mt-2">
              <Link href="/terms" className="hover:text-white">Terms of Service</Link>
              {' • '}
              <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
              {' • '}
              <Link href="/cookies" className="hover:text-white">Cookie Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}