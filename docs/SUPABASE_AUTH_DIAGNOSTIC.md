# Diagnostic authentification Schooly

Date de vérification : 22 août 2026.

La configuration Supabase de production pointe encore vers `http://localhost:3000` comme **Site URL** et aucune URL de redirection n’est autorisée. Cette configuration empêche les liens de confirmation et de récupération de mot de passe de renvoyer de manière fiable vers le domaine Schooly publié.

## Correction requise

| Paramètre Supabase | Valeur à appliquer |
|---|---|
| Site URL | `https://schoolysaas-cd9yrqmb.manus.space` |
| Redirect URL autorisée | `https://schoolysaas-cd9yrqmb.manus.space/**` |

Après cette correction, les liens de confirmation et de récupération générés par Schooly pourront revenir vers `/connexion?mode=confirm` et `/connexion?mode=reset` sur le domaine publié.

## Correction appliquée

Le 22 août 2026, le Site URL a été remplacé par `https://schoolysaas-cd9yrqmb.manus.space` et l’URL de redirection `https://schoolysaas-cd9yrqmb.manus.space/**` a été ajoutée dans Supabase. Une inscription directeur doit maintenant être relancée avec une adresse e-mail non encore enregistrée afin de valider le nouveau lien de confirmation.

## Identité d’e-mail

Le nom « SuperBIZ » provient de la configuration d’e-mail par défaut Supabase. Il doit être remplacé dans **Authentication → Emails** par « Schooly » et les modèles de confirmation/récupération doivent employer une rédaction Schooly professionnelle.

## Contrainte constatée

Le tableau **Authentication → Emails** indique que les modèles par défaut sont utilisés et qu’un **SMTP personnalisé** doit être configuré avant de pouvoir modifier le sujet et le contenu des e-mails. Les liens de redirection sont maintenant corrigés ; le remplacement de « SuperBIZ » nécessite donc le paramétrage d’un expéditeur SMTP professionnel pour Schooly.

## Cause identifiée de la non-réception

La configuration actuelle utilise encore le fournisseur e-mail intégré Supabase. Le tableau de bord affiche une limite de **2 e-mails par heure**. Sans SMTP personnalisé, Supabase n’autorise en outre les envois qu’aux adresses pré-autorisées, c’est-à-dire aux membres de l’équipe du projet. Une adresse de directeur nouvellement créée, extérieure à cette équipe, ne peut donc pas recevoir de confirmation de façon fiable.

Le correctif durable consiste à activer un SMTP personnalisé avec un expéditeur Schooly, puis à configurer le domaine d’envoi avec SPF, DKIM et DMARC chez le prestataire retenu. Cela permettra l’envoi à tous les directeurs et l’ajustement de la limite d’envoi aux besoins réels du produit.
