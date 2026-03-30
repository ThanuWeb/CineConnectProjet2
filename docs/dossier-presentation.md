# Dossier de Présentation — CineConnect

**Membres du groupe :** Tanushan, Bérénice, Thomas
**Repository :** https://github.com/ThanuWeb/CineConnectProjet2

---

## 1. Introduction

### Contexte et problème à résoudre

Les amateurs de cinéma manquent d'un espace centralisé pour découvrir des films, partager leurs avis et discuter en temps réel avec d'autres cinéphiles.

### Objectif principal du projet

**CineConnect** est une application web qui permet aux utilisateurs de parcourir un catalogue de films, publier des critiques notées, gérer une liste de favoris, ajouter des amis et discuter en temps réel via un chat intégré — le tout sur une seule plateforme.

### Public cible et valeur apportée

- **Public cible** : cinéphiles, étudiants, groupes d'amis souhaitant partager leur passion du cinéma.
- **Valeur** : une expérience sociale et communautaire autour du cinéma, combinant découverte, critique et discussion instantanée.

---

## 2. Cahier des charges

### Fonctionnalités essentielles (MVP)

| Fonctionnalité          | Description                                                              |
| ----------------------- | ------------------------------------------------------------------------ |
| Inscription / Connexion | Création de compte, authentification JWT avec refresh token              |
| Catalogue de films      | Liste de films avec recherche, filtres (année, catégorie, réalisateur)   |
| Détail d'un film        | Fiche complète (affiche, synopsis, acteurs, note IMDb)                   |
| Système de reviews      | Une review par utilisateur par film, notation /10, modification possible |
| Favoris                 | Ajouter/retirer un film de ses favoris                                   |
| Profil utilisateur      | Affichage et édition du profil (bio, avatar, préférences cinéma)         |
| Système d'amis          | Envoi/acceptation/refus de demandes d'amis                               |
| Chat temps réel         | Messagerie instantanée entre amis via Socket.io                          |

### Fonctionnalités complémentaires

- Catégories de films avec associations many-to-many
- Statistiques utilisateur (nombre de favoris, reviews, amis)
- Recherche d'utilisateurs
- Documentation API Swagger
- Navbar conditionnelle (connecté/déconnecté)
- Protection des routes (redirection vers login si non authentifié)

### Contraintes techniques

- **Temps** : projet réalisé sur plusieurs semaines en parallèle des cours
- **Stack imposée** : React, Node.js, TypeScript, PostgreSQL
- **Sécurité** : hashage des mots de passe (bcrypt), JWT, protection des routes API

---

## 3. Architecture et choix techniques

### Vue d'ensemble

```
┌──────────────┐      HTTP/REST      ┌──────────────────┐      SQL       ┌────────────┐
│   Frontend   │ ◄──────────────────► │     Backend      │ ◄────────────► │ PostgreSQL │
│  React/Vite  │      Socket.io      │  Express/Node.js │               │  (Docker)  │
└──────────────┘ ◄──────────────────► └──────────────────┘               └────────────┘
   Port 5173                              Port 3000                        Port 5432
```

### Choix techniques et justification

| Couche               | Technologie                                             | Justification                                              |
| -------------------- | ------------------------------------------------------- | ---------------------------------------------------------- |
| **Frontend**         | React 19 + Vite + TanStack Router                       | SPA moderne, routing file-based, HMR rapide                |
| **State management** | TanStack React Query                                    | Cache intelligent, synchronisation serveur automatique     |
| **Styling**          | Tailwind CSS                                            | Utility-first, développement rapide, responsive natif      |
| **Backend**          | Express 5 + TypeScript                                  | Framework mature, typage fort, écosystème riche            |
| **ORM**              | Drizzle ORM                                             | Type-safe, léger, migrations SQL générées                  |
| **Base de données**  | PostgreSQL 17                                           | Relationnelle robuste, UUID natif, contraintes d'intégrité |
| **Temps réel**       | Socket.io                                               | WebSocket simplifié, reconnexion automatique               |
| **Auth**             | JWT (access + refresh tokens)                           | Stateless, sécurisé, standard industriel                   |
| **Containerisation** | Docker + Docker Compose                                 | Environnement reproductible, PostgreSQL isolé              |
| **Tests**            | Jest + Supertest (back), Jest + Testing Library (front) | Tests unitaires et d'intégration                           |

