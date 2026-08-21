# Pistes de design — Schooly

## Trois approches explorées

| Thème | Très brève introduction | Probabilité |
| --- | --- | --- |
| **Campus Graphique** | Un poste de pilotage clair et éditorial, inspiré de la signalétique universitaire et des journaux de bord. Il exprime la confiance sans froideur. | 0,07 |
| **Bibliothèque Vivante** | Une interface chaleureuse, feutrée et presque tactile, où les repères administratifs prennent la forme d’objets documentaires. | 0,04 |
| **Atelier Solaire** | Une expérience lumineuse et structurée inspirée des cahiers pédagogiques contemporains, avec une cadence visuelle nette et accueillante. | 0,09 |

## Direction retenue — Campus Graphique

### Mouvement de design
Une interprétation numérique de la **signalétique universitaire moderniste** : des repères typographiques forts, des aplats bleu nuit et bleu cobalt, un papier ivoire lumineux et des données présentées comme des éléments éditoriaux fiables.

### Principes directeurs
1. **Clarté avant décoration** : chaque zone identifie immédiatement un statut, une personne ou une action.
2. **Rigueur chaleureuse** : la précision opérationnelle est contrebalancée par des tons de craie, de sable et des visages dans les avatars.
3. **Hiérarchie éditoriale** : grandes informations, métadonnées compactes et signaux colorés suivent une grammaire de journal de bord.
4. **Rythme asymétrique** : la page s’organise autour d’un panneau latéral stable et d’une zone de travail vivante, non autour d’une grille centrée impersonnelle.

### Philosophie de la couleur
Le **bleu cobalt** matérialise l’action, la confiance et l’unité de l’établissement. Le bleu nuit donne la profondeur au repère de navigation. L’ivoire atténué évite le blanc clinique et évoque le papier scolaire. Le vert sauge est réservé aux résultats confirmés, le corail aux points à suivre et l’or doux aux informations remarquables.

### Paradigme de mise en page
Un **poste de pilotage ancré** : la navigation verticale sombre reste le point cardinal ; l’espace principal déroule un briefing de journée, des indicateurs contextuels et deux colonnes de suivi. Sur écran mobile, la barre d’outils devient le point d’entrée et les blocs deviennent une pile éditoriale facile à parcourir.

### Éléments signatures
- Une **ligne de repérage cobalt** sur les éléments actifs et les valeurs clés.
- Des **pastilles de présence** et mini-jauges à texture de papier pour les signaux de terrain.
- Des **cartes à angles subtilement contrastés** : données structurées sur ivoire, actions directes sur bleu.

### Philosophie d’interaction
Les interactions confirment l’action sans distraire : une sélection déplace légèrement le repère cobalt, les boutons répondent avec un appui bref et les actions de démonstration s’expliquent par un retour en bas de page. Les éléments non implémentés sont explicitement annoncés comme des aperçus.

### Animation
Les panneaux apparaissent avec une courte transition d’opacité et de translation (maximum 220 ms, easing `cubic-bezier(0.23, 1, 0.32, 1)`). Les compteurs et progressions se mettent à jour sans effet de rebond ; les survols ne modifient que l’ombre et la position. Les mouvements non essentiels sont désactivés lorsque les préférences de réduction des animations sont actives.

### Système typographique
**DM Sans** assure une lecture dense et précise pour l’interface ; **Fraunces** est utilisée avec parcimonie pour les titres de contexte et les messages de pilotage. Les intitulés de données sont en capitales espacées, les chiffres importants en DM Sans semi-gras, les grandes phrases en Fraunces sans excès.

### Essence de marque
**Schooly est le poste de pilotage quotidien des établissements qui veulent faire circuler l’information scolaire avec calme et précision.**

Personnalité : **rassurante, méthodique, humaine**.

### Voix de marque
La voix est directe, constructive et respectueuse du temps des équipes. Les titres parlent d’une situation réelle ; les appels à l’action indiquent précisément ce qui se passe ensuite.

> « La journée est structurée. Passons aux priorités. »

> « Enregistrer une présence, sans perdre le fil. »

### Logotype et emblème
Un emblème sans texte en forme de **S-piste**, ruban cobalt replié autour d’un point clair : il évoque à la fois un chemin d’apprentissage, un lien entre acteurs et la première lettre de Schooly. Dans l’interface, il est associé à une logotype DM Sans aux proportions généreuses.

### Couleur de signature
**Cobalt Schooly — `#2B59FF`** : un bleu franc, vif mais suffisamment dense pour l’usage professionnel.

## Style Decisions

- Les écrans Schooly sur desktop conservent un **poste de commande bleu nuit ancré** ; la navigation est un point cardinal, non un simple menu secondaire.
- La **ligne de repérage cobalt** est récurrente dans la navigation active, les chiffres importants et les actions prioritaires ; elle prévaut sur les effets décoratifs.
- Les photographies de campus sont cadrées comme des **preuves documentaires** : elles reçoivent une annotation éditoriale et une teinte institutionnelle plutôt qu’un traitement de visuel marketing.
