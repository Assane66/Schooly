# Schooly — Audit de préparation produit

**État du document :** 22 août 2026  
**Périmètre :** version Schooly primaire, collège et lycée ; multi-écoles dans une même base Supabase, avec isolation des données par établissement.

## Conclusion courte

Schooly dispose déjà d’un **socle SaaS réel** : authentification Supabase, établissements isolés, gouvernance plateforme, validation d’école, rôles, élèves, classes, paiements mensuels, cartes QR, préinscriptions, import/export CSV et stockage Cloudinary. Le produit est suffisamment avancé pour mener des pilotes encadrés avec quelques écoles.

Il ne faut toutefois pas encore le présenter comme un système scolaire entièrement automatisé à grande échelle. Les éléments prioritaires restants sont le **test réel de tous les parcours**, le **registre pédagogique complet**, les **vraies notifications**, le **cycle complet de facturation**, le **suivi de l’activité**, les **sauvegardes** et l’outillage de support pour beaucoup d’établissements.

> Une suspension Schooly ne supprime pas les données : elle désactive l’accès de l’école et sa reprise restitue le même établissement, avec ses élèves, classes, paiements et documents.

## Ce qui est prêt et connecté

| Domaine | Fonctions disponibles | Niveau de préparation |
|---|---|---|
| Accès public | Accueil, connexion, création de compte établissement, récupération de mot de passe et onboarding | Opérationnel |
| Supervision Schooly | Entrée distincte, approbation/refus, pause/reprise, avertissement et historique de cycle de vie | Opérationnel, à tester sur plusieurs écoles réelles |
| Multi-écoles | Écoles, années, classes, élèves, données isolées par `school_id` et politiques Supabase | Opérationnel |
| Direction d’école | Tableau de bord, navigation persistante, classes, élèves, inscriptions et modules métier | Opérationnel |
| Rôles | Rôles standards, rôles personnalisés, permissions, invitations de membres et navigation filtrée | Opérationnel, à tester avec comptes non-propriétaires |
| Élèves | Création, matricule, photo Cloudinary, export CSV et import CSV contrôlé | Opérationnel |
| Admissions | Préinscription publique par lien/code d’école et traitement par l’établissement | Opérationnel |
| Finance | Statut mensuel payé/partiel/impayé, suivi par élève, reçu imprimable, carte QR et lecture contrôlée | Opérationnel pour le suivi interne |
| Portail élève/famille | Portail individuel, invitations de liaison, droits liés au dossier, redirection après connexion | Structure et interface prêtes ; invitation automatisée à compléter |
| Sécurité | Authentification Supabase, RLS, rôles, séparation plateforme/école, fonctions internes protégées | Socle en place ; audit et tests complets restent nécessaires |
| Structure scolaire | Primaire, collège et lycée ; séries lycée ; blocage des références universitaires dans l’interface et script Supabase préparé | Opérationnel après activation du script en base |

## Ce qui est implémenté mais doit être validé en conditions réelles

| Sujet | Pourquoi une validation reste requise | Action à mener |
|---|---|---|
| Super-administrateur | Le compte propriétaire est configuré, mais tous les parcours doivent être rejoués sans session précédente | Tester connexion Administration, approbation, avertissement, pause et reprise |
| Permissions | Les rôles et la navigation sont filtrés, mais il faut tester des comptes réels comptable, secrétaire et professeur | Créer au moins deux comptes de test et vérifier chaque permission sensible |
| Suspension d’école | La migration et l’interface existent | Tester le flux avertissement → pause → blocage → reprise sur une école pilote |
| Portail famille | Les relations en base et l’interface existent | Créer un compte invité, vérifier l’association au bon élève et l’absence d’accès aux autres dossiers |
| Import CSV | La validation et l’insertion existent | Importer un fichier réel de test, contrôler les doublons et le formatage local |
| QR paiement | La génération et la consultation existent | Créer une carte, scanner avec un autre appareil et contrôler les droits de lecture |

## Ce qui manque avant un lancement commercial large

### Priorité 0 — Sécurité, exploitation et fiabilité

