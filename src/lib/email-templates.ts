// Centralized, versioned e-mail templates.
// Each template returns { subject, html, text }.
//
// Add new templates here as needed. Keep the `data` shape typed for each
// template to catch mistakes at compile time.

interface TemplateResult {
  html: string
  text: string
}

function escapeHtml(s: unknown): string {
  if (s === null || s === undefined) return ''
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function layout(content: string): string {
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>TalentForge</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #dbeafe;">
        <tr><td style="background:#1e3a8a;padding:24px 32px;">
          <span style="font-size:20px;font-weight:700;color:#ffffff;font-family:Georgia,serif;">TalentForge</span>
        </td></tr>
        <tr><td style="padding:32px;">
          ${content}
        </td></tr>
        <tr><td style="padding:24px 32px;background:#f1f5f9;color:#475569;font-size:12px;">
          <p style="margin:0;">Cet e-mail a été envoyé automatiquement par TalentForge. Ne répondez pas directement.</p>
          <p style="margin:8px 0 0;">© ${new Date().getFullYear()} TalentForge — Plateforme de recrutement sans comptes publics.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function ctaButton(href: string, label: string): string {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;background:#2563eb;color:#ffffff;padding:12px 24px;border-radius:6px;font-weight:600;text-decoration:none;">${escapeHtml(label)}</a>`
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

const templates: Record<string, (data: Record<string, unknown>) => TemplateResult> = {
  SUBMISSION_CONFIRMATION: (data) => {
    const reference = data.reference
    const title = data.title
    const companyName = data.companyName
    const html = layout(`
      <h1 style="margin:0 0 16px;font-size:24px;color:#1e3a8a;">Proposition d’offre reçue</h1>
      <p style="margin:0 0 12px;">Bonjour,</p>
      <p style="margin:0 0 12px;">Nous avons bien reçu votre proposition d’offre <strong>${escapeHtml(title)}</strong> pour <strong>${escapeHtml(companyName)}</strong>.</p>
      <p style="margin:0 0 16px;">Notre équipe l’examine et reviendra vers vous sous 48h ouvrées.</p>
      <p style="margin:0 0 8px;font-size:14px;color:#475569;">Référence de suivi :</p>
      <p style="margin:0 0 24px;font-family:monospace;background:#f1f5f9;padding:8px 12px;border-radius:4px;display:inline-block;">${escapeHtml(reference)}</p>
    `)
    const text = `Proposition d'offre reçue\n\nBonjour,\n\nNous avons bien reçu votre proposition d'offre "${title}" pour ${companyName}.\nNotre équipe l'examine et reviendra vers vous sous 48h ouvrées.\n\nRéférence: ${reference}`
    return { html, text }
  },

  NEW_SUBMISSION: (data) => {
    const reference = data.reference
    const title = data.title
    const html = layout(`
      <h1 style="margin:0 0 16px;font-size:24px;color:#1e3a8a;">Nouvelle soumission à examiner</h1>
      <p style="margin:0 0 12px;">Une nouvelle proposition d’offre vient d’être soumise et attend une revue.</p>
      <p style="margin:0 0 8px;"><strong>Titre :</strong> ${escapeHtml(title)}</p>
      <p style="margin:0 0 16px;"><strong>Référence :</strong> <code>${escapeHtml(reference)}</code></p>
      <p style="margin:0;">Connectez-vous au tableau de bord pour examiner cette proposition.</p>
    `)
    const text = `Nouvelle soumission\n\nTitre: ${title}\nRéférence: ${reference}\n\nConnectez-vous au tableau de bord pour examiner cette proposition.`
    return { html, text }
  },

  APPLICATION_CONFIRMATION: (data) => {
    const reference = data.reference
    const jobTitle = data.jobTitle
    const companyName = data.companyName
    const trackingUrlPath = data.trackingUrlPath
    const trackingUrl = process.env.APP_URL
      ? `${process.env.APP_URL}${trackingUrlPath}`
      : `http://localhost:3000${trackingUrlPath}`
    const html = layout(`
      <h1 style="margin:0 0 16px;font-size:24px;color:#1e3a8a;">Candidature reçue</h1>
      <p style="margin:0 0 12px;">Bonjour,</p>
      <p style="margin:0 0 12px;">Nous avons bien reçu votre candidature pour le poste <strong>${escapeHtml(jobTitle)}</strong> chez <strong>${escapeHtml(companyName)}</strong>.</p>
      <p style="margin:0 0 8px;font-size:14px;color:#475569;">Référence de votre candidature :</p>
      <p style="margin:0 0 24px;font-family:monospace;background:#f1f5f9;padding:8px 12px;border-radius:4px;display:inline-block;">${escapeHtml(reference)}</p>
      <p style="margin:0 0 16px;">Conservez le lien ci-dessous pour suivre l’avancement de votre candidature. Il est privé, non devinable et expirera après un certain temps.</p>
      ${ctaButton(trackingUrl, 'Suivre ma candidature')}
    `)
    const text = `Candidature reçue\n\nBonjour,\n\nNous avons bien reçu votre candidature pour "${jobTitle}" chez ${companyName}.\nRéférence: ${reference}\n\nLien de suivi: ${trackingUrl}`
    return { html, text }
  },

  NEW_APPLICATION: (data) => {
    const reference = data.reference
    const jobTitle = data.jobTitle
    const html = layout(`
      <h1 style="margin:0 0 16px;font-size:24px;color:#1e3a8a;">Nouvelle candidature reçue</h1>
      <p style="margin:0 0 12px;">Une nouvelle candidature vient d’être déposée.</p>
      <p style="margin:0 0 8px;"><strong>Offre :</strong> ${escapeHtml(jobTitle)}</p>
      <p style="margin:0 0 16px;"><strong>Référence candidature :</strong> <code>${escapeHtml(reference)}</code></p>
      <p style="margin:0;">Connectez-vous au tableau de bord pour consulter cette candidature.</p>
    `)
    const text = `Nouvelle candidature\n\nOffre: ${jobTitle}\nRéférence: ${reference}\n\nConnectez-vous au tableau de bord pour consulter.`
    return { html, text }
  },

  APPLICATION_STATUS_UPDATE: (data) => {
    const reference = data.reference
    const status = data.status
    const publicMessage = data.publicMessage
    const html = layout(`
      <h1 style="margin:0 0 16px;font-size:24px;color:#1e3a8a;">Mise à jour de votre candidature</h1>
      <p style="margin:0 0 12px;">Bonjour,</p>
      <p style="margin:0 0 12px;">Le statut de votre candidature <code>${escapeHtml(reference)}</code> a été mis à jour.</p>
      <p style="margin:0 0 8px;"><strong>Nouveau statut :</strong> ${escapeHtml(status)}</p>
      ${publicMessage ? `<p style="margin:0 0 16px;padding:12px;background:#f1f5f9;border-radius:4px;">${escapeHtml(publicMessage)}</p>` : ''}
    `)
    const text = `Mise à jour de votre candidature\n\nRéférence: ${reference}\nNouveau statut: ${status}\n${publicMessage ? 'Message: ' + publicMessage : ''}`
    return { html, text }
  },

  SUBMISSION_APPROVED: (data) => {
    const reference = data.reference
    const title = data.title
    const html = layout(`
      <h1 style="margin:0 0 16px;font-size:24px;color:#1e3a8a;">Proposition approuvée</h1>
      <p style="margin:0 0 12px;">Bonjour,</p>
      <p style="margin:0 0 12px;">Votre proposition d’offre <strong>${escapeHtml(title)}</strong> a été approuvée et sera bientôt publiée.</p>
      <p style="margin:0 0 8px;font-size:14px;color:#475569;">Référence :</p>
      <p style="margin:0;"><code>${escapeHtml(reference)}</code></p>
    `)
    const text = `Proposition approuvée\n\nTitre: ${title}\nRéférence: ${reference}`
    return { html, text }
  },

  SUBMISSION_REJECTED: (data) => {
    const reference = data.reference
    const title = data.title
    const html = layout(`
      <h1 style="margin:0 0 16px;font-size:24px;color:#1e3a8a;">Proposition non retenue</h1>
      <p style="margin:0 0 12px;">Bonjour,</p>
      <p style="margin:0 0 12px;">Votre proposition d’offre <strong>${escapeHtml(title)}</strong> n’a pas été retenue pour publication.</p>
      <p style="margin:0 0 8px;font-size:14px;color:#475569;">Référence :</p>
      <p style="margin:0;"><code>${escapeHtml(reference)}</code></p>
    `)
    const text = `Proposition non retenue\n\nTitre: ${title}\nRéférence: ${reference}`
    return { html, text }
  },

  SUBMISSION_NEEDS_CORRECTION: (data) => {
    const reference = data.reference
    const title = data.title
    const correctionMessage = data.correctionMessage
    const html = layout(`
      <h1 style="margin:0 0 16px;font-size:24px;color:#1e3a8a;">Corrections demandées</h1>
      <p style="margin:0 0 12px;">Bonjour,</p>
      <p style="margin:0 0 12px;">Votre proposition d’offre <strong>${escapeHtml(title)}</strong> nécessite quelques corrections avant publication.</p>
      ${correctionMessage ? `<p style="margin:0 0 16px;padding:12px;background:#f1f5f9;border-radius:4px;">${escapeHtml(correctionMessage)}</p>` : ''}
      <p style="margin:0 0 8px;font-size:14px;color:#475569;">Référence :</p>
      <p style="margin:0;"><code>${escapeHtml(reference)}</code></p>
    `)
    const text = `Corrections demandées\n\nTitre: ${title}\n${correctionMessage ? 'Message: ' + correctionMessage : ''}\nRéférence: ${reference}`
    return { html, text }
  },

  APPLICATION_TRACKING_RESEND: (data) => {
    const reference = data.reference
    const trackingUrlPath = data.trackingUrlPath
    const trackingUrl = process.env.APP_URL
      ? `${process.env.APP_URL}${trackingUrlPath}`
      : `http://localhost:3000${trackingUrlPath}`
    const html = layout(`
      <h1 style="margin:0 0 16px;font-size:24px;color:#1e3a8a;">Votre lien de suivi</h1>
      <p style="margin:0 0 12px;">Bonjour,</p>
      <p style="margin:0 0 12px;">Vous avez demandé un nouveau lien de suivi pour votre candidature <code>${escapeHtml(reference)}</code>.</p>
      ${ctaButton(trackingUrl, 'Suivre ma candidature')}
      <p style="margin:16px 0 0;font-size:12px;color:#475569;">Si vous n’avez pas demandé ce lien, ignorez cet e-mail.</p>
    `)
    const text = `Votre lien de suivi\n\nRéférence: ${reference}\nLien: ${trackingUrl}`
    return { html, text }
  },

  // Default fallback template
  DEFAULT: (data) => {
    const html = layout(`
      <h1 style="margin:0 0 16px;font-size:24px;color:#1e3a8a;">Notification TalentForge</h1>
      <pre style="white-space:pre-wrap;font-family:monospace;background:#f1f5f9;padding:12px;border-radius:4px;">${escapeHtml(JSON.stringify(data, null, 2))}</pre>
    `)
    const text = `Notification TalentForge\n\n${JSON.stringify(data, null, 2)}`
    return { html, text }
  },
}

export function renderEmailTemplate(
  type: string,
  data: Record<string, unknown>,
): TemplateResult {
  const render = templates[type] ?? templates.DEFAULT
  return render(data)
}
