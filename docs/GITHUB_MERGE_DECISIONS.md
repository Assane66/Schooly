# Fusion du code GitHub Schooly

## Constat d’architecture

Le code récemment poussé sur `main` est une application **Next.js 14**. Son store React utilise des jeux de données locaux (`mock-db`) pour les écoles, élèves, paiements, notes et abonnements. L’application Schooly déployée repose déjà sur Supabase, avec des politiques RLS multi-écoles, un contrôle d’approbation et un rôle super-administrateur.

Une fusion brute des fichiers Next.js remplacerait l’architecture en cours et réintroduirait des données simulées. La fusion est donc effectuée par **fonction métier**, en conservant les parcours et structures UX utiles, puis en les raccordant aux tables Supabase réelles.

| Fonction du dépôt GitHub | Décision de fusion | État |
|---|---|---|
| Console super-administrateur | Reprise du principe de supervision, mais avec approbation réelle des écoles et rôles RLS | Intégré |
| Préinscription publique par code école | Reprise du parcours, avec procédures Supabase publiques contrôlées et dossier réel | Intégré |
| Traitement des demandes | Acceptation ou refus depuis l’espace école ; l’acceptation crée l’élève et son inscription annuelle | Intégré |
| Données de démonstration (`mock-db`) | Non reprises : elles ne doivent pas remplacer les données réelles des écoles | Écarté |
| Pages Next.js restantes | À porter progressivement vers l’application actuelle après revue, sans remplacement destructif du socle connecté | Planifié |

## Protection du dépôt

Le dépôt distant a été forcé vers une nouvelle histoire sans ancêtre commun avec la version locale. Les adaptations Supabase sont donc réalisées sur la branche locale `manus/supabase-integration`. Cette précaution évite d’écraser le code Next.js que le propriétaire vient de pousser sur `main`.
