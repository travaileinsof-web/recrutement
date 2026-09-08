import { db } from '../src/lib/db'
import { generateApplicationRef } from '../src/lib/references'

async function main() {
  const jobId = process.argv[2]
  const companyId = process.argv[3]
  if (!jobId || !companyId) {
    console.error('Usage: bun run scripts/seed-activity.ts <jobId> <companyId>')
    process.exit(1)
  }

  const names = [
    'Aminata Traoré', 'Kwame Mensah', 'Fatou Ndiaye', 'Ibrahim Sow',
    'Awa Cissé', 'Mamadou Diallo', 'Bineta Sarr', 'Ousmane Ba',
    'Aïssatou Barry', 'Modou Kane'
  ]

  for (let i = 0; i < names.length; i++) {
    const daysAgo = (i % 6) + 1
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    date.setHours((i * 3) % 24)

    const ref = await generateApplicationRef()
    await db.application.create({
      data: {
        publicReference: ref,
        jobId,
        companyId,
        candidateName: names[i],
        candidateEmail: `${names[i].toLowerCase().replace(/[^a-z]/g, '.')}@example.fr`,
        candidatePhone: '+33600000000',
        candidateCity: 'Paris',
        coverLetter: 'Candidature spontanée.',
        answers: '{}',
        status: 'SUBMITTED',
        consentAccepted: true,
        consentVersion: '1.0.0',
        idempotencyKey: `seed-act-${i}-${Date.now()}`,
        submittedAt: date,
      },
    })
    console.log(`  ${names[i]} -> ${daysAgo}d ago`)
  }
  await db.$disconnect()
}

main().catch(console.error)
