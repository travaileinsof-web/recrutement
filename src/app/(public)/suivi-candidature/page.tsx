import Link from 'next/link'
import { ArrowLeft, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResendLinkForm } from '@/components/resend-link-form'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Suivi de candidature',
}

export default function TrackingLandingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-lg">
              <Eye className="size-5 text-primary" />
              Suivre ma candidature
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Pour consulter votre candidature, utilisez le lien qui vous a été
              envoyé par e-mail après votre dépôt. Si vous l’avez égaré, vous
              pouvez en demander un nouveau ci-dessous en indiquant votre e-mail
              et la référence reçue (au format <span className="font-mono">APP-XXXX-XXXX</span>).
            </p>
            <ResendLinkForm />
          </CardContent>
        </Card>
        <div className="mt-4 text-center">
          <Button asChild variant="ghost">
            <Link href="/offres">
              <ArrowLeft className="size-4" />
              Retour aux offres
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
