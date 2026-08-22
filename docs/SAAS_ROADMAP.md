# Schooly — Feuille de route produit internationale

## Vision produit

Schooly est une plateforme multi-écoles qui aide les établissements à administrer les inscriptions, la scolarité, les équipes, les finances et la communication dans un environnement sécurisé. Une école garde la maîtrise de ses données, tandis que la plateforme Schooly contrôle l’activation, la suspension et l’accompagnement des établissements sans jamais supprimer leurs informations métier.

> La première version doit être solide pour le primaire, le collège et le lycée. Les fonctionnalités universitaires seront traitées dans un modèle distinct, afin de ne pas fragiliser la gestion scolaire générale.

## Fondations de lancement

| Domaine | Fonctions indispensables | État cible |
|---|---|---|
| Gouvernance plateforme | Approbation, avertissement, pause, reprise, historique et conservation des données | Super-administrateur unique et traçable |
| Identité et sécurité | Comptes individuels, rôles, permissions, invitations, réinitialisation sécurisée | Aucun mot de passe partagé |
| Établissement | Années, classes, niveaux, élèves, équipe, documents et calendrier | Données isolées par école |
| Pédagogie | Matières, affectations, présences, évaluations, notes et bulletins | Accès limité à chaque rôle |
| Finances | Frais configurables, échéances, paiements, reçus, impayés, avertissements et QR | Suivi par élève et par période |
| Admissions | Préinscription publique, traitement interne, import/export CSV et inscription annuelle | Admission contrôlée et traçable |

## Espaces utilisateurs

| Espace | Utilisateurs | Capacités principales |
|---|---|---|
| Plateforme | Super-administrateur Schooly | Écoles, avertissements, pause/reprise, activité agrégée et support |
| Direction | Propriétaire et direction d’école | Paramètres, personnel, finances, admissions et pilotage |
| Personnel | Professeurs, secrétaire, comptable, vie scolaire | Actions limitées aux permissions accordées |
| Élève et famille | Élève ou responsable associé | Profil, échéances, présences, résultats, documents et messages |

## Priorités après le socle actuel

1. Finaliser les contrôles de cycle de vie d’une école : avertissement, pause, reprise, historique et affichage dans l’espace concerné.
2. Mettre en place les comptes individuels professeur et élève, avec invitation ou mot de passe temporaire individuel, changement obligatoire et récupération sécurisée.
3. Ajouter les imports et exports CSV, les reçus de paiement, le suivi des impayés et les notifications associées.
4. Ajouter le portail élève/famille, sans créer de mot de passe commun ni de portail parent séparé imposé.
5. Compléter la pédagogie : matières, affectations professeur-classe, évaluations, notes, bulletins et historiques.
6. Ajouter messagerie et notifications, journal d’activité, langues, devises, fuseaux horaires et options pays pour préparer le déploiement international.

## Règles non négociables

| Règle | Application dans Schooly |
|---|---|
| Conservation des données | Une pause ou une suspension bloque l’accès, mais n’efface jamais les données de l’école. |
| Cloisonnement | Une école ne peut jamais lire les élèves, finances ou documents d’une autre école. |
| Traçabilité | Chaque décision de plateforme, paiement, avertissement et changement de rôle doit être historisé. |
| Sécurité des comptes | Les identifiants sont individuels ; les rôles sensibles sont limités et révocables. |
| Évolutivité | Les objets métier restent configurables par école : niveau, série, frais, calendrier et règles locales. |
