# Audit de design — violainebriand.com

**Projet** : site vitrine de Violaine Briand, praticienne de la méthode Feldenkrais (Rennes & Guipry-Messac)
**Périmètre audité** : `index.html`, `stage.html`, `methode.html`, `contact.html`, `actualite.html`, `404.html`, `assets/css/style.css`, `assets/js/main.js`, `assets/fonts/`, `assets/images/`
**Date** : 29 août 2026 — commit de référence `ea1436a`
**Type** : audit statique (lecture du code + mesures calculées). Aucun navigateur n'était disponible dans l'environnement d'exécution : les ratios de contraste, les tailles calculées et les largeurs de colonnes ont donc été **mesurés par calcul**, pas observés à l'écran. Un serveur local du site est lancé en prévisualisation pour la comparaison visuelle.

---

## 1. Résumé exécutif

Le site est techniquement sain (HTML sémantique, CSS sans framework, aucune dépendance, poids léger, `aria-labelledby` et `skip-link` en place, images en WebP). L'intention esthétique — turquoise/orange, cartes arrondies, animations douces — est cohérente avec une activité de bien-être.

Mais le rendu actuel souffre de **trois défauts structurants** qui cassent la lecture et la crédibilité :

1. **L'échelle typographique est hors de contrôle** : les titres de sections (`h2` / `.widget-title`) s'affichent à **48–89 px** alors que le corps de texte est à 17 px et que le `h1` de la page d'accueil est à **27 px**. La hiérarchie est littéralement inversée (h2 > h1 > h3 > h4 dans le désordre), et le code porte les traces des rustines appliquées pour compenser (`.page-title--sm`, `h3.heading-benefits`).
2. **Les cartes n'existent visuellement qu'au survol** : `.card` a un fond blanc sur fond blanc, ni bordure ni ombre au repos, et le `translateY(-6px)` du survol est **neutralisé** par la règle `.reveal.in-view` (spécificité égale, déclarée plus loin dans la feuille). La page n'est donc qu'une longue colonne de texte non structurée.
3. **Le contraste est insuffisant sur la plupart des textes porteurs** : les liens/boutons turquoise (4,09:1), les accents orange (**2,73:1**), les textes secondaires (3,29:1) et le blanc sur fond de bouton actif (2,73:1) sont tous sous le seuil WCAG/RGAA de 4,5:1.

S'y ajoutent deux problèmes de contenu visuel visibles par les visiteurs : **deux illustrations de la page Contact sont des placeholders** (« Image non archivée »), et l'image d'accueil est floutée par un agrandissement.

### Scorecard

| Axe | Note | Tendance |
|---|---:|---|
| Hiérarchie & typographie | **3/10** | 🔴 Critique |
| Lisibilité & mise en page | **5/10** | 🟠 Majeur |
| Couleur & contraste | **4/10** | 🔴 Critique |
| Hiérarchie des surfaces (cartes/élévation) | **4/10** | 🔴 Critique |
| Navigation & structure de l'information | **6/10** | 🟠 Majeur |
| Boutons, CTA & conversion | **5/10** | 🟠 Majeur |
| Contenu visuel (images, illustrations) | **3/10** | 🔴 Critique |
| Mobile & responsive | **6/10** | 🟡 À améliorer |
| Accessibilité | **5/10** | 🟠 Majeur |
| Performance | **7/10** | 🟡 À améliorer |
| Hygiène du code | **5/10** | 🟡 À améliorer |
| **Global** | **≈ 5/10** | Potentiel élevé : les fondations sont bonnes |

---

## 2. Ce qui fonctionne déjà (à préserver)

- **Stack minimaliste et performante** : ~1 400 lignes de code au total, zéro dépendance, zéro build. Temps de chargement excellent.
- **Sémantique solide** : `<header> / <main> / <footer>`, `<article>` pour les archives, `aria-labelledby` sur chaque section, `aria-expanded` sur le burger, `skip-link`, `:focus-visible` défini.
- **Déjà responsive et accessible aux préférences utilisateur** : breakpoint unique à 48 rem, `@media (prefers-reduced-motion: reduce)` bien implémenté, styles d'impression.
- **SEO de base propre** : `title`/`description` uniques par page, `canonical`, Open Graph, `lang="fr"`, données structurées `HealthAndBeautyBusiness`, `sitemap.xml`, `robots.txt`, page 404.
- **Réutilisation propre des variables CSS** (`--teal`, `--radius`, `--space-*`, `--font-*`) : un design system existe, il est juste mal calibré. C'est une excellente base pour corriger vite.
- **Images optimisées** : WebP + JPG de secours via `<picture>`, `width`/`height` renseignés (pas de CLS), `loading="lazy"` et `fetchpriority="high"` bien placés.

