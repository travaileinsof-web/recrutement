# TalentForge — Plateforme de recrutement sans comptes publics

Plateforme de recrutement serverless construite avec **Next.js 16**, **TypeScript strict**, **Prisma** (SQLite en dev, PostgreSQL en prod), **Tailwind CSS 4** et **shadcn/ui**.

**Principe directeur** : aucune création de compte public. Les candidats postulent sans mot de passe, les entreprises soumettent des offres sans inscription. Seuls les administrateurs internes disposent d'une authentification.

---

## Démarrage rapide (développement)

### Pré-requis

- [Bun](https://bun.sh) ≥ 1.3
- Node.js ≥ 20

### Installation

```bash
bun install
cp .env.example .env  # puis éditer avec vos valeurs
```

### Base de données

En développement, le projet utilise **SQLite** (zéro configuration) — le schéma est dans `prisma/schema.prisma`. Le fichier `.env` pointe par défaut vers `file:/home/z/my-project/db/custom.db`.

```bash
# Applique le schéma à la base de données
bun run db:push
```

### Seed — données de démonstration

```bash
bun run scripts/seed.ts
```

Crée :
- 1 administrateur (`admin@talentforge.local` / `admin12345`)
- 4 entreprises (Acme Robotics, GreenLeaf Energy, Studio Nord Design, HealthTech Solutions)
- 6 offres publiées (Robotique, Énergie, Design, Santé numérique, Stage, Maintenance)
- 1 soumission d'offre en attente de validation

### Lancement du serveur de développement

```bash
bun run dev
```

L'application est disponible sur `http://localhost:3000`.

---

## Mise en production

La plateforme est **production-ready**. Voici les adaptations à effectuer.

### 1. Base de données — PostgreSQL

Le schéma PostgreSQL avec enums natifs et JSON natif est dans `prisma/schema.postgres.prisma`. La migration initiale est déjà créée dans `prisma/migrations/20260827000000_init/migration.sql`.

```bash
# 1. Configurez DATABASE_URL et DATABASE_DIRECT_URL dans .env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?schema=public"
DATABASE_DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/DB?schema=public"

# 2. Échangez les schémas
mv prisma/schema.prisma prisma/schema.sqlite.prisma
mv prisma/schema.postgres.prisma prisma/schema.prisma

# 3. Régénérez le client Prisma (avec les types enum natifs)
bun run db:generate

# 4. Appliquez la migration
bun run db:migrate deploy

# 5. Seed PostgreSQL
bun run scripts/seed.ts
```

Le code applicatif est **compatible SQLite et PostgreSQL** grâce à `src/lib/db-compat.ts` qui encode/décode automatiquement les champs JSON et tableaux. Aucune autre adaptation n'est nécessaire.

### 2. Stockage objet — S3 / R2 / MinIO

Configurez les variables d'environnement :

```bash
STORAGE_ENDPOINT="https://your-bucket.r2.cloudflarestorage.com"
STORAGE_BUCKET="talentforge-private"
STORAGE_ACCESS_KEY="..."
STORAGE_SECRET_KEY="..."
STORAGE_REGION="auto"
```

L'adaptateur (`src/lib/storage.ts`) détecte automatiquement la configuration :
- Si les vars sont présentes → **S3-compatible** (signature AWS V4 native, sans dépendance SDK)
- Sinon → **filesystem local** (dev uniquement — ne fonctionne pas en serverless)

Compatible : AWS S3, Cloudflare R2, MinIO, Backblaze B2, Wasabi…

### 3. E-mails — Resend

Configurez :

```bash
RESEND_API_KEY="re_..."
EMAIL_FROM="TalentForge <noreply@votre-domaine.fr>"
APP_URL="https://votre-domaine.fr"
```

L'adaptateur (`src/lib/email-provider.ts`) détecte automatiquement :
- Si `RESEND_API_KEY` est présent → **Resend** via API REST
- Sinon → **console.log** (dev uniquement)

Les templates sont centralisés et versionnés dans `src/lib/email-templates.ts` (8 templates : confirmation de soumission, confirmation de candidature, mise à jour de statut, etc.).

**Worker d'envoi** : en production, déclenchez `POST /api/admin/notifications/flush` via un cron job (Vercel Cron, EasyCron, ou un worker dédié) toutes les minutes.

### 4. Rate limiting distribué — Upstash Redis

Configurez :

```bash
UPSTASH_REDIS_REST_URL="https://...upstash.io"
UPSTASH_REDIS_REST_TOKEN="..."
```

L'adaptateur (`src/lib/rate-limit.ts`) détecte :
- Si `UPSTASH_*` est présent → **Redis distribué** (sliding window via pipeline REST)
- Sinon → **in-memory** (single-process — ne fonctionne pas en multi-instance serverless)

Le rate limiting fail-open en cas d'erreur réseau Redis (ne bloque pas le trafic légitime).

### 5. CAPTCHA — Cloudflare Turnstile (recommandé)

Configurez :

```bash
TURNSTILE_SITE_KEY="0x..."  # exposé au navigateur
TURNSTILE_SECRET_KEY="0x..."  # gardé serveur
```

L'intégration (`src/lib/captcha.ts`) est **optionnelle** :
- Si les vars sont présentes → CAPTCHA Turnstile activé sur tous les formulaires publics
- Sinon → seul le **honeypot** reste actif

Récupérez vos clés : https://developers.cloudflare.com/turnstile/

### 6. Secrets

Générez des secrets aléatoires longs :

```bash
openssl rand -hex 32  # pour AUTH_SECRET
openssl rand -hex 32  # pour RATE_LIMIT_SECRET
```

---

## Variables d'environnement

Voir `.env.example` pour la liste complète documentée.

| Variable | Dev | Production | Rôle |
|---|---|---|---|
| `DATABASE_URL` | `file:...` (SQLite) | `postgresql://...` | Connexion DB principale |
| `DATABASE_DIRECT_URL` | vide | `postgresql://...` | Connexion pour migrations |
| `AUTH_SECRET` | aléatoire | aléatoire | Hash IP audit |
| `RATE_LIMIT_SECRET` | aléatoire | aléatoire | Salt rate limit |
| `APP_URL` | `http://localhost:3000` | `https://...` | URL publique (e-mails) |
| `STORAGE_*` | vide | config S3 | Stockage fichiers privés |
| `RESEND_API_KEY` | vide | clé Resend | Provider e-mail |
| `EMAIL_FROM` | défaut | `From:` header | Expéditeur e-mails |
| `UPSTASH_REDIS_REST_URL` | vide | URL Upstash | Rate limit distribué |
| `UPSTASH_REDIS_REST_TOKEN` | vide | token Upstash | Rate limit distribué |
| `TURNSTILE_SITE_KEY` | vide | clé publique | CAPTCHA |
| `TURNSTILE_SECRET_KEY` | vide | clé privée | CAPTCHA |

---

## Architecture

### Stack technique

| Couche | Technologie |
|---|---|
| Front-end | Next.js 16 (App Router) + React 19 + TypeScript 5 strict |
| Style | Tailwind CSS 4 + shadcn/ui (New York) |
| Base de données | Prisma ORM (SQLite en dev, **PostgreSQL en prod** avec enums + JSON natifs) |
| Validation | Zod (schémas partagés client/serveur) |
| Auth | Cookie de session + table `AccessToken` (hash SHA-256) |
| Stockage fichiers | Adaptateur abstrait (S3-compatible en prod, local en dev) |
| Mots de passe | PBKDF2 (100k itérations, SHA-256, 64-byte hash) |
| Rate limiting | Adaptateur abstrait (Upstash Redis en prod, in-memory en dev) |
| E-mails | Adaptateur abstrait (Resend en prod, console en dev) |
| CAPTCHA | Cloudflare Turnstile (optionnel) |
| Icônes | `lucide-react` |
| Dates | `date-fns` avec locale `fr` |

### Patterns d'abstraction

Tous les services externes (DB, stockage, e-mail, rate limit, CAPTCHA) suivent le même pattern :
1. Interface abstraite
2. Deux implémentations (production + dev fallback)
3. Résolution automatique via variables d'environnement
4. Fail-open en cas d'erreur (ne bloque jamais le trafic légitime)

Cela permet de déployer en production sans modifier le code applicatif — seule la configuration change.

### Structure des dossiers

Voir `/home/z/my-project/download/README.md` pour le détail complet.

---

## Déploiement

### Vercel + Neon + Cloudflare R2 + Resend + Upstash (recommandé)

1. **Vercel** : importez le dépôt, configurez les variables d'environnement, déployez.
2. **Neon** (PostgreSQL serverless) : créez une DB, récupérez `DATABASE_URL`.
3. **Cloudflare R2** : créez un bucket privé, générez les clés API.
4. **Resend** : créez un compte, ajoutez votre domaine, récupérez `RESEND_API_KEY`.
5. **Upstash Redis** : créez une DB Redis serverless, récupérez l'URL REST + token.
6. **Cloudflare Turnstile** : créez un site, récupérez les clés.

Configurez un **cron job Vercel** pour flush les notifications :

```json
// vercel.json
{
  "crons": [
    { "path": "/api/admin/notifications/flush", "schedule": "* * * * *" }
  ]
}
```

### Alternative européenne souveraine

- **Scaleway** : Next.js sur Serverless Container + PostgreSQL managé + Object Storage
- **Clever Cloud** : Next.js + PostgreSQL addon + Cellar (S3) + Mailjet

---

## Sécurité

Voir `/home/z/my-project/download/README.md` section Sécurité.

### Points clés

- **Aucun compte public** (candidat ni entreprise)
- **Candidature toujours rattachée à une offre valide** (`job_id` non-null, FK constraint)
- **CV/lettres stockés en espace privé**, accès via endpoint admin authentifié uniquement
- **Tokens de suivi** hachés SHA-256, expirables, révocables
- **Honeypot + CAPTCHA + rate limit + idempotence** sur tous les formulaires publics
- **Journal d'audit append-only** avec hash IP salé + user-agent
- **Auth admin** par cookie httpOnly + PBKDF2 (100k itérations)
- **Sessions révocables** via table `AccessToken`

---

## Comptes de démonstration

| Rôle | E-mail | Mot de passe |
|---|---|---|
| Administrateur | `admin@talentforge.local` | `admin12345` |

Aucun compte candidat ni entreprise n'existe — conformément à la contrainte d'absence de comptes publics.

---

## Maintenance

### Sauvegardes PostgreSQL

Activez les sauvegardes automatiques du fournisseur (Neon, Supabase, RDS…). Pour Neon : sauvegardes PITR (Point-in-Time Recovery) toutes les 1 s, rétention 7-30 jours.

### Monitoring

- **Sentry** : errors runtime + performance
- **Vercel Analytics** ou **Plausible** : métriques traffic
- **Upstash console** : monitoring Redis
- **Resend dashboard** : délivrabilité e-mails

### Rotation des secrets

- `AUTH_SECRET` et `RATE_LIMIT_SECRET` : rotation annuelle (invalide les hash IP historiques mais pas les sessions admin)
- `STORAGE_SECRET_KEY` : rotation via votre fournisseur S3
- `RESEND_API_KEY` : rotation via dashboard Resend
