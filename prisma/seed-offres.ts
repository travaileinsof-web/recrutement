import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database with companies and jobs...')

  // 1. Create Companies
  const companiesData = [
    {
      publicReference: 'COMP-001',
      legalName: 'Banque Atlantique Guinée',
      tradeName: 'Banque Atlantique',
      email: 'rh@banqueatlantique.gn',
      city: 'Conakry',
      country: 'Guinée',
      sector: 'Banque & Finance',
      isVerified: true,
    },
    {
      publicReference: 'COMP-002',
      legalName: 'PwC Guinée',
      tradeName: 'PwC',
      email: 'recrutement@pwc.gn',
      city: 'Conakry',
      country: 'Guinée',
      sector: 'Audit & Conseil',
      isVerified: true,
    },
    {
      publicReference: 'COMP-003',
      legalName: 'Orange Finances Mobiles Guinée',
      tradeName: 'Orange Money',
      email: 'talents@orange.gn',
      city: 'Conakry',
      country: 'Guinée',
      sector: 'Fintech',
      isVerified: true,
    },
    {
      publicReference: 'COMP-004',
      legalName: 'Société Minière de Boké',
      tradeName: 'SMB',
      email: 'recrutement@smb.gn',
      city: 'Boké',
      country: 'Guinée',
      sector: 'Mines',
      isVerified: true,
    },
    {
      publicReference: 'COMP-005',
      legalName: 'Cabinet Sylla & Partenaires',
      tradeName: 'Cabinet Sylla',
      email: 'contact@sylla-partenaires.gn',
      city: 'Conakry',
      country: 'Guinée',
      sector: 'Expertise Comptable',
      isVerified: false,
    }
  ]

  const companies = []
  for (const c of companiesData) {
    const comp = await prisma.company.upsert({
      where: { publicReference: c.publicReference },
      update: {},
      create: c,
    })
    companies.push(comp)
  }

  // 2. Create Jobs
  const categories = ['Comptabilité', 'Direction', 'RH & Paie', 'Expertise comptable/Audit', 'Contrôle de gestion']
  const contractTypes = ['CDI', 'CDD', 'Intérim', 'Consultant']
  const experienceLevels = ['Junior (0-2 ans)', 'Intermédiaire (3-5 ans)', 'Senior (5-10 ans)', 'Expert (10+ ans)']

  // Generating 30 real-sounding jobs
  const jobsData = [
    { title: 'Directeur Financier (DAF)', cat: 'Direction', exp: 'Expert (10+ ans)', companyIdx: 0, salary: 'Négociable' },
    { title: 'Chef Comptable', cat: 'Comptabilité', exp: 'Senior (5-10 ans)', companyIdx: 3, salary: '15M - 20M GNF' },
    { title: 'Auditeur Senior', cat: 'Expertise comptable/Audit', exp: 'Senior (5-10 ans)', companyIdx: 1, salary: 'A débattre' },
    { title: 'Contrôleur de Gestion Industriel', cat: 'Contrôle de gestion', exp: 'Intermédiaire (3-5 ans)', companyIdx: 3, salary: '10M - 15M GNF' },
    { title: 'Responsable RH & Paie', cat: 'RH & Paie', exp: 'Senior (5-10 ans)', companyIdx: 2, salary: '12M - 18M GNF' },
    { title: 'Comptable Fournisseurs', cat: 'Comptabilité', exp: 'Junior (0-2 ans)', companyIdx: 0, salary: '4M - 6M GNF' },
    { title: 'Manager Audit Financier', cat: 'Expertise comptable/Audit', exp: 'Senior (5-10 ans)', companyIdx: 1, salary: 'Négociable' },
    { title: 'Analyste Financier', cat: 'Direction', exp: 'Intermédiaire (3-5 ans)', companyIdx: 2, salary: '8M - 12M GNF' },
    { title: 'Chargé de Paie', cat: 'RH & Paie', exp: 'Intermédiaire (3-5 ans)', companyIdx: 4, salary: '5M - 8M GNF' },
    { title: 'Comptable Unique', cat: 'Comptabilité', exp: 'Intermédiaire (3-5 ans)', companyIdx: 4, salary: '6M - 10M GNF' },
    
    { title: 'Directeur de l\'Audit Interne', cat: 'Expertise comptable/Audit', exp: 'Expert (10+ ans)', companyIdx: 0, salary: 'Négociable' },
    { title: 'Contrôleur Financier', cat: 'Contrôle de gestion', exp: 'Senior (5-10 ans)', companyIdx: 3, salary: '15M - 22M GNF' },
    { title: 'Trésorier d\'Entreprise', cat: 'Direction', exp: 'Intermédiaire (3-5 ans)', companyIdx: 0, salary: '10M - 15M GNF' },
    { title: 'Assistant(e) Ressources Humaines', cat: 'RH & Paie', exp: 'Junior (0-2 ans)', companyIdx: 3, salary: '3M - 5M GNF' },
    { title: 'Expert-Comptable Mémorialiste', cat: 'Expertise comptable/Audit', exp: 'Intermédiaire (3-5 ans)', companyIdx: 1, salary: 'A débattre' },
    { title: 'Comptable Clients et Recouvrement', cat: 'Comptabilité', exp: 'Intermédiaire (3-5 ans)', companyIdx: 2, salary: '5M - 8M GNF' },
    { title: 'Business Analyst', cat: 'Contrôle de gestion', exp: 'Intermédiaire (3-5 ans)', companyIdx: 2, salary: '9M - 14M GNF' },
    { title: 'Directeur des Ressources Humaines (DRH)', cat: 'RH & Paie', exp: 'Expert (10+ ans)', companyIdx: 3, salary: 'Négociable' },
    { title: 'Assistant Comptable', cat: 'Comptabilité', exp: 'Junior (0-2 ans)', companyIdx: 4, salary: '2.5M - 4M GNF' },
    { title: 'Chef de Mission Audit', cat: 'Expertise comptable/Audit', exp: 'Senior (5-10 ans)', companyIdx: 1, salary: 'Négociable' },
    
    { title: 'Responsable Consolidation', cat: 'Direction', exp: 'Senior (5-10 ans)', companyIdx: 0, salary: '20M - 25M GNF' },
    { title: 'Contrôleur de Gestion Commercial', cat: 'Contrôle de gestion', exp: 'Intermédiaire (3-5 ans)', companyIdx: 2, salary: '8M - 12M GNF' },
    { title: 'Gestionnaire de Paie Confirmé', cat: 'RH & Paie', exp: 'Senior (5-10 ans)', companyIdx: 0, salary: '7M - 11M GNF' },
    { title: 'Réviseur Comptable', cat: 'Comptabilité', exp: 'Intermédiaire (3-5 ans)', companyIdx: 4, salary: '6M - 9M GNF' },
    { title: 'Directeur Administratif et Financier (PME)', cat: 'Direction', exp: 'Senior (5-10 ans)', companyIdx: 4, salary: '15M - 20M GNF' },
    { title: 'Auditeur IT (Systèmes d\'Information)', cat: 'Expertise comptable/Audit', exp: 'Intermédiaire (3-5 ans)', companyIdx: 1, salary: '12M - 16M GNF' },
    { title: 'Chargé d\'Administration du Personnel', cat: 'RH & Paie', exp: 'Junior (0-2 ans)', companyIdx: 2, salary: '4M - 7M GNF' },
    { title: 'Data Analyst / Contrôleur de Gestion', cat: 'Contrôle de gestion', exp: 'Intermédiaire (3-5 ans)', companyIdx: 0, salary: '10M - 15M GNF' },
    { title: 'Fiscaliste d\'Entreprise', cat: 'Direction', exp: 'Senior (5-10 ans)', companyIdx: 1, salary: '18M - 25M GNF' },
    { title: 'Comptable Général', cat: 'Comptabilité', exp: 'Intermédiaire (3-5 ans)', companyIdx: 3, salary: '8M - 12M GNF' },
  ]

  for (let i = 0; i < jobsData.length; i++) {
    const jd = jobsData[i]
    const slug = `${jd.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i + 1}`
    const pubRef = `JOB-${new Date().getFullYear()}-${String(i + 1).padStart(3, '0')}`
    
    await prisma.job.upsert({
      where: { slug },
      update: {},
      create: {
        publicReference: pubRef,
        slug,
        title: jd.title,
        companyId: companies[jd.companyIdx].id,
        description: `<h2>Description du poste</h2><p>Nous recherchons un(e) <strong>${jd.title}</strong> pour rejoindre notre Ǹquipe dynamique  ${companies[jd.companyIdx].city}.</p><h3>Missions principales :</h3><ul><li>Supervision des opǸrations financires.</li><li>Production de rapports pǸriodiques.</li><li>Participation active aux dǸcisions stratǸgiques.</li></ul><h3>Profil recherchǸ :</h3><p>Vous avez une expǸrience avǸrǸe en <strong>${jd.cat}</strong>. Vous Ǧtes rigoureux(se), autonome et rǸsistant(e) au stress.</p>`,
        location: companies[jd.companyIdx].city,
        country: 'Guinée',
        contractType: contractTypes[i % contractTypes.length],
        experienceLevel: jd.exp,
        salaryText: jd.salary,
        skills: ['Rigueur', 'Analyse', 'Pack Office', 'Communication'],
        category: jd.cat,
        status: 'PUBLISHED',
        publishedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)), // Random date in the past
        isFeatured: i % 5 === 0, // Make some featured
      }
    })
  }

  console.log('Seeding completed successfully: 5 Companies, 30 Jobs.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