---

## 4. Conception

### Conception API (routes/endpoints)

#### Authentification

| Méthode | Route      | Description                                 | Auth |
| ------- | ---------- | ------------------------------------------- | ---- |
| POST    | `/signup`  | Inscription                                 | Non  |
| POST    | `/login`   | Connexion (retourne access + refresh token) | Non  |
| POST    | `/refresh` | Rafraîchir le token d'accès                 | Non  |
| GET     | `/me`      | Profil de l'utilisateur connecté            | Oui  |
| PUT     | `/me`      | Modifier son profil                         | Oui  |

#### Films

| Méthode | Route               | Description             | Auth |
| ------- | ------------------- | ----------------------- | ---- |
| GET     | `/movies`           | Liste de tous les films | Oui  |
| GET     | `/movies/search?q=` | Recherche de films      | Oui  |
| GET     | `/movies/:id`       | Détail d'un film        | Oui  |

#### Reviews

| Méthode | Route                 | Description         | Auth |
| ------- | --------------------- | ------------------- | ---- |
| GET     | `/movies/:id/reviews` | Reviews d'un film   | Non  |
| POST    | `/movies/:id/reviews` | Ajouter une review  | Oui  |
| PATCH   | `/reviews/:id`        | Modifier sa review  | Oui  |
| DELETE  | `/reviews/:id`        | Supprimer sa review | Oui  |

#### Favoris

| Méthode | Route                | Description        | Auth |
| ------- | -------------------- | ------------------ | ---- |
| POST    | `/favorites`         | Ajouter un favori  | Oui  |
| DELETE  | `/favorites/:filmId` | Retirer un favori  | Oui  |
| GET     | `/favorites/:filmId` | Vérifier si favori | Oui  |

#### Amis

| Méthode | Route                 | Description         | Auth |
| ------- | --------------------- | ------------------- | ---- |
| POST    | `/friends/request`    | Envoyer une demande | Oui  |
| PUT     | `/friends/:id/accept` | Accepter            | Oui  |
| PUT     | `/friends/:id/reject` | Refuser             | Oui  |
| GET     | `/friends`            | Liste d'amis        | Oui  |
| GET     | `/friends/pending`    | Demandes en attente | Oui  |
| DELETE  | `/friends/:id`        | Supprimer un ami    | Oui  |

#### Messages (REST + WebSocket)

| Méthode | Route                | Description                  | Auth |
| ------- | -------------------- | ---------------------------- | ---- |
| POST    | `/messages`          | Envoyer un message           | Oui  |
| GET     | `/messages/:userId`  | Conversation avec un ami     | Oui  |
| PUT     | `/messages/:id/read` | Marquer comme lu             | Oui  |
| WS      | `message:send`       | Envoi temps réel (Socket.io) | Oui  |

#### Utilisateurs

| Méthode | Route              | Description                           | Auth |
| ------- | ------------------ | ------------------------------------- | ---- |
| GET     | `/users`           | Liste des utilisateurs                | Oui  |
| GET     | `/users/:id`       | Profil d'un utilisateur               | Oui  |
| GET     | `/users/:id/stats` | Statistiques (favoris, reviews, amis) | Oui  |

### Modèle de données

```
users ──────────< reviews >──────────── films
  │                                       │
  │──────────< favorites >────────────────│
  │                                       │
  │──< friends (requester/addressee)      │──< films_categories >── categories
  │
  │──< messages (sender/receiver)
```

**Tables principales :**

| Table              | Colonnes clés                                                                 |
| ------------------ | ----------------------------------------------------------------------------- |
| `users`            | id (UUID), username, email, passwordHash, avatarUrl, bio, preferences         |
| `films`            | id (UUID), omdbId, title, year, director, posterUrl, plot, actors, imdbRating |
| `categories`       | id (UUID), name (unique), description                                         |
| `films_categories` | filmId, categoryId (clé composite)                                            |
| `reviews`          | id, userId, filmId, rating (1-10), comment, unique(userId, filmId)            |
| `favorites`        | id, userId, filmId, unique(userId, filmId)                                    |
| `friends`          | id, requesterId, addresseeId, status (pending/accepted/rejected)              |
| `messages`         | id, senderId, receiverId, content, sentAt, isRead                             |

---

## 5. Développement

