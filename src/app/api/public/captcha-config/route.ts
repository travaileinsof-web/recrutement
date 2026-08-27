import { jsonOk } from '@/lib/errors'
import { isTurnstileEnabled, getTurnstileSiteKey } from '@/lib/captcha'

export const dynamic = 'force-dynamic'

// Public config endpoint — tells the browser whether CAPTCHA is required
// and exposes the Turnstile site key (safe to expose).
export async function GET() {
  return jsonOk({
    enabled: isTurnstileEnabled(),
    siteKey: getTurnstileSiteKey(),
  })
}