---

## 3. Constats détaillés

### 3.1 🔴 T1 — Échelle typographique incohérente et hiérarchie inversée

**Constat.** Les valeurs sont définies sans échelle commune (pas de ratio, pas de modular scale) :

| Élément | Taille déclarée | Taille réelle à 1280 px | Ratio vs corps (17 px) |
|---|---|---:|---:|
| `h2` (nu) | `clamp(4.2rem, …, 5.55rem)` | **89 px** | 5,2× |
| `.entry-title` (`h3` archives) | `4.2rem` | **67 px** | 3,9× |
| `h3` (nu) | `3.66rem` | **59 px** | 3,4× |
| `h4` (nu) | `3.15rem` | **50 px** | 3,0× |
| `.widget-title` (`h2` de carte) | `3rem` | **48 px** | 2,8× |
| `h1.page-title` | `clamp(1.85rem, …, 2.6rem)` | **42 px** | 2,5× |
| `h1.page-title--sm` (accueil) | `clamp(1.35rem, …, 1.7rem)` | **27 px** | 1,6× |
| `.stage-details summary` / `h3.heading-benefits` | `1.4rem` | 22 px | 1,3× |
| corps de texte | `1.0625rem` | 17 px | 1× |

**Conséquences.**
- **Le h2 est plus gros que le h1** : sur quasiment toutes les pages, le titre de section domine le titre de page. L'œil ne sait plus où commencer.
- **Ruptures de niveaux** : `h3` (59 px) > `h2.widget-title` (48 px) > `h4` (50 px) — trois niveaux se chevauchent.
- **Rustines visibles dans le balisage** : `page-title--sm` a été ajouté sur l'accueil pour « réparer » le `h1`, et `heading-benefits` sur les `h3` de la page Contact. Un correctif global est attendu, pas des patchs locaux.
- Sur `actualite.html`, le `h1` est suivi directement de `h3` (aucun `h2`) : l'outline est techniquement invalide et les lecteurs d'écran perdent un niveau.
- À 48 px en majuscules avec `letter-spacing: 0.1em`, « LA MÉTHODE FELDENKRAIS POUR LES ENFANTS » passe sur 2 à 3 lignes dans une colonne de 864 px : le titre occupe plus d'espace que le contenu qu'il introduit.

**Piste.** Définir une échelle unique (ratio ~1,25 – parfait pour un rendu « bien-être », doux et lisible) et laisser les *utilitaires* gérer les cas particuliers. Voir §4.1.

---

### 3.2 🔴 T2 — Les cartes sont invisibles au repos, et l'effet de survol est mort

**Constat (trois bugs imbriqués).**

```css
.card { background: var(--bg);   /* #ffffff */
        border: none;
        box-shadow: none; }       /* aucune séparation au repos */
.card:hover { transform: translateY(-6px); box-shadow: var(--shadow); }

/* … plus loin dans la feuille (section Animations) … */
.reveal.in-view { transform: translateY(0) scale(1); }
```

`main.js` ajoute la classe `.reveal` à **tous** les `.card`. `.reveal.in-view` et `.card:hover` ont la même spécificité (0,2,0) ; la première étant déclarée plus tard, **elle gagne**. Le `translateY(-6px)` du survol ne s'applique donc jamais (seule l'ombre apparaît, sans le mouvement).

Même problème sur les images : `figure img { animation: floaty 6s infinite }` — une animation CSS écrase les déclarations normales de `transform`, donc `figure img:hover { transform: scale(1.02) }` est **sans effet**.

**Conséquence.** Aucune séparation visuelle entre les blocs : fond blanc sur fond blanc, la page ressemble à un long document non structuré. La seule élévation perceptible est une ombre qui apparaît brutalement sous le curseur, sans transition de position.

