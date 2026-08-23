# Schooly — Guide de reprise pour un autre éditeur

**Dernière mise à jour :** 23 août 2026  
**Application publique :** <https://schoolysaas-cd9yrqmb.manus.space>  
**Dépôt :** <https://github.com/Assane66/Schooly>  
**Branche de travail à reprendre :** `manus/supabase-integration`

> **Règle importante :** ne pas remplacer ni réécrire la branche `main`. Elle contient un ancien code Next.js distinct. L’application Schooly connectée à Supabase est sur `manus/supabase-integration`.

## 1. Ce qui est livré

Schooly est un SaaS multi-écoles pour le **primaire, le collège et le lycée**. Les écoles partagent une même base Supabase, mais les données métier sont séparées par `school_id` et protégées par des politiques RLS. Deux espaces sont distincts : l’espace établissement `/app` et la supervision globale `/supervision`.

| Domaine | État de l’implémentation | Fichiers principaux |
|---|---|---|
| Site public | Page d’accueil, accès établissement et plateforme | `client/src/pages/Landing.tsx` |
| Authentification | Inscription, connexion, confirmation, récupération de mot de passe et redirections de rôle | `client/src/pages/Auth.tsx`, `client/src/lib/supabase.ts` |
| Inscription directeur | Assistant en 4 étapes : directeur, école, cycles/classes, mot de passe | `client/src/pages/Auth.tsx`, `shared/schoolSetup.ts` |
| Création d’école | Création propriétaire, classes suggérées et coordonnées d’établissement après confirmation | `client/src/pages/Onboarding.tsx` |
| Direction d’école | Tableau de bord, élèves, classes, années, rôles et modules métier | `client/src/pages/Home.tsx` |
| Super-administration | Approbation, refus, avertissement, pause et reprise d’écoles | `client/src/pages/AdminAccess.tsx`, `client/src/pages/Supervision.tsx` |
| Admissions | Préinscription publique et traitement par l’école | `client/src/pages/PublicRegistration.tsx`, `client/src/pages/Registrations.tsx` |
| Finances | Paiements mensuels, frais, statuts payé/partiel/impayé, reçus et QR | `client/src/pages/Payments.tsx`, `client/src/pages/PaymentCardLookup.tsx` |
| Pédagogie | Matières, évaluations, notes et relevé imprimable | `client/src/pages/Pedagogy.tsx` |
| Vie scolaire | Feuille de présence : présent, absent, retard, excusé | `client/src/pages/Attendance.tsx` |
| Documents | Archivage de documents vers Cloudinary avec métadonnées Supabase | `client/src/pages/Documents.tsx`, `server/routers.ts` |
| Communications | Annonces internes par audience | `client/src/pages/Communications.tsx` |
| Famille/élève | Portail individuel et invitations de rattachement | `client/src/pages/StudentPortal.tsx` |

## 2. Dernière inscription en quatre étapes

Le formulaire accessible sur `/connexion` remplace l’ancienne création de compte courte.

| Étape | Informations demandées | Règle métier |
|---|---|---|
| 1. Directeur | Prénom, nom, téléphone, adresse e-mail, adresse, ville, pays | Le directeur possède un compte individuel Supabase. |
| 2. Établissement | Nom, adresse, ville, pays, téléphone professionnel facultatif, e-mail professionnel facultatif | Les informations sont rattachées à l’école après confirmation. |
| 3. Cycles/classes | Élémentaire, collège et lycée ; classes automatiquement proposées, renommables, supprimables ou ajoutables | Aucune université n’est proposée dans la version 1. |
| 4. Accès | Mot de passe et récapitulatif | Un e-mail de confirmation doit être reçu avant création de l’espace. |

Après validation du lien e-mail, `Auth.tsx` dirige un compte sans école vers `/demarrer`. `Onboarding.tsx` lit le brouillon sécurisé stocké dans les métadonnées Supabase Auth, crée l’école et les classes, enregistre les coordonnées professionnelles, puis ouvre `/app`.

> Si l’enregistrement des coordonnées professionnelles échoue, l’onboarding affiche une erreur et propose un nouvel essai. Il ne masque pas l’échec.

## 3. Démarrer le projet dans Antigravity ou un autre éditeur

### Cloner la bonne branche

