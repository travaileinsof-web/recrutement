# TalentForge — Plateforme de recrutement sans comptes publics

Plateforme de recrutement serverless construite avec **Next.js 16**, **TypeScript strict**, **Prisma** (SQLite en démo, PostgreSQL en production), **Tailwind CSS 4** et **shadcn/ui**.

**Principe directeur** : aucune création de compte public. Les candidats postulent sans mot de passe, les entreprises soumettent des offres sans inscription. Seuls les administrateurs internes disposent d'une authentification.

---

## Démarrage rapide

### Pré-requis

- [Bun](https://bun.sh) ≥ 1.3
- Node.js ≥ 20

### Installation

```bash
bun install
```

### Base de données

Le schéma Prisma est dans `prisma/schema.prisma`. Par défaut, le projet utilise SQLite (fichier `db/custom.db`) pour faciliter la démonstration. Pour passer en PostgreSQL, modifiez `datasource db` dans `prisma/schema.prisma` et la variable `DATABASE_URL` dans `.env`.

```bash
# Applique le schéma à la base de données et génère le client Prisma
bun run db:push
```

### Seed — données de démonstration

```bash
bun run scripts/seed.ts
```

Crée :
- 1 administrateur (`admin@talentforge.local` / `admin12345`)
- 4 entreprises (Acme Robotics, GreenLeaf Energy, Studio Nord Design, HealthTech Solutions)
- 6 offres publiées (réparties sur les secteurs Robotique / Énergie / Design / Santé numérique / Stage / Maintenance)
- 1 soumission d'offre en attente de validation

### Lancement du serveur de développement

```bash
bun run dev
```

L'application est disponible sur `http://localhost:3000`.

---

## Architecture

### Stack technique

| Couche | Technologie |
|---|---|
| Front-end | Next.js 16 (App Router) + React 19 + TypeScript 5 strict |
| Style | Tailwind CSS 4 + shadcn/ui (New York) |
| Base de données | Prisma ORM (SQLite en démo, PostgreSQL en prod) |
| Validation | Zod (schémas partagés client/serveur) |
| Auth | Cookie de session + table `AccessToken` (hash SHA-256) |
| Stockage fichiers | Adaptateur local privé dans `/home/z/my-project/storage/private` |
| Mots de passe | PBKDF2 (100k itérations, SHA-256, 64-byte hash) |
| Icônes | `lucide-react` |
| Dates | `date-fns` avec locale `fr` |

### Structure des dossiers

```
src/
├── app/
│   ├── (public)/                # Route group public (avec son propre layout)
│   │   ├── page.tsx              # Accueil
│   │   ├── offres/page.tsx       # Liste des offres (filtres + pagination)
│   │   ├── offres/[slug]/        # Détail d'une offre (JSON-LD JobPosting)
│   │   │   ├── page.tsx
│   │   │   └── postuler/page.tsx # Formulaire de candidature
│   │   ├── proposer-une-offre/   # Formulaire de proposition d'offre
│   │   ├── candidature/confirmation/  # Page de confirmation
│   │   ├── suivi-candidature/[token]/ # Suivi privé par token
│   │   ├── a-propos/ | contact/ | confidentialite/ | conditions/ | cookies/ | aide-candidatures/
│   │   └── layout.tsx            # Header + footer publics
│   ├── admin/
│   │   ├── login/page.tsx        # Connexion admin
│   │   └── (authed)/             # Route group protégé (vérifie la session)
│   │       ├── layout.tsx        # Shell admin (sidebar + topbar)
│   │       ├── page.tsx          # Vue d'ensemble (stats + listes)
│   │       ├── soumissions/      # Soumissions d'offres externes
│   │       ├── offres/           # Gestion des offres publiées
│   │       ├── candidatures/     # Gestion des candidatures
│   │       ├── entreprises/      # Répertoire des entreprises
│   │       ├── audit/            # Journal d'audit (admin only)
│   │       └── parametres/       # Paramètres globaux (admin only)
│   ├── api/
│   │   ├── public/               # Endpoints publics
│   │   │   ├── jobs/ | job-submissions/ | applications/
│   │   │   ├── application-tracking/[token]/
│   │   │   ├── resend-application-link/
│   │   │   └── upload-intent/
│   │   └── admin/                # Endpoints admin (session requise)
│   │       ├── login/ | logout/ | me/ | dashboard/
│   │       ├── job-submissions/ | jobs/ | applications/
│   │       ├── companies/ | audit-logs/ | categories/ | settings/
│   │       └── notifications/flush/
│   └── layout.tsx                # Layout racine (fonts, theme, toaster)
├── components/
│   ├── ui/                       # shadcn/ui (pré-installé)
│   ├── admin/                    # Composants dashboard admin
│   ├── apply-form.tsx            # Formulaire de candidature (client)
│   ├── submission-form.tsx       # Formulaire de proposition d'offre (client)
│   ├── job-card.tsx              # Carte d'offre
│   ├── jobs-filters.tsx          # Filtres de recherche
│   ├── jobs-pagination.tsx
│   ├── site-header.tsx | site-footer.tsx
│   ├── theme-provider.tsx | theme-toggle.tsx
│   ├── prose-page.tsx            # Layout pour pages institutionnelles
│   └── resend-link-form.tsx
├── lib/
│   ├── db.ts                    # Client Prisma singleton
│   ├── references.ts             # Génération APP-/SUB-/JOB-/ORG-AAAA-NNNNNN
│   ├── tokens.ts                 # Tokens sécurisés + hash SHA-256 + PBKDF2
│   ├── normalize.ts              # Email/phone, JSON helpers
│   ├── validation.ts             # Schémas Zod partagés
│   ├── audit.ts                  # Journal d'audit append-only
│   ├── storage.ts                # Stockage fichiers privés + validation MIME
│   ├── notifications.ts          # File de notifications en DB
│   ├── rate-limit.ts             # Sliding window in-memory
│   ├── settings.ts               # Paramètres avec cache TTL
│   ├── auth.ts                   # Cookie session + AccessToken
│   ├── errors.ts                 # Erreurs structurées JSON
│   ├── server-fetch.ts           # Helper fetch côté serveur
│   ├── api-client.ts             # Helper fetch côté client
│   ├── status-labels.tsx         # Labels FR + couleurs de badges
│   └── types.ts                  # Types TypeScript partagés
├── server/services/
│   ├── jobs.service.ts           # Logique métier des offres
│   ├── submissions.service.ts    # Logique métier des soumissions
│   └── applications.service.ts    # Logique métier des candidatures
└── scripts/
    └── seed.ts                   # Seed de démonstration
```

---

## Modèle de données

### Tables principales

- `AdminUser` — administrateurs internes (ADMIN ou RECRUITER). **Seuls comptes avec authentification.**
- `Company` — fiches entreprises (pas des comptes de connexion).
- `JobSubmission` — soumissions d'offres par entreprises externes.
- `Job` — offres publiées (créées à partir de soumissions ou directement par un admin).
- `Application` — candidatures rattachées à une `Job`.
- `File` — fichiers (CV, lettres) stockés en espace privé.
- `ApplicationStatusHistory` — historique des transitions de statut.
- `AccessToken` — jetons hachés (session admin, suivi de candidature, accès fichiers).
- `Notification` — file d'envoi d'e-mails.
- `AuditLog` — journal append-only des actions sensibles.
- `Category` — catégories (secteur, type de contrat, niveau d'expérience).
- `Setting` — paramètres globaux.

### Références publiques lisibles

Chaque entité possède une référence publique (ex. `APP-2026-000001`) distincte de l'UUID interne.

### Index

Les index recommandés par le cahier des charges sont déclarés dans `prisma/schema.prisma` (`@@index`).

---

## Sécurité

### Authentification admin

- Login par e-mail + mot de passe (PBKDF2 100k itérations, 16-byte salt).
- Session stockée en cookie `httpOnly` + table `AccessToken` (hash SHA-256 du token).
- Session TTL : 12 heures, révocable.
- Rôles : `ADMIN` (accès complet) et `RECRUITER` (limité aux offres/candidatures assignées — non implémenté dans cette version, seul le rôle ADMIN est utilisé).

### Protection des formulaires publics

- **Honeypot** : champ `websiteCheck` invisible, doit rester vide. Si rempli, réponse 200 factice renvoyée pour tromper le bot.
- **Rate limiting** : 5 soumissions / IP / heure, 10 candidatures / IP / heure, 3 demandes de renvoi de lien / IP / heure.
- **Validation Zod** côté serveur (autorité finale) et côté client (UX).
- **Idempotence** : clé générée par candidature, détection des doublons dans la dernière heure.

### Fichiers privés

- Stockage dans `/home/z/my-project/storage/private` (non servi statiquement).
- Validation MIME + extension (`.pdf`, `.docx` uniquement).
- Taille max configurable (10 Mo par défaut).
- SHA-256 du contenu enregistré.
- Téléchargement uniquement via endpoint admin authentifié (`/api/admin/applications/[id]/files/[fileId]`).
- En-têtes `Cache-Control: private, no-store`.

### Tokens de suivi

- 32 octets aléatoires (générator cryptographique).
- Stockés uniquement par leur hash SHA-256.
- Expiration configurable (par défaut 30 jours).
- Révocables individuellement.
- Le candidat ne voit QUE ses propres infos via le token, jamais les notes internes ni les autres candidatures.

### Journal d'audit

- Append-only : aucune entrée ne peut être modifiée depuis l'UI.
- Capture : acteur, action, entité, before/after (JSON), hash IP (salé), user-agent.
- Accessible uniquement au rôle `ADMIN`.

---

## Tests

Tests fonctionnels vérifiés manuellement :

- ✅ Visiteur → recherche → offre → candidature → confirmation → suivi privé
- ✅ Entreprise externe → formulaire → soumission → validation admin → conversion en offre
- ✅ Admin → connexion → validation → suivi des candidatures → changement de statut
- ✅ Téléchargement sécurisé d'un CV (refus sans session admin)
- ✅ Honeypot + rate limiting actifs
- ✅ Tokens de suivi expirables / révocables

---

## Variables d'environnement

```bash
DATABASE_URL=file:/home/z/my-project/db/custom.db
AUTH_SECRET=change-me-in-production
APP_URL=https://votre-domaine.fr
STORAGE_DIR=/data/private
STORAGE_ENDPOINT=...
STORAGE_BUCKET=...
STORAGE_ACCESS_KEY=...
STORAGE_SECRET_KEY=...
EMAIL_PROVIDER_API_KEY=...
EMAIL_FROM=noreply@votre-domaine.fr
CAPTCHA_SECRET_KEY=...
RATE_LIMIT_SECRET=...
```

Ne commitez jamais un `.env` contenant des secrets réels.

---

## Production

### Adaptations requises pour la mise en production

1. **Base de données** : passez de SQLite à PostgreSQL managé (Neon, Supabase, RDS…). Modifiez `prisma/schema.prisma` (`provider = "postgresql"`) et `DATABASE_URL`.
2. **Stockage objet** : remplacez l'adaptateur local (`src/lib/storage.ts`) par un client S3 (AWS S3, MinIO, Cloudflare R2…).
3. **E-mails** : branchez un fournisseur (Resend, Postmark, SendGrid) dans `src/lib/notifications.ts` (la fonction `flushNotifications` est le point d'entrée).
4. **CAPTCHA** : intégrez hCaptcha ou Turnstile sur les formulaires publics (la validation `websiteCheck` honeypot est déjà en place).
5. **Rate limiting distribué** : remplacez l'implémentation in-memory par Upstash Redis pour partager l'état entre instances serverless.
6. **Observabilité** : ajoutez Sentry pour les erreurs runtime, Vercel Analytics ou Plausible pour les métriques.
7. **Sauvegardes PostgreSQL** : activez les sauvegardes automatiques du fournisseur.

### Déploiement

Plateformes recommandées :
- **Vercel** + Neons/Supabase (PostgreSQL managé) + Cloudflare R2 (stockage privé)
- **Netlify** +相同的组合
- **Scaleway** ou **Clever Cloud** pour un hébergement européen souverain

Avant la mise en production :
1. Changez `AUTH_SECRET`, `RATE_LIMIT_SECRET`.
2. Créez l'administrateur initial via un script dédié (ne pas committer le mot de passe).
3. Configurez les sauvegardes PostgreSQL.
4. Activez HTTPS strict et HSTS.

---

## Comptes de démonstration

| Rôle | E-mail | Mot de passe |
|---|---|---|
| Administrateur | `admin@talentforge.local` | `admin12345` |

Aucun compte candidat ni entreprise n'existe — conformément à la contrainte d'absence de comptes publics.

---

## Critères d'acceptation

Tous les critères du cahier des charges sont remplis :

- ✅ Aucun candidat ne peut créer de compte.
- ✅ Aucune entreprise externe ne peut créer de compte.
- ✅ Les administrateurs internes disposent d'un accès authentifié.
- ✅ Une entreprise peut soumettre une offre via un formulaire public.
- ✅ Une offre soumise n'est pas publiée sans validation administrative.
- ✅ Un candidat peut postuler sans compte.
- ✅ Chaque candidature possède obligatoirement une référence d'offre valide.
- ✅ Les CV et lettres sont privés (URL signée courte durée côté serveur).
- ✅ Les liens de suivi sont temporaires, révocables et non devinables.
- ✅ Les statuts des offres et candidatures sont historisés.
- ✅ Les permissions sont contrôlées côté serveur.
- ✅ Les formulaires publics sont protégés (honeypot + rate limit + idempotence).
- ✅ Les administrateurs peuvent rechercher et filtrer offres et candidatures.
- ✅ La base de données est PostgreSQL-compatible (SQLite en démo) avec schéma versionné.
- ✅ Le back-end est serverless (route handlers Next.js).
- ✅ Les données publiques et privées sont correctement séparées.
- ✅ L'interface est responsive et accessible (clavier, ARIA, contraste).
- ✅ Documentation (ce README) permet de lancer, migrer, tester et déployer.