**Piste.**
- Donner aux cartes une existence au repos : `background: #fff; border: 1px solid var(--border); box-shadow: 0 1px 2px rgba(20,54,59,.04)`.
- Séparer les canaux de transformation : animer la révélation avec les propriétés individuelles `translate` / `scale` (qui se composent avec `transform`) au lieu de `transform`. Le survol redevient fonctionnel.
- Supprimer `floaty` sur les images (mouvement perpétuel = distraction, coût de peinture) ou le réserver à un seul élément décoratif.

```css
/* Révélation : n'utilise plus `transform`, laisse le champ libre au survol */
.reveal { opacity: 0; translate: 0 30px; scale: 0.98; filter: blur(6px);
          transition: opacity .9s, translate .9s, scale .9s, filter .9s; }
.reveal.in-view { opacity: 1; translate: 0 0; scale: 1; filter: none; }

.card { border: 1px solid var(--border);
        box-shadow: 0 1px 2px rgba(20,54,59,.05); }
.card:hover { transform: translateY(-6px); box-shadow: var(--shadow); } /* fonctionne à nouveau */
```

---

### 3.3 🔴 C1 — Contrastes insuffisants (WCAG AA / RGAA)

Ratios mesurés (formule WCAG 2.1). Seuil AA : **4,5:1** pour le texte < 24 px, **3:1** pour le texte ≥ 24 px et les éléments d'interface.

