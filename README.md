# 📋 README - Avancée du Projet CineConnect

Membre du groupe :

Tanushan, Bérenice, Thomas

repo : https://github.com/ThanuWeb/CineConnectProjet2
figma : https://www.figma.com/design/JzujYCcrqw187VmbzFg1h1/cineconnect--Copy-?node-id=0-1&t=V5UJXc9wmFop6vVj-1

## 📌 Vue d'ensemble

**CineConnect** est une application web permettant aux utilisateurs de discuter films/séries avec leurs amis en temps réel.

**Stack technologique :**

- **Frontend** : React 19 + Vite + TanStack Router + Tailwind CSS
- **Backend** : Node.js + Express 5 + TypeScript + PostgreSQL
- **Base de données** : PostgreSQL avec Drizzle ORM
- **Authentification** : Better Auth + JWT
- **Temps réel** : Socket.io
- **Testing** : Vitest

---

# CineConnect Backend

Backend API pour le projet CineConnect, utilisant Node.js, Express, Drizzle ORM et PostgreSQL.

## Prérequis

- [Node.js](https://nodejs.org/) (v20+ recommandé)
- [pnpm](https://pnpm.io/) (ou npm)
- [Docker](https://www.docker.com/) et [Docker Compose](https://docs.docker.com/compose/)
- (Optionnel) [psql](https://www.postgresql.org/download/) pour requêtes manuelles

---

## Installation

1. **Cloner le dépôt**

   ```bash
   git clone https://github.com/ThanuWeb/CineConnectProjet2.git
   ```

2. **Installer les dépendances frontend**

   ```bash
   cd frontend
   pnpm install
   ```

3. **Démarrer la base de données avec Docker et installer les dépendances backend**

   Assurez-vous que Docker est installé et en cours d'exécution, puis lancez la base de données PostgreSQL :

   ```bash
   cd ../backend
   docker compose build --no-cache
   docker compose up -d
   pnpm install
   ```

4. **Gestion de la base de données**

   Il faut modifier temporairement les variables d'environnement pour la connexion à la base de données dans un fichier `.env` à la racine du dossier `backend` :

   Passer la ligne suivante de `DATABASE_URL` :

   ```
   DATABASE_URL=postgresql://postgres:postgres@postgres:5432/db
   ```

   à

   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5434/db
   ```

   Utilisez Drizzle pour créer les tables dans PostgreSQL :

   Genérer les migrations (si nécessaire) :

   ```
   pnpm run db:generate
   ```

   ```bash
   pnpm run db:migrate
   ```

   Puis seed la base de données avec des données de test :

   ```bash
   pnpm run db:seed
   ```

## 🚀 Commandes disponibles

### **Frontend**

```bash
cd frontend
pnpm dev          # Développement (Vite HMR)
pnpm build        # Build production
pnpm lint         # ESLint check
pnpm preview      # Prévisualiser le build
pnpm test         # Tests Vitest
pnpm test:coverage  # Tests avec couverture
```

### **Backend**

```bash
cd backend
pnpm dev          # Développement (tsx watch)
pnpm build        # Build TypeScript
pnpm test         # Tests Vitest
pnpm test:coverage  # Tests avec couverture
pnpm db:push      # Pousser le schema à la DB
pnpm db:migrate   # Migrations
pnpm db:studio    # Ouvrir le studio Drizzle
```

---

## 📁 Structure du projet

```
CineConnectProjet2/
├── frontend/ # React + Vite
│ ├── src/
│ │ ├── api/ # Modules API (comments, favorites, films, ratings)
│ │ ├── api.js # Client API centralisé (fetch, tokens, refresh)
│ │ ├── components/ # Composants réutilisables
│ │ │ ├── discussion/ # Composants chat (ChatArea, FriendsSideBar, modals)
│ │ │ ├── Navbar.jsx
│ │ │ ├── Footer.jsx
│ │ │ ├── FilmCard.jsx
│ │ │ ├── CommentsSection.jsx
│ │ │ ├── FavoriteButton.jsx
│ │ │ ├── RatingStars.jsx
│ │ │ ├── SearchBar.jsx
│ │ │ ├── EditProfileModal.jsx
│ │ │ └── EditPreferencesModal.jsx
│ │ ├── hooks/ # React Query hooks (useFilms, useReviews, useUser, etc.)
│ │ ├── mock/ # Données mock (currentUser)
│ │ ├── pages/ # Composants pages (Films, FilmDetail, Profile, Discussion, etc.)
│ │ ├── routes/ # TanStack Router file-based routes
│ │ ├── assets/ # Icônes et images
│ │ ├── tests/ # Tests unitaires frontend
│ │ ├── main.jsx # Point d'entrée React
│ │ └── index.css # Styles globaux (Tailwind)
│ ├── vite.config.js # Configuration Vite + TanStack Router Plugin
│ ├── tailwind.config.js # Tailwind CSS
│ ├── jest.config.cjs # Configuration des tests
│ └── package.json
│
├── backend/ # Express + TypeScript
│ ├── src/
│ │ ├── app.ts # Configuration Express (middlewares, CORS)
│ │ ├── server.ts # Point d'entrée serveur
│ │ ├── websocket.ts # Configuration Socket.io
│ │ ├── routes/ # Définition des routes API
│ │ │ └── router.ts
│ │ ├── Controllers/ # Logique des endpoints
│ │ │ ├── AuthController.ts
│ │ │ ├── MovieController.ts
│ │ │ ├── ReviewController.ts
│ │ │ ├── FriendController.ts
│ │ │ ├── MessageController.ts
│ │ │ ├── CategoryController.ts
│ │ │ └── FavoriteController.ts
│ │ ├── Domain/ # Types métier (User, Movie, Review, Friend, etc.)
│ │ ├── Infrastructure/ # Couche données
│ │ │ ├── schema.ts # Schéma Drizzle (tables)
│ │ │ ├── drizzle.ts # Connexion DB
│ │ │ ├── seed.ts # Seed des données initiales
│ │ │ └── Repository/ # Repositories (User, Movie, Review, Friend, etc.)
│ │ ├── config/ # Configuration (env, swagger)
│ │ ├── middleware/ # Middlewares (JWT auth)
│ │ └── tests/ # Tests unitaires backend
│ ├── drizzle/ # Migrations SQL
│ ├── docker-compose.yml # PostgreSQL via Docker
│ ├── Dockerfile
│ ├── drizzle.config.ts # Configuration Drizzle
│ ├── tsconfig.json
│ └── package.json
│
├── docs/ # Documentation
└── README.md
```

---

## ⚙️ Configuration requise

- **Node.js** : ≥20.19.0
- **pnpm** : 10.29.3+
- **PostgreSQL** : ≥12
- **.env** : Variables d'environnement (backend/.env)

---

## 📝 Notes importantes

- **routeTree.gen.ts** : Auto-généré par TanStack Router, ne pas modifier
- **Vite + React Router Plugin** : Gestion automatique des routes file-based
- **Drizzle Studio** : Accessible via `pnpm db:studio` pour visualiser la BD
- **ESLint** : Configuration stricte avec support JSX

---
