# Schooly — Modèle produit proposé

## Principe directeur

Schooly comporte deux mondes volontairement séparés. Le premier est la **plateforme Schooly**, exclusivement accessible au super-administrateur. Le second est l’**espace établissement**, accessible aux directeurs, équipes, professeurs et élèves d’une seule école. Cette séparation doit rester nette dans la navigation, les données consultables et les autorisations.

| Espace | Public autorisé | Ce qui est visible |
|---|---|---|
| `/administration` et `/supervision` | Super-administrateur uniquement | Écoles, statut, coordonnées, ville, nombre agrégé d’élèves, activité et abonnement ; jamais les noms, notes ou dossiers des élèves |
| `/app` | Directeur et personnel d’une école approuvée | Données de leur école uniquement |
| `/inscription/:code-ecole` | Familles et futurs élèves | Formulaire de préinscription d’une école approuvée uniquement |
| Portail élève | Élève concerné | Son profil, ses présences, ses notes, ses échéances et ses documents |

## Rôles et responsabilités

| Rôle | Création | Capacités principales |
|---|---|---|
| Super-administrateur | Désigné par configuration serveur, jamais par inscription libre | Approuve, refuse ou suspend les écoles ; consulte des statistiques agrégées et coordonnées d’école |
| Directeur | Crée son école, sous validation | Gère l’ensemble de son établissement : classes, élèves, professeurs, inscriptions, paiements et paramètres |
| Professeur | Créé ou invité par le directeur | Consulte ses classes ; saisit présences et notes dans le périmètre qui lui est attribué |
| Personnel administratif / comptable | Créé ou invité par le directeur | Gère admissions, élèves, encaissements, exports et documents selon ses droits |
| Élève | Créé par l’école ou admis depuis une préinscription | Consulte son propre espace, sans accès aux données d’autrui |

## Onboarding directeur recommandé

Le directeur crée son compte, renseigne les informations de son école, puis Schooly l’aide à créer sa structure. L’assistant de configuration ne crée rien sans confirmation : il **suggère** des niveaux et des classes que le directeur peut accepter, modifier ou ignorer.

| Niveau choisi | Suggestions initiales | Personnalisation toujours possible |
|---|---|---|
| Primaire | CI, CP, CE1, CE2, CM1, CM2 | CI-A, CI-B, CP-A, effectifs et appellations locales |
| Collège | 6e, 5e, 4e, 3e | Classes, options et groupes propres à l’école |
| Lycée | Seconde, Première, Terminale | Séries S, L et variantes définies par l’établissement |
| Université | À isoler dans une phase ultérieure | Facultés, filières, semestres, unités d’enseignement et crédits exigent un modèle différent |

> Proposition de cadrage : la première version opérationnelle couvre **primaire, collège et lycée**. L’université est ajoutée dans une seconde phase, avec ses propres objets métier, afin de ne pas bloquer ou compliquer les écoles avant le lancement.

## Admission et création des élèves

Schooly doit proposer les deux voies, qui se complètent : le directeur peut créer/importer les élèves, et les familles peuvent soumettre une préinscription via un lien ou un QR code propre à l’école. La demande reste à l’état `pending` tant qu’un membre habilité ne l’accepte pas. L’acceptation crée l’élève et, si une classe est demandée, son inscription annuelle.

Les imports et exports doivent être proposés au format CSV/XLSX, avec un modèle téléchargeable, une prévisualisation, des erreurs ligne par ligne et une validation explicite avant écriture en base.

## Identité des élèves et des professeurs

Chaque personne doit avoir un identifiant individuel. Un mot de passe identique pour tous les élèves ou tous les professeurs empêcherait une traçabilité fiable, rendrait les comptes impossibles à révoquer individuellement et exposerait l’école si ce secret circule.

Le mécanisme recommandé est le suivant : Schooly génère un **identifiant individuel** et un **mot de passe temporaire individuel** au moment de la création. L’école remet ce bordereau à la personne, qui doit le modifier à la première connexion. Pour faciliter le travail administratif, le directeur peut générer un nouveau mot de passe temporaire sans connaître l’ancien mot de passe de l’élève ou du professeur.

L’adresse de connexion peut prendre une forme stable, par exemple `alhassane.bah.13@ecole-horizon.schooly`, tout en utilisant un identifiant technique non devinable en interne. Le domaine réel de l’école peut être ajouté ultérieurement si l’établissement possède et configure son propre domaine.

## Paiements et QR code

Les paiements sont suivis par élève et par période mensuelle configurable par école. Le directeur ou le comptable voit une grille allant, par exemple, d’octobre à juillet, avec les états **réglé**, **partiel**, **impayé**, **exonéré** ou **en retard**. Les mois ne doivent pas être figés : chaque école choisit son calendrier et ses montants.

La carte élève contient un QR code à jeton opaque. Le QR code ne doit pas embarquer le nom, le téléphone, l’e-mail ou les paiements en clair. Après scan par un membre authentifié de l’école, Schooly affiche la fiche de paiement autorisée : identité, classe, mois réglés et impayés. Le jeton peut être désactivé ou régénéré à tout moment.

## Fonctionnalités à ajouter après le socle

Les fonctionnalités suivantes complètent le modèle sans bloquer le lancement : affectations professeur–matière–classe, bulletins et calculs de moyennes, cartes élève imprimables, scanner QR au portail, notifications aux familles, modules de documents et règles fines d’export.
