import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
          <Link href="/" className="text-xl font-bold">
            <span className="text-indigo-600">Target</span>
            <span className="text-purple-500">Trail</span>
            <span className="text-pink-500">Mailer</span>
          </Link>
            <p className="text-sm">
            </p>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold mb-2">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold mb-2">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold mb-2">Connect</h4>
            <div className="flex space-x-4">
              <Link href="https://x.com/tejasgiridev" target='_blank' className="hover:text-white transition-colors">Twitter</Link>
              <Link href="https://www.linkedin.com/in/tejas-giri" target='_blank' className="hover:text-white transition-colors">LinkedIn</Link>
              <Link href="https://github.com/tejasg910" target='_blank' className="hover:text-white transition-colors">GitHub</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Target Trail Mailer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}