| Combinaison | Ratio | Verdict |
|---|---:|---|
| `--ink` #14363b sur blanc (titres) | 12,96 | ✅ AAA |
| `--text` #51696c sur blanc (corps) | 5,85 | ✅ AA |
| **Liens & boutons `--teal-dark` #0889a5 sur blanc** | **4,09** | ❌ AA (17 px) |
| **Blanc sur `--teal-dark` (bouton survolé)** | **4,09** | ❌ AA |
| **Blanc sur `--orange-dark` (bouton paiement survolé)** | **2,73** | ❌ |
| **`.accent` #e5851c sur blanc** (dates clés, « Réserver en ligne ») | **2,73** | ❌ |
| **`.event-date` #e5851c sur `#f4fbfb`** | **2,60** | ❌ |
| **`--muted` #7f9194** (chapo, légendes, métadonnées, sous-titre du logo) | **3,29** | ❌ AA (17 px) |
| Blanc sur `--teal` (lien d'évitement) | 2,92 | ❌ |
| **Anneau de focus `--teal` #0ca5c4 sur blanc** | **2,92** | ❌ (seuil non-texte 3:1) |
| `--text` sur `--teal-soft` (onglet actif) | 5,17 | ✅ AA |
| `.schedule .date` #0889a5 sur blanc | 4,09 | ❌ AA |

**Piste.** Assombrir trois variables — l'identité turquoise/orange est conservée, seule la valeur change. Valeurs vérifiées par calcul :

| Variable | Actuelle | Proposée | Nouveau ratio sur blanc |
|---|---|---|---:|
| `--muted` | `#7f9194` | **`#5f7174`** | 5,12 ✅ |
| `--teal-dark` (liens, boutons) | `#0889a5` | **`#07758b`** | 5,35 ✅ |
| `--teal-deep` (états actifs, fonds pleins) | `#076b80` | `#066276` | 6,96 ✅ (blanc dessus) |
| `--orange-dark` (accents, CTA paiement) | `#e5851c` | **`#a85508`** | 5,29 ✅ (blanc dessus : 5,29) |
| Anneau de focus | `--teal` | **`--teal-deep`** + liseré blanc | 6,96 ✅ |

Garder `--teal` #0ca5c4 et `--orange` #f7a23b uniquement pour les **surfaces décoratives** (dégradés, aplats, traits) — jamais pour du texte.

---

### 3.4 🔴 I1 — Deux placeholders sont en production sur la page Contact

`assets/images/iff-contemp.svg` et `assets/images/feldenkrais-li.svg` sont des **fichiers de substitution** : un rectangle gris `#f0f0f0` contenant le texte « Feldenkrais — Intégration Fonctionnelle / **Image non archivée** ». Ils sont affichés tels quels sur `contact.html`, avec une légende qui les présente comme de vraies photos.

C'est le défaut le plus pénalisant pour la crédibilité perçue : un visiteur qui découvre la praticienne lit « Image non archivée » sur deux visuels.

**Piste.** Les remplacer par de vraies photos (séance d'Intégration Fonctionnelle, leçon collective). À défaut, les retirer purement et simplement : une page sans illustration vaut mieux qu'une page avec des placeholders.

---

### 3.5 🟠 I2 — Images sous-dimensionnées ou mal dimensionnées

| Image | Taille réelle | Taille affichée (≈1440 px) | Problème |
|---|---|---|---|
| `bebe-fdk.jpg` | 300 × 190 | ~430 px de large | agrandie → flou |
| `Photo-Feldenkrais.jpg` | 362 × 573 | ~430 px de large | agrandie, et cadrage portrait dans une colonne étroite |
| `cours-collectif-photo.jpg` | 1200 × 480 | jusqu'à 816 px | correct (ratio 2,5:1 très large, peu immersif) |
| `capture.png` | 333 × 417 | ~430 px | **du texte intégré dans une image** : illisible sur écran dense, non indexé, non traduisible, et l'`alt` (« Citation sur la méthode Feldenkrais ») ne transmet pas le contenu |
| `postures-corporelles.jpg` | 514 × 200 | — | **92,7 Ko non référencés** dans le HTML : poids mort dans le dépôt |

**Piste.** Réexporter les visuels à 2× la taille d'affichage (≈ 900 px de large) ; remplacer `capture.png` par une vraie `<blockquote>` stylée (meilleur pour le SEO, l'accessibilité et le rendu retina) ; supprimer `postures-corporelles.jpg` du dépôt.

---

### 3.6 🟠 L1 — Trois largeurs de conteneur différentes sur un même site

```css
#page { max-width: none; padding: 0 clamp(1rem, 4vw, 3rem); }  /* plein écran */
.home-grid { max-width: 54rem; margin: 0 auto; }               /* 864 px, centré */
```

- **Accueil** : le bloc « Rentrée » est en pleine largeur, puis les cartes passent à 864 px centrées → **décrochage d'alignement visible** entre deux blocs qui se suivent.
- **Contact** : la première carte est pleine largeur, les grilles suivantes aussi, mais avec des ratios différents (`1fr / 1.4fr` puis `1.8fr / 1fr`) → les bords gauche/droite des colonnes ne s'alignent pas d'une section à l'autre.
- **Méthode / Contact** : aucune limite de largeur → **la mesure de ligne explose**.

Longueur de ligne estimée (corps à 17 px, police Benefits ≈ 0,5 em/caractère) :

| Viewport | Accueil (864 px) | Méthode (colonne 2/3) | Contact (colonne large) |
|---|---:|---:|---:|
| 1280 px | ~102 car. | ~90 car. | ~87 car. |
| 1920 px | ~102 car. | **~140 car.** | **~135 car.** |

La fourchette confortable est de **45 à 75 caractères**. Au-delà, l'œil perd le début de la ligne : c'est la cause n°1 de « texte qu'on ne lit pas ». Même l'accueil à 102 caractères est trop large.

**Piste.**
```css
#page     { max-width: 76rem; margin-inline: auto; }   /* socle commun */
.prose, .card > p, .info-list, .schedule { max-width: 68ch; }  /* confort de lecture */
.home-grid, .method-grid, .contact-grid { /* mêmes gouttières, même max-width */ }
```
Et faire rentrer le bloc « Rentrée » dans la grille pour aligner tous les blocs.

---

### 3.7 🟠 L2 — Un seul point de rupture, aucune optimisation tablette/grand écran

Le CSS ne définit qu'un breakpoint (`max-width: 48rem`, soit 768 px). Entre 769 px et 1024 px, la grille deux colonnes de `methode.html` donne une colonne de texte d'environ 440 px (correct) mais une colonne image de 220 px, alors que les images font 300 px de large → débordement et redimensionnement. Sur grand écran (≥1600 px), rien n'est borné (voir L1).

**Piste.** Ajouter un palier intermédiaire (`min-width: 64rem`) pour basculer l'accueil en 2 colonnes (contenu principal + colonne latérale « prochaines dates / contact »), et un palier large pour borner `#page`.

---

### 3.8 🟠 N1 — Navigation : pas de persistance, pas de raccourci de contact

- Le header n'est **pas sticky** : sur `actualite.html` (8 articles, plusieurs écrans), il faut remonter en haut de page pour changer de page.
- **Aucun numéro de téléphone ni e-mail dans l'en-tête**, alors qu'il s'agit d'un service de proximité dont la conversion passe par l'appel ou le mail. Ils n'apparaissent qu'en pied de page, après tout le contenu.
- Le libellé « Informations pratiques » pour l'accueil est un intitulé de *rubrique*, pas d'accueil ; « Archive » est vague (stages passés ?) ; « Contact & audio » mélange deux intentions.
- Le menu mobile ne se ferme pas au clic sur un lien, ni avec `Échap`, ni au clic extérieur.
- `aria-controls="primary-menu"` pointe vers le `<ul>` (correct) mais le conteneur `.menu` n'a pas d'id : le lien n'est pas explicite.

**Piste.** Header collant et compact au scroll (logo réduit + téléphone visible), intitulés orientés bénéfice (« Accueil », « Cours & tarifs », « La méthode », « Pratiquer chez soi », « Stages passés », « Contact »), fermeture du menu sur `Échap`/clic extérieur.

---

### 3.9 🟠 B1 — Aucune hiérarchie entre les boutons

Tous les appels à l'action partagent le **même style contour** `.button` (fond transparent, liseré turquoise). Il n'existe pas de bouton primaire plein. Résultat : « La méthode & son fondateur », « Contact » et « Réserver un workshop » ont le même poids visuel — le visiteur ne sait pas quoi faire en premier.

Autres points :
- **Rayons incohérents** : `--radius: 18px` pour les cartes, `10px` pour `.button`, `8px` pour les boutons Stripe. Trois valeurs pour des objets voisins.
- **Iconographie non significative** : dans `.pay-list`, « Cours à l'unité » et « Leçon individuelle » partagent la même icône *personne*, « Forfait annuel » un calendrier, « Carte de 10 cours » une carte bancaire. Le code n'est pas lisible : on ne comprend pas que ce sont des moyens de paiement.
- **Doublons** : sur l'accueil, « Programme des workshops » et « Voir les stages » pointent tous deux vers `stage.html`, sans distinction.
- Les liens Stripe s'ouvrent dans un nouvel onglet (`target="_blank"`) sans le signaler (ni icône, ni texte, ni `aria-label`).
- **Le produit « Feldenkrais'om »** (leçons audio à domicile, 3 formules de 49 € à 210 €) est un vrai produit payant… **uniquement présent sur la page Contact**. Invisible depuis l'accueil.

**Piste.** Créer trois niveaux : `button--primary` (fond `--teal-deep`, texte blanc, plein), `button` (contour), `button--pay` (contour orange, **une seule icône commune** : cadenas ou carte, plus le prix). Un seul CTA primaire par écran. Remonter « Pratiquer chez soi » sur l'accueil, ou lui dédier une page.

---

### 3.10 🟡 A1 — Accessibilité : les fondamentaux sont là, les détails manquent

Points positifs réels : `lang="fr"`, skip-link, `:focus-visible`, `prefers-reduced-motion`, `aria-labelledby`, `alt` renseignés, SVG décoratifs en `aria-hidden`.

À corriger :
- Contrastes (§3.3) — point bloquant RGAA 3.2.
- **Anneau de focus insuffisant** (2,92:1) et `:focus-visible { border-radius: 2px }` appliqué globalement : les éléments changent de forme au focus.
- **Hauteur des cibles tactiles** : les boutons font ~40 px (recommandation : 44 × 44 px minimum).
- `figure img` animé en permanence (`floaty`) : gêne pour les troubles vestibulaires — heureusement neutralisé par `prefers-reduced-motion`.
- `will-change: opacity, transform, filter` posé sur **tous** les `.reveal` et jamais retiré après la révélation : des calques GPU restent alloués pour toute la durée de la visite.
- Liens Stripe en `target="_blank"` sans avertissement (critère RGAA 6.5 / 13.1).

---

### 3.11 🟡 P1 — Performance : excellent socle, trois optimisations faciles

- **Polices** : les deux woff2 totalisent 73 Ko (correct), mais les `.ttf` de repli (246 Ko) sont dans le dépôt et jamais utilisés par les navigateurs modernes. Surtout, **aucun `<link rel="preload">`** : `Benefits` (corps de texte, 55 Ko) est découverte tard → FOUT visible. La pile de repli `'Quicksand'` n'est pas chargée : en cas d'échec du woff2, le rendu bascule sur Helvetica et la personnalité du site disparaît.
- **`background-attachment: fixed`** sur `body` : ignoré (et coûteux) sur iOS Safari, source de saccades au défilement sur Android. Remplacer par un dégradé fixe sur un pseudo-élément ou simplement le retirer.
- **Décors animés** : deux pseudo-éléments de 360 px avec `filter: blur(70px)` animés en boucle (`drift`) + `floaty` sur les images + `barGrow` : du travail de composition permanent pour un gain esthétique marginal.
- **Base technique excellente par ailleurs** : pas de JS bloquant (`defer`), images WebP, `loading="lazy"`, `fetchpriority="high"` sur l'image d'accueil.

---

### 3.12 🟡 H1 — Hygiène du code : vestiges d'une ancienne maquette

- **Classes mortes dans le HTML** : `home`, `home-col-center`, `home-col-left`, `home-col-right`, `page_item`, `site` — aucune n'a de règle CSS. Elles trahissent l'ancienne mise en page 3 colonnes de l'accueil (cf. `.agents/skills/testing-static-site/SKILL.md`, qui décrit encore cette architecture).
- **Sélecteurs CSS orphelins** : `.post-featured` (aucune occurrence dans le HTML), `.screen-reader-text`.
- **Styles en ligne** : `style="margin-top: var(--space-md)"` sur l'accueil, `style="margin-bottom: var(--space-md)"` sur Contact, `style="margin-top: var(--space-sm)"` sur Contact. À déplacer en classes utilitaires (`mt-md`, `stack`…).
- **Blocs commentés « ancienne colonne gauche / droite »** : le commentaire raconte l'historique de la migration, pas la structure actuelle.
- **Le fichier de compétence `.agents/skills/…/SKILL.md` est obsolète** sur deux points : il décrit un bug du menu mobile (`.menu-toggle { display: none }` écrasant la règle média) qui a **déjà été corrigé** (`display: flex`, correctement scopé), et il décrit une architecture 3 colonnes qui n'existe plus.
- `og:type` est `article` sur `stage/methode/contact` (devrait être `website`) ; `og:image` est la même image 1200 × 480 sur les 5 pages (format conseillé : 1200 × 630) ; `sitemap.xml` n'a pas de `lastmod`.
- **Pas de mentions légales, ni CGV, ni politique de confidentialité** : obligatoire pour un site professionnel français (LCEN), et d'autant plus attendu qu'il encaisse des paiements via Stripe.

---

### 3.13 🟡 S1 — Structure de l'accueil : le pratique est enterré sous le biographique

Ordre actuel de l'accueil :
1. « Rentrée 2026-2027 » (pleine largeur)
2. **Violaine Briand** — biographie + photo de groupe
3. **Cours collectifs** — horaires, tarifs, 4 boutons de paiement
4. **Workshops & stages**

Problèmes : le premier bloc de contenu est une biographie, alors que le visiteur cherche « où, quand, combien » ; **aucun portrait de la praticienne** en grand (la seule photo est un cours collectif, sans légende nominative) ; pas de réassurance (formation 2012, association Feldenkrais France, « 1er cours offert » relégué dans un paragraphe) ; **aucun témoignage**.

Par ailleurs, le `h1` de l'accueil est « Informations pratiques » alors que la balise `<title>` vise « Feldenkrais à Rennes : cours, ateliers et tarifs ». Le mot-clé principal n'est **dans aucun titre** de la page d'accueil — un manque côté SEO autant que côté clarté.

---

## 4. Pistes d'amélioration — propositions chiffrées

### 4.1 Échelle typographique proposée (ratio ≈ 1,25)

| Jeton | Usage | Valeur | 1280 px | Ancienne valeur |
|---|---|---|---:|---:|
| `--fs-display` | titre héros accueil (`h1`) | `clamp(2.25rem, 1.5rem + 2.6vw, 3.5rem)` | 56 px | 27 px |
| `--fs-h1` | `h1` des pages internes | `clamp(1.9rem, 1.4rem + 1.6vw, 2.6rem)` | 42 px | 42 px |
| `--fs-h2` | `h2`, `.widget-title` | `clamp(1.5rem, 1.25rem + 0.8vw, 2rem)` | 32 px | **48–89 px** |
| `--fs-h3` | `h3`, titres d'articles | `1.375rem` | 22 px | **59–67 px** |
| `--fs-h4` | `h4`, intertitres | `1.125rem` | 18 px | **50 px** |
| `--fs-lead` | chapo | `1.1875rem` | 19 px | 17,6 px |
| `--fs-body` | corps | `1.0625rem` | 17 px | 17 px |
| `--fs-sm` | métadonnées, légendes | `0.9375rem` | 15 px | 15 px |

Effets attendus : hiérarchie cohérente (h1 > h2 > h3 > h4), `h2` encore 1,9× le corps (présence conservée mais lisible), disparition de `page-title--sm` et `heading-benefits`, et gain de place vertical important sur toutes les pages.

À appliquer aussi : `line-height: 1.25` sur les titres, `1.75` sur le corps, `max-width: 68ch` sur les paragraphes, et suppression du `text-transform: uppercase` sur les titres longs (le garder pour les libellés courts uniquement).

### 4.2 Palette révisée (valeurs vérifiées)

| Jeton | Actuel | Proposé | Rôle | Ratio sur blanc |
|---|---|---|---|---:|
| `--ink` | `#14363b` | inchangé | titres | 12,96 ✅ |
| `--text` | `#51696c` | inchangé | corps | 5,85 ✅ |
| `--muted` | `#7f9194` | **`#5f7174`** | secondaire | 5,12 ✅ |
| `--teal` | `#0ca5c4` | inchangé | décor uniquement | 2,92 ⚠️ |
| `--teal-dark` | `#0889a5` | **`#07758b`** | liens, boutons | 5,35 ✅ |
| `--teal-deep` | `#076b80` | **`#066276`** | fonds pleins, focus | 6,96 ✅ |
| `--orange` | `#f7a23b` | inchangé | décor uniquement | 2,06 ⚠️ |
| `--orange-dark` | `#e5851c` | **`#a85508`** | accents, CTA paiement | 5,29 ✅ |

### 4.3 Nouvelle structure de la page d'accueil

```
┌──────────────────────────────────────────────────────────────────┐
│ HEADER collant · Méthode Feldenkrais · Violaine Briand  06 19…   │
├──────────────────────────────────────────────────────────────────┤
│  HÉROS : portrait de Violaine (grand)      Méthode Feldenkrais   │
│                                            à Rennes & Guipry     │
│                                            ─────────────────     │
│                                            Retrouver de          │
│                                            l'aisance dans vos    │
│                                            mouvements…           │
│                                            [ Réserver ] [ La     │
│                                              méthode ]           │
│                                            ✓ 1er cours offert    │
├──────────────────────────────────────────────────────────────────┤
│  PROCHAINES DATES (3 cartes horizontales : date + intitulé)      │
├──────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐      │
│  │ Cours        │ │ Leçons       │ │ Workshops & stages   │      │
│  │ collectifs   │ │ individuelles│ │                      │      │
│  │ mardi/jeudi  │ │ sur RDV      │ │ samedis + week-ends  │      │
│  │ 18 € · 358 € │ │ 70 €         │ │ 55 € · 230 €         │      │
│  │ [Réserver]   │ │ [Réserver]   │ │ [Voir le programme]  │      │
│  └──────────────┘ └──────────────┘ └──────────────────────┘      │
├──────────────────────────────────────────────────────────────────┤
│  Pratiquer chez soi — Feldenkrais'om · 3 formules dès 49 €  [→]  │
├──────────────────────────────────────────────────────────────────┤
│  Qui suis-je · portrait + formation 2012 + Feldenkrais France    │
│  Témoignages (3 citations)                                       │
├──────────────────────────────────────────────────────────────────┤
│  CONTACT : tél · mail · cabinet · carte · horaires               │
└──────────────────────────────────────────────────────────────────┘
```

Bénéfices : le « où / quand / combien » est au-dessus de la ligne de flottaison ; une offre par carte avec son prix et son CTA ; le produit audio remonté ; portrait et preuve sociale pour la confiance ; un seul CTA primaire par zone.

### 4.4 Système de surfaces

| Niveau | Style | Usage |
|---|---|---|
| `surface-page` | `#fff` + dégradés très doux | fond |
| `surface-card` | `#fff`, `border: 1px solid var(--border)`, `box-shadow: 0 1px 2px rgba(20,54,59,.05)` | repos |
| `surface-card--soft` | `--bg-soft` `#f4fbfb` | mise en avant (Rentrée, offres) |
| `surface-card--hover` | `transform: translateY(-6px)`, `box-shadow: var(--shadow)` | survol |

Un seul rayon de référence : **14 px** pour les cartes et les boutons (12 px sur les petits éléments), 999 px uniquement pour les pastilles de navigation.

---

## 5. Feuille de route

### Vague 1 — Correctifs rapides (~2 h, risque nul)
1. Remplacer/supprimer les deux SVG placeholders « Image non archivée » (I1).
2. Appliquer la palette contrastée du §4.2 (C1) — 4 variables à changer.
3. Donner une bordure + ombre au repos aux `.card` (T2).
4. Corriger la révélation avec `translate`/`scale` pour réactiver les survols (T2).
5. Supprimer l'animation `floaty` sur les images.
6. Remplacer `background-attachment: fixed` par un dégradé statique (P1).
7. Nettoyer les classes mortes, les styles en ligne et `postures-corporelles.jpg` (H1).
8. Mettre à jour `SKILL.md` (bug déjà corrigé, architecture obsolète).

### Vague 2 — Refonte de la hiérarchie (~1 journée)
9. Appliquer l'échelle typographique du §4.1 ; supprimer `.page-title--sm` et `h3.heading-benefits` ; revoir les niveaux de titres sur `actualite.html` (h1 → h2) et `stage.html` (« Tarifs » en h3).
10. Unifier les conteneurs : `#page` borné à 76 rem, mesure de ligne ≤ 68 caractères, rentrée du bloc « Rentrée » dans la grille (L1).
11. Créer `button--primary` et `button--pay` ; une seule icône pour le paiement ; supprimer les CTA dupliqués (B1).
12. Header collant avec téléphone visible ; menu mobile fermé par `Échap`/clic extérieur (N1).
13. Précharger les polices (`<link rel="preload" as="font">`) et retirer `will-change` après révélation (P1, A1).

### Vague 3 — Refonte de l'accueil et contenus (~3 à 5 jours)
14. Nouvelle page d'accueil selon le wireframe du §4.3 : héros avec portrait, offres en 3 cartes chiffrées, Feldenkrais'om, témoignages, contact (S1).
15. `h1` de l'accueil aligné sur la requête cible (« Méthode Feldenkrais à Rennes ») (S1).
16. Shooting ou sélection de visuels réels à la bonne taille ; `capture.png` transformé en `<blockquote>` (I2).
17. Pages **Mentions légales / CGV / Confidentialité** ; breadcrumb ; `og:image` 1200 × 630 ; `lastmod` dans le sitemap (H1).
18. Ajout d'un palier responsive `min-width: 64rem` (L2).

---

## 6. Comment vérifier les corrections

```bash
cd /home/user/Violaine-Briand && python3 -m http.server 8080   # déjà lancé en prévisualisation
```

- **Contraste** : extension *WCAG Color Contrast Checker* ou `DEVTOOLS → Inspect → Accessibility → Contrast`.
- **Hiérarchie** : `DEVTOOLS → Lighthouse → Accessibility` + outline des titres (extension *HeadingsMap*).
- **Longueur de ligne** : dans la console, mesurer la largeur d'un paragraphe et viser 45–75 caractères (≈ 600–700 px à 17 px).
- **Débordement horizontal** :
  ```js
  document.documentElement.scrollWidth === document.documentElement.clientWidth
  ```
- **Survol des cartes** : vérifier que le `translateY` s'applique (onglet *Computed* → `transform` non nul au survol).
- **Préférences utilisateur** : activer « réduire les animations » dans le système et recharger — plus aucun mouvement ne doit subsister.

---

## 7. Conclusion

Le socle technique est bon et le parti pris couleur fonctionne. Le site souffre d'un **calibrage**, pas d'une refonte complète : une échelle typographique à rebâtir, trois variables de couleur à assombrir, des cartes à faire exister au repos, et deux placeholders à remplacer. Les huit correctifs de la vague 1 (≈ 2 h) corrigent l'essentiel du ressenti visuel et de l'accessibilité sans toucher à la structure ; la vague 2 (≈ 1 journée) règle la hiérarchie et la cohérence ; la vague 3 transforme l'accueil en véritable outil de conversion.

*Rapport produit à partir d'une analyse statique du code et de mesures calculées (contrastes WCAG, tailles en px, largeurs de colonnes). Aucune capture d'écran n'a pu être générée dans cet environnement.*
