// Seed script — run with: bun run scripts/seed.ts
// Creates a demo admin + 6 published jobs across different sectors.

import { db } from '../src/lib/db'
import { hashPassword } from '../src/lib/tokens'
import { generateCompanyRef, generateJobRef, generateSubmissionRef, generateApplicationRef, slugify } from '../src/lib/references'
import { ensureDefaultSettings } from '../src/lib/settings'

async function main() {
  console.log('→ Seeding database...')

  // 1. Default settings
  await ensureDefaultSettings()

  // 2. Demo admin
  const adminEmail = 'admin@talentforge.local'
  let admin = await db.adminUser.findUnique({ where: { email: adminEmail } })
  if (!admin) {
    const { hash, salt } = hashPassword('admin12345')
    admin = await db.adminUser.create({
      data: {
        email: adminEmail,
        fullName: 'Admin Démonstration',
        role: 'ADMIN',
        isActive: true,
        passwordHash: `${salt}:${hash}`,
      },
    })
    console.log(`  ✓ Created admin: ${adminEmail} / admin12345`)
  } else {
    console.log(`  • Admin already exists: ${adminEmail}`)
  }

  // 3. Demo companies
  const companiesData = [
    {
      legalName: 'Acme Robotics',
      tradeName: 'Acme',
      email: 'rh@acme-robotics.fr',
      phone: '+33145678900',
      website: 'https://acme-robotics.fr',
      sector: 'Robotique',
      city: 'Paris',
      country: 'France',
      address: '12 rue de l\'Innovation, 75011 Paris',
    },
    {
      legalName: 'GreenLeaf Energy',
      email: 'contact@greenleaf-energy.fr',
      phone: '+33456789012',
      website: 'https://greenleaf-energy.fr',
      sector: 'Énergie renouvelable',
      city: 'Lyon',
      country: 'France',
      address: '5 avenue de l\'Écologie, 69007 Lyon',
    },
    {
      legalName: 'Studio Nord Design',
      email: 'jobs@studio-nord.design',
      phone: '+33234567890',
      website: 'https://studio-nord.design',
      sector: 'Design & Création',
      city: 'Nantes',
      country: 'France',
      address: '8 place du Commerce, 44000 Nantes',
    },
    {
      legalName: 'HealthTech Solutions',
      email: 'carriere@healthtech.io',
      phone: '+33567890123',
      website: 'https://healthtech.io',
      sector: 'Santé numérique',
      city: 'Bordeaux',
      country: 'France',
      address: '22 cours de l\'Industrie, 33000 Bordeaux',
    },
  ]

  const companies = []
  for (const c of companiesData) {
    const ref = await generateCompanyRef()
    const company = await db.company.create({
      data: { ...c, publicReference: ref, isVerified: true },
    })
    companies.push(company)
    console.log(`  ✓ Company: ${company.legalName} (${ref})`)
  }

  // 4. Demo jobs (PUBLISHED)
  const jobsData = [
    {
      companyIdx: 0,
      title: 'Ingénieur·e Robotique Senior',
      description: `Vous rejoignez notre équipe R&D pour concevoir les systèmes de navigation de nos prochaines plateformes robotiques.

Vos missions principales :
- Concevoir et développer les algorithmes de perception (SLAM, fusion capteurs).
- Travailler sur l'intégration ROS2 / simulateurs.
- Optimiser les performances temps réel embarquées (C++, Python).
- Participer aux revues de design techniques.

Profil recherché :
- Diplôme ingénieur ou équivalent en robotique / informatique embarquée.
- 5+ ans d'expérience en robotique mobile ou industrielle.
- Solides bases en SLAM, perception, et optimisation de code C++.

Nous offrons :
- Mutuelle 100% prise en charge.
- Tickets restaurant.
- Télétravail jusqu'à 2 jours/semaine.
- Évolution vers un rôle de lead technique.`,
      location: 'Paris (75)',
      contractType: 'CDI',
      experienceLevel: 'SENIOR',
      salaryText: '55–70 k€ + bonus',
      skills: ['C++', 'ROS2', 'SLAM', 'Python', 'Robotique'],
      category: 'Ingénierie',
      deadline: null,
    },
    {
      companyIdx: 1,
      title: 'Chargé·e de Projet Énergie Solaire',
      description: `GreenLeaf Energy recherche un·e chargé·e de projet pour piloter le déploiement de centrales solaires photovoltaïques en région Auvergne-Rhône-Alpes.

Vous serez en charge :
- Du montage technique et administratif des dossiers.
- De la coordination avec les collectivités locales.
- Du suivi de chantier et de la mise en service.
- Du reporting auprès des partenaires financiers.

Profil :
- Bac+5 en ingénierie énergétique ou gestion de projet.
- 3+ ans sur des projets ENR.
- Connaissance des marchés publics et de la réglementation photovoltaïque.`,
      location: 'Lyon (69) — hybride',
      contractType: 'CDI',
      experienceLevel: 'CONFIRME',
      salaryText: '38–45 k€',
      skills: ['Photovoltaïque', 'Gestion de projet', 'Marchés publics', 'ER'],
      category: 'Énergie',
      deadline: null,
    },
    {
      companyIdx: 2,
      title: 'Designer UX/UI',
      description: `Le Studio Nord Design cherche un·e designer UX/UI pour renforcer son équipe créative.

Vous interviendrez sur :
- La conception d'interfaces web et mobiles pour nos clients (e-commerce, SaaS, services publics).
- La création de design systems réutilisables.
- La conduite d'ateliers utilisateurs et tests d'utilisabilité.
- La collaboration étroite avec les développeurs front-end.

Profil :
- 3+ ans d'expérience en design d'interface.
- Maîtrise de Figma et prototypage avancé.
- Sens de l'accessibilité (RGAA).
- Portfolio solide indispensable.`,
      location: 'Nantes (44) — présentiel',
      contractType: 'CDI',
      experienceLevel: 'CONFIRME',
      salaryText: '35–42 k€',
      skills: ['Figma', 'Design System', 'UX Research', 'RGAA'],
      category: 'Design',
      deadline: null,
    },
    {
      companyIdx: 3,
      title: 'Développeur·euse Full-Stack — Plateforme Patients',
      description: `HealthTech Solutions développe une plateforme SaaS d'aide à la prise en charge des patients chroniques.

Vous participerez à :
- L'évolution du produit Next.js / Node / PostgreSQL.
- L'intégration d'API santé (HL7, FHIR).
- La mise en conformité RGPD/HDS.
- La mise en place de tests et de CI/CD.

Stack technique :
- Next.js, TypeScript, TailwindCSS, Prisma, PostgreSQL.
- AWS (ECS, RDS, S3), Terraform.

Profil :
- 4+ ans en full-stack JavaScript/TypeScript.
- Sensibilité aux enjeux de santé numérique (HDS est un +).
- Bonnes pratiques d'accessibilité.`,
      location: 'Bordeaux (33) — hybride',
      contractType: 'CDI',
      experienceLevel: 'CONFIRME',
      salaryText: '42–52 k€',
      skills: ['Next.js', 'TypeScript', 'PostgreSQL', 'AWS', 'HDS'],
      category: 'Développement',
      deadline: null,
    },
    {
      companyIdx: 0,
      title: 'Stage — Assistant·e Ingénieur·e Perception (6 mois)',
      description: `Stage de fin d'études en robotique perception.

Sujet : Amélioration de la robustesse d'un SLAM visuel en environnement dynamique (piétons, véhicules).

Encadrement : équipe R&D (8 personnes).
Localisation : Paris 11e.
Indemnisation : 600 €/mois + restaurant + transport remboursés.`,
      location: 'Paris (75)',
      contractType: 'STAGE',
      experienceLevel: 'DEBUTANT',
      salaryText: '600 € / mois',
      skills: ['SLAM', 'OpenCV', 'Python', 'ROS'],
      category: 'Stage',
      deadline: null,
    },
    {
      companyIdx: 1,
      title: 'Technicien·ne Maintenance Éolienne',
      description: `GreenLeaf Energy recrute un·e technicien·ne pour la maintenance de ses parcs éoliens en Bretagne.

Missions :
- Maintenance préventive et corrective des éoliennes.
- Veille technique et reporting d'interventions.
- Travail en hauteur (formation incluse).
- Astreintes ponctuelles.

Profil :
- Bac+2 maintenance industrielle ou équivalent.
- Habilitations électriques (BC, B2V).
- Permis B requis.`,
      location: 'Bretagne — itinérant',
      contractType: 'CDI',
      experienceLevel: 'CONFIRME',
      salaryText: '30–34 k€ + astreintes',
      skills: ['Maintenance', 'Électricité', 'Éolien', 'Travail en hauteur'],
      category: 'Maintenance',
      deadline: null,
    },
  ]

  for (const j of jobsData) {
    const company = companies[j.companyIdx]
    const ref = await generateJobRef()
    const slug = slugify(j.title) + '-' + Math.random().toString(36).slice(2, 6)
    const publishedAt = new Date()
    const job = await db.job.create({
      data: {
        publicReference: ref,
        slug,
        companyId: company.id,
        title: j.title,
        description: j.description,
        location: j.location,
        country: 'France',
        contractType: j.contractType,
        experienceLevel: j.experienceLevel,
        salaryText: j.salaryText,
        skills: JSON.stringify(j.skills),
        category: j.category,
        applicationDeadline: j.deadline ? new Date(j.deadline) : null,
        status: 'PUBLISHED',
        publishedAt,
        createdById: admin.id,
        updatedById: admin.id,
        isFeatured: j.companyIdx === 0,
      },
    })
    console.log(`  ✓ Job: ${job.title} (${ref})`)
  }

  // 5. A pending submission to populate the admin queue
  const submissionRef = await generateSubmissionRef()
  await db.jobSubmission.create({
    data: {
      publicReference: submissionRef,
      contactName: 'Camille Dubois',
      contactEmail: 'rh@startup-xyz.fr',
      contactPhone: '+33612345678',
      title: 'Product Manager — Plateforme éducation',
      description: `Startup XYZ est une plateforme d'apprentissage en ligne pour les enfants de 6 à 14 ans.

Nous recherchons notre premier Product Manager pour structurer notre roadmap produit.

Missions :
- Discovery et priorisation backlog.
- Coordination design / dev / pédagogues.
- A/B testing et mesures d'impact.
- Reporting au CEO.

Profil :
- 4+ ans en PM sur un produit SaaS.
- Appétence pour le secteur éducatif.
- Anglais professionnel.`,
      location: 'Lille (59) — hybride',
      contractType: 'CDI',
      experienceLevel: 'CONFIRME',
      salaryText: '45–55 k€',
      requiredSkills: JSON.stringify(['Product Management', 'SaaS', 'Roadmap', 'Analytics']),
      status: 'PENDING_REVIEW',
      submittedAt: new Date(),
    },
  })
  console.log(`  ✓ Pending submission: ${submissionRef}`)

  console.log('✅ Done.')
  console.log('')
  console.log('Demo admin login:')
  console.log('  Email:    admin@talentforge.local')
  console.log('  Password: admin12345')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
