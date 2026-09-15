import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const jobs = await prisma.job.findMany()
  for (const job of jobs) {
    let newDesc = job.description
    newDesc = newDesc.replace(/Ǹ/g, 'é')
    newDesc = newDesc.replace(/Ǧ/g, 'ê')
    newDesc = newDesc.replace(//g, 'é') // sometimes it's this character
    newDesc = newDesc.replace(/ a /g, ' à ') // just in case
    
    // Specifically fix known ones
    newDesc = newDesc.replace(/Ǹquipe/g, 'équipe')
    newDesc = newDesc.replace(/expǸrience avǸrǸe/g, 'expérience avérée')
    newDesc = newDesc.replace(/dǸcisions stratǸgiques/g, 'décisions stratégiques')
    newDesc = newDesc.replace(/opǸrations/g, 'opérations')
    newDesc = newDesc.replace(/pǸriodiques/g, 'périodiques')
    newDesc = newDesc.replace(/recherchǸ/g, 'recherché')
    newDesc = newDesc.replace(/rǸsistant/g, 'résistant')
    
    await prisma.job.update({
      where: { id: job.id },
      data: { description: newDesc }
    })
  }
  console.log('Descriptions fixed!')
}

main().finally(() => prisma.$disconnect())