```bash
git clone https://github.com/Assane66/Schooly.git
cd Schooly
git switch manus/supabase-integration
git pull --ff-only github manus/supabase-integration
pnpm install
```

Le projet est en **Node.js 22**, TypeScript, React 19, Vite 7, Tailwind CSS 4, Express et tRPC. Les commandes utiles sont les suivantes.

| Commande | Rôle |
|---|---|
| `pnpm dev` | Démarre l’application en développement. |
| `pnpm check` | Vérifie TypeScript sans produire de build. |
| `pnpm test` | Lance les tests Vitest. |
| `pnpm build` | Construit le client et le serveur pour la production. |
| `pnpm format` | Applique Prettier sur le projet. |

Avant chaque changement important, exécuter :

```bash
pnpm check && pnpm test && pnpm build
```

## 4. Architecture et emplacements à connaître

| Répertoire | Contenu | Consigne de reprise |
|---|---|---|
| `client/src/pages/` | Écrans et modules métier | Créer ou modifier les parcours fonctionnels ici. |
| `client/src/App.tsx` | Routes Wouter | Déclarer toute nouvelle page ici. |
| `client/src/index.css` | Design Schooly, responsive et styles de modules | Conserver les jetons et la palette existante. |
| `client/src/lib/supabase.ts` | Client Supabase et helpers de rôle | Ne jamais mettre de clé secrète dans ce fichier. |
| `shared/schoolSetup.ts` | Cycles/classes suggérés et types du parcours d’inscription | Modifier ici toute règle de génération de classes. |
| `server/routers.ts` | tRPC et signatures Cloudinary | Garder les secrets uniquement côté serveur. |
| `server/*.test.ts` | Tests Vitest | Ajouter un test à chaque règle métier nouvelle. |
| `docs/*.sql` | Migrations Supabase à exécuter dans SQL Editor | Exécuter chaque script une seule fois, puis noter le résultat. |
| `server/_core/` | Infrastructure du template | Éviter les modifications directes sauf nécessité comprise et testée. |

## 5. Réglages externes indispensables

### Supabase

Le projet Supabase connecté est `ljvnnpwwmhzdctvflsxb`. Les valeurs publiques nécessaires au navigateur sont l’URL Supabase et la clé **publishable**. Elles sont lues par `shared/supabaseConfig.ts` ; ne jamais les remplacer par une clé `service_role` ou une clé secrète.

| Paramètre | État de transfert | Action du prochain éditeur |
|---|---|---|
| Site URL | `https://schoolysaas-cd9yrqmb.manus.space` configurée | Mettre à jour lors d’un changement de domaine. |
| Redirect URL | `https://schoolysaas-cd9yrqmb.manus.space/**` configurée | Ajouter aussi le domaine local/preview utilisé pendant le développement. |
| Confirmation e-mail | Flux client prêt | À tester avec une nouvelle adresse après activation SMTP. |
| SMTP professionnel | **Non configuré** | Bloquant pour les e-mails fiables, le nom « Schooly » et des inscriptions externes. |

Le fournisseur e-mail intégré Supabase ne convient pas à la production : il limite les envois et n’autorise pas la délivrance générale aux nouveaux utilisateurs. Un SMTP personnalisé est nécessaire pour la confirmation des directeurs et la récupération de mot de passe. La documentation Supabase détaille cette contrainte et les réglages SMTP recommandés.[^supabase-smtp]

### Cloudinary

Les photos élèves et les documents utilisent Cloudinary avec signature générée côté serveur. Le projet doit disposer de ces variables uniquement côté serveur :

