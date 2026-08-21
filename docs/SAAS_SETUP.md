# Schooly — Socle SaaS connecté

## État du projet

Schooly dispose désormais d’une page publique, d’une authentification Supabase, d’un onboarding de création d’établissement, d’un espace applicatif protégé et d’un module Élèves relié aux données de l’établissement connecté. Les données sont isolées par établissement grâce aux politiques **Row Level Security** de Supabase.

| Domaine | Éléments en place |
|---|---|
| Identité | Inscription, connexion et persistance de session Supabase Auth |
| Multi-tenant | `schools`, `school_memberships` et rôles applicatifs |
| Scolarité | Années scolaires, classes, élèves et inscriptions annuelles |
| Médias | Dossier Cloudinary `schooly`, signatures d’upload côté serveur et métadonnées Supabase |
| Interface | Portail public, parcours de création d’établissement, tableau de bord et gestion d’élèves |

## Parcours principal

1. Une personne crée son compte sur `/connexion`.
2. Après confirmation de son e-mail, elle est redirigée vers `/demarrer`.
3. Elle renseigne le nom et la ville de son établissement.
4. La fonction Supabase `create_school_with_owner` crée l’école et lui attribue le rôle `owner`.
5. L’espace `/app` charge exclusivement les écoles et élèves accessibles au compte connecté.

## Schéma Supabase

Le schéma public contient les tables `profiles`, `schools`, `school_memberships`, `academic_years`, `classes`, `students`, `student_enrollments` et `media_assets`. Chaque table métier porte une clé `school_id`, ce qui permet le cloisonnement des données entre établissements.

Les rôles prévus sont `owner`, `director`, `administrator`, `secretary`, `accountant`, `teacher`, `supervisor`, `parent` et `student`. Les politiques RLS se fondent sur la fonction `is_school_member` pour autoriser uniquement les membres de l’établissement concerné.

## Gouvernance de plateforme

Chaque nouvel établissement est créé avec le statut `pending`. Tant qu’un super-administrateur ne l’a pas approuvé, son propriétaire voit un écran d’attente et les tables métier restent inaccessibles. Le super-administrateur peut approuver, refuser avec motif ou suspendre une école depuis `/supervision`.

L’adresse e-mail du propriétaire désignée dans la migration de gouvernance est promue automatiquement en `super_admin` lors de sa première inscription. Ce mécanisme est exécuté côté base de données : aucun droit d’administration de plateforme n’est délivré par le navigateur.

Les fonctions internes de contrôle RLS ont été déplacées vers le schéma privé `schooly_private`, hors de l’API REST publique. Les deux procédures publiques restantes sont intentionnelles : `create_school_with_owner` crée l’école de l’utilisateur connecté et `approve_school` vérifie le rôle de plateforme avant toute décision.

## Médias Cloudinary

Les photos d’élèves sont envoyées directement vers Cloudinary avec une signature à durée courte délivrée par le serveur Schooly. L’API Cloudinary secrète n’est jamais exposée au navigateur. Après transfert, l’URL de livraison et le `public_id` sont enregistrés dans `students` et `media_assets`.

> Avant le premier transfert en production, vérifiez que les variables `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` et `CLOUDINARY_API_SECRET` sont présentes dans les paramètres de l’application.

## Configuration Supabase à confirmer dans la console

Le projet Supabase est opérationnel et la clé publishable est configurée. La console Supabase doit également autoriser les origines de l’application dans **Authentication → URL Configuration** :

- Site URL : `https://schoolysaas-cd9yrqmb.manus.space`
- Redirect URL : `https://schoolysaas-cd9yrqmb.manus.space/demarrer`
- Redirect URL de développement : l’URL de prévisualisation actuellement active, suivie de `/demarrer`

Cette configuration permet au lien de confirmation envoyé par Supabase de revenir sur l’onboarding Schooly.

## Vérifications effectuées

Les commandes suivantes ont été validées après l’intégration :

```bash
pnpm check
pnpm build
pnpm test
```

Les tests couvrent le logout du socle full-stack, l’accès à la configuration Supabase, la normalisation URL/clé publique et la génération de signature Cloudinary.

## Tests fonctionnels à réaliser avec un compte réel

1. Créer un compte avec une adresse e-mail accessible et confirmer l’e-mail Supabase.
2. Créer un établissement depuis `/demarrer`.
3. Accéder à `Élèves`, créer un premier dossier et, si souhaité, joindre une photo.
4. Contrôler dans Supabase que l’école, l’appartenance, l’élève et le média sont bien isolés par `school_id`.
5. Se connecter avec le compte super-administrateur, ouvrir `/supervision`, approuver l’école créée puis confirmer que son propriétaire accède à `/app`.
