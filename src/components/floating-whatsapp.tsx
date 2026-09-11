'use client'

import { MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

export function FloatingWhatsApp() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <a
      href="https://wa.me/224620000000?text=Bonjour%2C%20je%20souhaite%20des%20renseignements"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-premium-lg transition-transform hover:scale-110 hover:shadow-premium-xl focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
      aria-label="Discuter sur WhatsApp"
    >
      <MessageCircle className="size-7" fill="currentColor" />
    </a>
  )
}