### Organisation du projet

```
CineConnectProjet2/
├── frontend/                    # React + Vite
│   └── src/
│       ├── api/                 # Modules API spécialisés
│       ├── components/          # Composants réutilisables (Navbar, FilmCard, etc.)
│       │   └── discussion/      # Composants chat (ChatArea, FriendsSideBar)
│       ├── hooks/               # React Query hooks (useFilms, useReviews, useUser...)
│       ├── pages/               # Pages (Films, FilmDetail, Profile, Discussion...)
│       ├── routes/              # TanStack Router file-based routes
│       └── __tests__/           # Tests frontend
│
├── backend/                     # Express + TypeScript
│   └── src/
│       ├── Controllers/         # Logique des endpoints
│       ├── Domain/              # Types métier (User, Movie, Review...)
│       ├── Infrastructure/      # Couche données
│       │   ├── Repository/      # Repositories (accès DB)
│       │   ├── schema.ts        # Schéma Drizzle
│       │   └── seed.ts          # Données initiales
│       ├── middleware/           # JWT auth middleware
│       ├── routes/              # Définition des routes
│       └── __tests__/           # Tests backend
│
└── docs/                        # Documentation
```

### Frontend

- **Pages** : Index (accueil), Films (catalogue avec filtres), FilmDetail (fiche film), Profile, Discussion, Users, Login, Signup, Help, FAQ
- **Composants** : Navbar (conditionnelle connecté/déconnecté avec menu déroulant), FilmCard, CommentsSection (reviews avec avatar/username), FavoriteButton, SearchBar, EditProfileModal, EditPreferencesModal
- **Hooks React Query** : `useFilms`, `useFilm`, `useReviews`, `useAddReview`, `useUpdateReview`, `useUser`, `useUsers`, `useUserStats`, `useCategories`, `useFavorite`, `useSocket`
- **Routing** : TanStack Router file-based avec `beforeLoad` pour protéger les routes (redirection vers `/login` si non authentifié)
- **Responsive** : Tailwind CSS avec breakpoints (`md:`, `lg:`)

### Backend

- **Architecture en couches** : Controllers → Domain (types) → Infrastructure (Repository + schema)
- **Routes** : Toutes définies dans `router.ts`, protégées par `authenticateJWT`
- **CRUD complet** : Films, Reviews, Favoris, Amis, Messages, Utilisateurs, Catégories
- **WebSocket** : Chat temps réel via Socket.io avec authentification par token

### Authentification et sécurité

- **Hashage** : bcrypt (salt rounds: 10) pour les mots de passe
- **JWT** : access token (15 min) + refresh token (7 jours)
- **Middleware** : `authenticateJWT` vérifie le token sur chaque route protégée
- **Refresh automatique** : le client tente un refresh si le serveur répond 401/403
- **Protection frontend** : `beforeLoad` sur les routes protégées vérifie la présence du token
- **Contraintes DB** : `unique` sur email, username, et paire (userId, filmId) pour reviews/favoris
- **Cascade delete** : suppression en cascade sur les clés étrangères

---

## 6. Démonstration

### Parcours utilisateur principal

1. **Accueil** → L'utilisateur arrive sur la page d'accueil avec les films populaires
2. **Inscription** → Création de compte via `/signup`
3. **Connexion** → Login via `/login`, réception des tokens JWT
4. **Catalogue** → Navigation dans `/films` avec recherche et filtres (catégorie, année, réalisateur)
5. **Détail film** → Clic sur un film → fiche complète, ajout aux favoris, publication d'une review
6. **Profil** → Consultation/édition du profil, préférences cinéma, statistiques
7. **Social** → Recherche d'utilisateurs, envoi de demandes d'amis
8. **Chat** → Discussion en temps réel avec ses amis via la page Discussion

### Exemple d'appel API

**Login :**

```
POST /login
Body: { "email": "user@mail.com", "password": "secret" }
→ 200 { "accessToken": "eyJ...", "refreshToken": "eyJ..." }
```

**Ajouter une review :**

```
POST /movies/:id/reviews
Headers: Authorization: Bearer <accessToken>
Body: { "rating": 8, "comment": "Excellent film !" }
→ 201 { "id": "uuid", "userId": "...", "filmId": "...", "rating": 8, "comment": "Excellent film !" }
```

