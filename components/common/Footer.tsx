import { Facebook, Instagram, Mail, Phone, X, Youtube } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className=" text-textPrimary font-body">

            {/* Footer Links */}
            <div className="max-w-[1300px] mx-auto px-4 pb-10 text-sm">
                <div className="flex flex-col md:flex-row justify-between gap-10 border-b border-gray-300 pb-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <h3 className="font-heading text-xl tracking-wide">SCENTORA</h3>
                        <p className="text-textSecondary">
                            Timeless Scents, Lasting Impressions
                        </p>

                        <div className="flex gap-3 mt-4">
                            <Link
                                href="tel:+96500000000"
                                className="flex items-center gap-2 border border-textPrimary rounded-full px-4 py-2 hover:bg-black hover:text-white transition"
                            >
                                <Phone className="w-4 h-4" />
                                Call
                            </Link>
                            <Link
                                href="mailto:support@scentora.com"
                                className="flex items-center gap-2 border border-textPrimary rounded-full px-4 py-2 hover:bg-black hover:text-white transition"
                            >
                                <Mail className="w-4 h-4" />
                                Email
                            </Link>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
                        <div>
                            <h4 className="font-semibold mb-3">Shop</h4>
                            <ul className="space-y-2 text-textSecondary">
                                <li>New Arrivals</li>
                                <li>Bestsellers</li>
                                <li>Collections</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-3">About Us</h4>
                            <ul className="space-y-2 text-textSecondary">
                                <li>
                                    <Link href="/about" className="hover:opacity-70">Our Story</Link>
                                </li>
                                <li>Sustainability</li>
                                <li>Ingredients</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-3">Customer Care</h4>
                            <ul className="space-y-2 text-textSecondary">
                                <li>
                                    <Link href="/faqs" className="hover:opacity-70">FAQ&apos;s</Link>
                                </li>
                                <li>
                                    <Link href="/shipping-returns" className="hover:opacity-70">Shipping & Returns</Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="hover:opacity-70">Contact Us</Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Social Icons */}
                    <div className="flex md:flex-col items-center md:items-end gap-3">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full border border-textPrimary flex items-center justify-center hover:bg-black hover:text-white transition">
                                <Facebook size={18} />
                            </div>
                            <div className="w-10 h-10 rounded-full border border-textPrimary flex items-center justify-center hover:bg-black hover:text-white transition">
                                <X size={18} />
                            </div>
                            <div className="w-10 h-10 rounded-full border border-textPrimary flex items-center justify-center hover:bg-black hover:text-white transition">
                                <Youtube size={18} />
                            </div>
                            <div className="w-10 h-10 rounded-full border border-textPrimary flex items-center justify-center hover:bg-black hover:text-white transition">
                                <Instagram size={18} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 text-xs text-textSecondary">
                    <p>© 2025 Scentora. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/terms" className="hover:opacity-70">Terms of Service</Link>
                        <Link href="/privacy" className="hover:opacity-70">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