| Capacité à construire | Résultat attendu |
|---|---|
| Journal d’activité central | Historique de qui a créé, modifié, validé, suspendu ou exporté des données sensibles |
| Sauvegarde et restauration | Politique de sauvegarde, tests de restauration et procédure documentée de reprise après incident |
| Observabilité | Alertes techniques, journal d’erreurs, santé des intégrations Supabase/Cloudinary et suivi d’usage |
| Tests de parcours | Tests réels multi-comptes : direction, comptable, professeur, élève/famille et super-administrateur |
| Gestion des données | Durées de conservation, export d’école, suppression contrôlée, droits d’accès et procédure de support |
| Anti-abus | Limites d’import, limites d’invitations, contrôle des fichiers et protections contre les accès automatisés |

### Priorité 1 — Cœur scolaire et financier

| Module à compléter | Ce qu’il doit contenir |
|---|---|
| Registre pédagogique | Matières, affectations professeur-matière-classe, évaluations, notes, moyennes, bulletins et relevés |
| Présences | Saisie par classe, justificatifs, retards, statistiques et alertes de seuil |
| Inscriptions annuelles | Affectation élève-classe, réinscription, transferts, archivage d’année et listes officielles |
| Facturation | Frais configurables, échéanciers, réductions, bourses, factures, reçus, impayés et relances |
| Paiement externe | Connexion ultérieure à un opérateur de paiement adapté aux pays ciblés, avec rapprochement et annulation sécurisée |
| Documents | Dépôt sécurisé, droits d’accès, échéances, modèles et génération de documents scolaires |

### Priorité 2 — Communication et expérience internationale

| Module à compléter | Ce qu’il doit contenir |
|---|---|
| Notifications | E-mail transactionnel, notifications internes et éventuellement SMS/WhatsApp selon les pays, avec préférences de réception |
| Invitations réelles | Envoi d’un lien sécurisé à un professeur, élève ou responsable ; suivi d’acceptation et expiration |
| Communication école-famille | Messages ciblés, annonces, pièces jointes, accusés de lecture et règles de modération |
| Internationalisation | Langues, fuseaux horaires, devises, formats de date, numérotation et paramètres nationaux par école |
| Support Schooly | Centre d’aide, tickets, signalement d’incident et base de connaissances |
| Offre commerciale | Plans, essai, abonnements, factures Schooly, suspension pour impayé et reprise contrôlée |

## Architecture cible pour beaucoup d’écoles

| Couche | Choix actuel | Renforcement à prévoir |
|---|---|---|
| Identité | Supabase Auth | Invitations, MFA pour rôles sensibles, journalisation des connexions et politique d’accès |
| Données | Supabase PostgreSQL avec RLS et `school_id` | Index de charge, suivi des requêtes lentes, archivage d’année et audit des politiques |
| Médias | Cloudinary pour photos élèves | Règles de formats, droits d’accès, purge contrôlée et inventaire des médias |
| Application | React, Express, tRPC et Tailwind | Découpage de code, mesures de performance et tests de non-régression |
| Gouvernance | Super-administrateur plateforme | Politique de support, délégation limitée, audit trail et procédure d’escalade |

## Plan recommandé

| Étape | Objectif | Décision de sortie |
|---|---|---|
| Pilote fermé | 1 à 3 écoles, avec données non critiques ou copies de test | Tous les rôles et flux principaux sont validés |
| Bêta encadrée | 10 à 20 écoles, support direct et suivi quotidien | Les erreurs, imports et usages réels sont stabilisés |
| Lancement commercial | Facturation Schooly, support, sauvegardes, statistiques et procédures d’incident | Le produit peut accueillir de nouveaux établissements de manière répétable |
| Élargissement pays | Paiement local, langues, règles administratives et support local | Chaque pays est activé avec une configuration testée |

## Décision produit actuelle

La prochaine construction doit se concentrer sur le **registre pédagogique complet** et le **cycle financier complet**, tout en menant les tests de rôles et de cycle de vie d’école. C’est ce qui transforme Schooly d’un bon socle de gestion en produit que les établissements peuvent utiliser quotidiennement.