### Vérification en base de données

```sql
-- Vérifier les reviews d'un film
SELECT r.rating, r.comment, u.username
FROM reviews r
JOIN users u ON r.user_id = u.id
WHERE r.film_id = '<film-uuid>';
```

### Résultat visible côté interface

- La review apparaît immédiatement dans la section commentaires avec l'avatar et le username
- Le bouton "Publier" se transforme en "Mettre à jour" si l'utilisateur a déjà posté
- Le compteur de reviews dans les statistiques du profil s'incrémente

---

## 7. Tests et qualité

### Tests unitaires backend (Jest + Supertest)

| Fichier              | Couverture                                     |
| -------------------- | ---------------------------------------------- |
| `auth.test.ts`       | Inscription, login, refresh token, accès `/me` |
| `movies.test.ts`     | Liste, recherche, détail d'un film             |
| `reviews.test.ts`    | CRUD reviews, contrainte unicité               |
| `categories.test.ts` | Liste catégories, association film-catégorie   |
| `friends.test.ts`    | Demande, acceptation, refus, liste d'amis      |
| `messages.test.ts`   | Envoi, conversation, marquage lu               |
| `health.test.ts`     | Endpoint `/health`                             |

### Tests unitaires frontend (Jest + Testing Library)

| Fichier           | Couverture                                   |
| ----------------- | -------------------------------------------- |
| `Login.test.jsx`  | Rendu du formulaire, soumission              |
| `Signup.test.jsx` | Rendu du formulaire d'inscription            |
| `Navbar.test.jsx` | Affichage conditionnel (connecté/déconnecté) |
| `Footer.test.jsx` | Rendu du footer                              |
| `api.test.js`     | Client API, gestion des tokens               |

### Points vérifiés manuellement

- Navigation protégée (redirection vers login si non authentifié)
- Refresh automatique du token à expiration
- Affichage responsive sur mobile et desktop
- Chat temps réel entre deux utilisateurs
- Unicité des reviews et favoris par utilisateur/film

---

## 8. Bilan

### Difficultés rencontrées

- **Authentification JWT** : gestion du cycle access/refresh token entre frontend et backend
- **Temps réel** : synchronisation Socket.io avec l'authentification JWT
- **Jointures ORM** : adapter Drizzle ORM pour des requêtes avec jointures (reviews + users)
- **Protection des routes** : implémenter `beforeLoad` avec TanStack Router pour les routes protégées
- **Contraintes d'unicité** : gérer la logique "une review par utilisateur par film" côté backend et frontend

### Solutions mises en place

- Middleware `authenticateJWT` centralisé avec refresh automatique côté client
- Socket.io authentifié via `handshake.auth.token`
- Jointure `leftJoin` dans le ReviewRepository pour enrichir les reviews
- `beforeLoad` + `redirect` dans chaque route protégée TanStack Router
- Contrainte `uniqueIndex` en base + vérification dans le controller

### Compétences acquises

- Architecture en couches (Controllers / Domain / Infrastructure)
- Authentification JWT complète (access + refresh)
- ORM type-safe avec Drizzle et PostgreSQL
- Routing file-based avec TanStack Router
- WebSocket avec Socket.io
- Tests unitaires et d'intégration (Jest, Supertest, Testing Library)
- Dockerisation d'un environnement de développement

### Axes d'amélioration

- Ajout d'un système de notifications en temps réel (nouvelle demande d'ami, nouveau message)
- Pagination des listes de films et reviews
- Upload d'avatar (stockage fichier au lieu d'URL)
- Déploiement en production (CI/CD, hébergement cloud)
- Tests end-to-end (Cypress ou Playwright)

---

## 9. Conclusion

### Résumé du projet

CineConnect est une plateforme sociale pour cinéphiles combinant un catalogue de films, un système de critiques, une gestion de favoris et un chat temps réel. Le projet couvre l'ensemble du cycle de développement full-stack : conception, développement frontend/backend, base de données, authentification, temps réel et tests.

### Évolutions possibles

- Recommandations de films basées sur les préférences et les critiques des amis
- Système de watch-party (visionnage synchronisé)
- Application mobile (React Native)
- Intégration d'APIs externes enrichies (TMDB, trailers YouTube)
- Système de badges et gamification

### Questions

Nous sommes disponibles pour répondre à vos questions.