```text
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Ne jamais mettre `CLOUDINARY_API_SECRET` dans le frontend, dans Git ou dans un fichier `.env` versionné.

### Migrations Supabase déjà appliquées par le propriétaire

Les scripts suivants sont présents dans `docs/` et ont été indiqués comme exécutés avec succès au cours de la reprise :

| Script | But |
|---|---|
| `APPLY_SCHOOL_LIFECYCLE.sql` | Avertissement, pause, reprise et conservation des données. |
| `APPLY_STUDENT_FAMILY_ACCESS.sql` | Invitations et liaison du portail individuel élève/famille. |
| `APPLY_V1_CYCLE_ENFORCEMENT.sql` | Limitation primaire, collège et lycée. |
| `APPLY_SCHOOL_ACTIVITY_LOG.sql` | Journal d’activité plateforme. |
| `APPLY_PEDAGOGY_PERMISSION_HARDENING.sql` | Protection des écritures pédagogiques. |
| `APPLY_COMMUNICATIONS.sql` | Annonces internes par audience. |
| `APPLY_SCHOOL_CONTACTS.sql` | Adresse, téléphone et e-mail professionnel d’établissement. |

Avant de lancer un autre script, le prochain éditeur doit vérifier son contenu, confirmer les dépendances de table et garder une trace de l’exécution dans Supabase.

## 6. GitHub : règle de travail

La branche `main` contient un ancien socle **Next.js 14** avec des données locales de démonstration. La branche `manus/supabase-integration` contient l’application active **React/Vite + Supabase**. Ne pas fusionner les deux architectures par copie de fichiers : reprendre uniquement des fonctions métier compatibles et les reconnecter aux données Supabase réelles.

```bash
# Toujours partir de la branche connectée.
git switch manus/supabase-integration
git pull --ff-only github manus/supabase-integration

# Après validation locale.
git add <fichiers>
git commit -m "Description concise du changement"
git push github manus/supabase-integration
```

## 7. Ce qui reste à faire en priorité

Le suivi complet est conservé dans `todo.md`. Les priorités de reprise sont présentées ici dans un ordre pratique.

| Priorité | Travail restant | Critère de fin |
|---|---|---|
| P0 | Configurer un SMTP professionnel Schooly | Une nouvelle adresse externe reçoit confirmation et récupération de mot de passe. |
| P0 | Jouer un test complet multi-comptes | Directeur, super-administrateur, enseignant/comptable, élève/famille testés avec des données réelles de test. |
| P0 | Tester création d’école et coordonnées | Après inscription, vérifier en base `schools.address`, `contact_phone` et `contact_email`. |
| P0 | Vérifier la supervision | Approbation, refus, avertissement, pause puis reprise conservent les données d’une école pilote. |
| P1 | Renforcer permissions et invitations | Tester les droits réels d’un comptable, secrétaire et professeur. |
| P1 | Finaliser pédagogie, présence et facturation | Affectations enseignant-classe-matière, relances, échéanciers, règles de données. |
| P1 | Sécuriser exploitation | Audit, sauvegarde/restauration, observabilité et procédures de support. |
| P2 | Développer l’internationalisation | Langues, devises, formats locaux, passerelles de paiement. |

## 8. Points de vigilance

1. **Ne pas créer de faux avis, notes ou témoignages** dans l’interface ou les jeux de données.
2. **Ne jamais placer de mots de passe, clés privées ou secrets Cloudinary/Supabase dans Git.**
3. **Conserver le cloisonnement par `school_id`** pour toute nouvelle table métier et valider RLS avant de créer l’interface.
4. **Ne pas supprimer une école pour un impayé.** Utiliser la pause/reprise afin de conserver les données.
5. **Ne pas ajouter l’université** dans les composants scolaires existants. Ce périmètre nécessite un modèle séparé.
6. **Toujours tester le rôle super-administrateur séparément** de l’espace directeur.
7. **Utiliser les médias externes Cloudinary**, jamais les clés secrètes ou fichiers lourds dans le dépôt.

## 9. Prompt de reprise suggéré pour Antigravity

Copier ce texte au début de la nouvelle session :

> Tu reprends Schooly, un SaaS multi-écoles primaire, collège et lycée. Travaille exclusivement sur la branche `manus/supabase-integration` du dépôt `Assane66/Schooly`, jamais sur `main`. La stack est React 19, TypeScript, Vite, Tailwind, Express/tRPC, Supabase Auth/PostgreSQL avec RLS et Cloudinary. Lis d’abord `docs/HANDOFF_FOR_NEXT_EDITOR.md`, `todo.md`, `docs/PRODUCT_READINESS_AUDIT.md` et les migrations `docs/*.sql`. Ne fabrique aucune donnée utilisateur. Garde l’isolation par `school_id`, la séparation stricte super-administration/école et le périmètre primaire-collège-lycée. Avant chaque livraison, exécute `pnpm check && pnpm test && pnpm build`, puis pousse uniquement sur `manus/supabase-integration`.

## Références

[^supabase-smtp]: [Supabase — Send emails with custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp)
