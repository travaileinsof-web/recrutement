import { Mail, MapPin, Phone, Clock } from 'lucide-react'
import { ProsePage } from '@/components/prose-page'
import { ContactForm } from '@/components/contact-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = { title: 'Contact' }

export default function ContactPage() {
  return (
    <ProsePage
      title="Contactez-nous"
      description="Une question, une demande, une suggestion ? Notre équipe vous répond sous 48h ouvrées."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">Nos coordonnées</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                <span className="font-medium">E-mail</span>
                <br />
                <a href="mailto:contact@talentforge.local" className="text-primary hover:underline">
                  contact@talentforge.local
                </a>
              </span>
            </p>
            <p className="flex items-start gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                <span className="font-medium">Téléphone</span>
                <br />
                +33 1 84 80 00 00
              </span>
            </p>
            <p className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                <span className="font-medium">Adresse</span>
                <br />
                12 rue de l’Innovation
                <br />
                75011 Paris, France
              </span>
            </p>
            <p className="flex items-start gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                <span className="font-medium">Horaires</span>
                <br />
                Du lundi au vendredi, 9h – 18h
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">Envoyer un message</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>
      </div>

      <p className="mt-6">
        Pour toute question relative au suivi d’une candidature, nous vous
        invitons à utiliser directement votre lien de suivi privé reçu par
        e-mail après votre dépôt. Vous pouvez aussi demander un nouveau lien
        depuis la page{' '}
        <a href="/suivi-candidature" className="text-primary hover:underline">
          suivi de candidature
        </a>
        .
      </p>
    </ProsePage>
  )
}
