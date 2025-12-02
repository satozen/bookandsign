# E-Sign Plateforme de Réservation

Une application simple et mobile de réservation et signature électronique. Les utilisateurs peuvent réserver un service et signer un contrat directement sur leur téléphone.

## Fonctionnalités

- 📱 **Optimisé mobile** - Pad de signature tactile
- ✍️ **Signature électronique** - Dessinez avec le doigt ou un stylet
- 📅 **Réservation simple** - Formulaire rapide avec date et sélection de service
- 🎨 **Design épuré** - Esthétique chaleureuse et professionnelle

## Pages

1. **Accueil** (`/`) - Formulaire de réservation (nom, courriel, date, service)
2. **Signature** (`/sign`) - Affichage du contrat + pad de signature
3. **Confirmation** (`/complete`) - Résumé de la réservation + signature

## Démarrage

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Compiler pour la production
npm run build
```

## Déployer sur Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

Ou connectez votre dépôt GitHub au tableau de bord Vercel pour des déploiements automatiques.

## Stack technique

- Next.js 14 (App Router)
- TypeScript
- CSS Modules
