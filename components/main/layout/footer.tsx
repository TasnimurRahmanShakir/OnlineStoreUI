import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-200 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & Newsletter */}
          <div className="space-y-6">
            <Image src="/logo1.png" alt="Logo" width={250} height={150} style={{ width: "auto", height: "auto" }} />
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium quality products for your lifestyle. We curate the best
              items to enhance your everyday experience.
            </p>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white">
                Subscribe to our newsletter
              </h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-gray-600"
                />
                <Button variant="secondary">Subscribe</Button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Shop</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <Link
                  href="/store"
                  className="hover:text-white transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/new-arrivals"
                  className="hover:text-white transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/best-sellers"
                  className="hover:text-white transition-colors"
                >
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="hover:text-white transition-colors"
                >
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <Link
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-500 shrink-0" />
                <span>123 Commerce St, Market City, ST 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-500 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-500 shrink-0" />
                <span>support@kimzonestore.com</span>
              </li>
            </ul>

            {/* Socials */}
            <div className="flex gap-4 mt-6">
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-800 mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-gray-900 border-t border-gray-800 pt-8 gap-4 text-sm text-gray-500">
          <p>© {currentYear} Kim Zone Store. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Developed by</span>
            <Link
              href="https://jolforing.com" // Assuming this might be a link, or just text
              className="font-medium text-gray-300 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Jolforing
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
