import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Phase P2: Squelette de l'automatisation WhatsApp Business API
// Ce webhook recevra les messages entrants (dépôts d'offres assistés) 
// et les statuts des alertes envoyées.

export async function GET(request: Request) {
  // Vérification du webhook par Meta/WhatsApp
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Traitement des messages entrants
    if (body.object === 'whatsapp_business_account') {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.value && change.value.messages) {
            for (const message of change.value.messages) {
              // TODO: Logique de parsing NLP ou menu interactif (ex: "Tapez 1 pour déposer une offre")
              console.log('Nouveau message WhatsApp:', message.text?.body, 'de', message.from)
            }
          }
        }
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Erreur webhook WhatsApp:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
