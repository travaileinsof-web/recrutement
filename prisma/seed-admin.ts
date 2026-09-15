import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/tokens'

const prisma = new PrismaClient()

async function main() {
  let admin = await prisma.adminUser.findUnique({
    where: { email: 'admin@talentforge.gn' }
  })
  
  if (!admin) {
    console.log('Admin not found, creating...')
    const { hash, salt } = hashPassword('Admin123!')
    admin = await prisma.adminUser.create({
      data: {
        email: 'admin@talentforge.gn',
        passwordHash: `${salt}:${hash}`,
        fullName: 'Administrateur TalentForge',
        role: 'SUPER_ADMIN',
        isActive: true,
      }
    })
    console.log('Admin user created successfully!')
  } else {
    console.log('Admin user already exists.')
    const { hash, salt } = hashPassword('Admin123!')
    await prisma.adminUser.update({
      where: { email: 'admin@talentforge.gn' },
      data: { passwordHash: `${salt}:${hash}` }
    })
    console.log('Admin password reset to Admin123!')
  }
}

async function retry() {
  for (let i = 0; i < 5; i++) {
    try {
      await main()
      return
    } catch (e) {
      console.log('Retrying in 5 seconds...', e)
      await new Promise(r => setTimeout(r, 5000))
    }
  }
}

retry().finally(() => prisma.$disconnect())
