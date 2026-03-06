# 📋 README - Avancée du Projet CineConnect

Membre du groupe :

Tanushan, Bérenice, Thomas

repo : https://github.com/ThanuWeb/CineConnectProjet2

## 📌 Vue d'ensemble

**CineConnect** est une application web permettant aux utilisateurs de regarder, discuter et profiter de films/séries avec leurs amis en temps réel, même à distance.

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

## Installation

1. **Cloner le dépôt**

   ```bash
   git clone https://github.com/ThanuWeb/CineConnectProjet2.git
   cd CineConnectProjet2/backend

   ```

2. **Installer les dépendances**

   ```bash
   pnpm install
   ```

3. **Configurer les variables d'environnement**

   Créez un fichier `.env` à la racine du dossier `backend` avec les variables suivantes :

   ```env
   # Pour le développement local
   DATABASE_URL=postgresql://postgres:postgres@localhost:5434/db
   PORT=3000
   JWT_SECRET=dev-secret-super-long
   FRONTEND_ORIGIN=http://localhost:5173
   ```

4. **Démarrer la base de données avec Docker**

   Assurez-vous que Docker est installé et en cours d'exécution, puis lancez la base de données PostgreSQL :

   ```bash
   docker compose build --no-cache
   docker compose up -d
   ```

5. **Gestion de la base de données**

   Utilisez Drizzle pour créer les tables dans PostgreSQL :

   Genérer les migrations (si nécessaire) :

   ```
   pnpm run db:generate
   ```

   ```bash
   pnpm run db:push
   ```

## ✅ Avancée du projet

### **Frontend** (React + Vite)

| Feature                    | Statut       | Notes                                                 |
| -------------------------- | ------------ | ----------------------------------------------------- |
| **Architecture de base**   | ✅ Complète  | Vite configuré, Tailwind CSS intégré                  |
| **Routing**                | ✅ Complète  | TanStack Router avec 5 routes générées                |
| **Navbar**                 | ✅ En cours  | Composant créé, liens vers Films/Accueil fonctionnels |
| **Pages existantes**       | ✅ Créées    | Index, About, Film, Login, Signin                     |
| **Page d'accueil (Index)** | 🔄 En cours  | Hero section, newsletter, animations CSS              |
| **Page Films**             | 🔄 En cours  | Intégration API OMDb (lectures de films)              |
| **Authentification UI**    | ❌ À faire   | Pages Login/Signin à développer                       |
| **Chat temps réel**        | ❌ À faire   | Intégration Socket.io                                 |
| **Responsive design**      | 🟡 Partiel   | Base Tailwind en place, à affiner                     |
| **ESLint**                 | ✅ Configuré | Avec support React Hooks                              |

### **Backend** (Express + TypeScript)

| Feature              | Statut       | Notes                              |
| -------------------- | ------------ | ---------------------------------- |
| **Serveur Express**  | ✅ Configuré | Port configuré, CORS activé        |
| **TypeScript**       | ✅ Configuré | tsconfig en place                  |
| **Base de données**  | 🔄 En cours  | Drizzle ORM + PostgreSQL           |
| **Migrations BD**    | ❌ À faire   | Utiliser `drizzle-kit migrate`     |
| **Routes API**       | ❌ À faire   | CRUD utilisateurs, films, etc.     |
| **Authentification** | ❌ À faire   | Better Auth intégré (v1.4.18)      |
| **JWT**              | ❌ À faire   | jsonwebtoken installé              |
| **Socket.io**        | ❌ À faire   | Pour le chat temps réel            |
| **Swagger/Docs API** | ❌ À faire   | swagger-jsdoc + swagger-ui-express |
| **Testing**          | ❌ À faire   | Vitest configuré, tests à écrire   |
| **Validation**       | ❌ À faire   | Pour validation des données        |

### **Base de données**

| Feature            | Statut     | Notes                                        |
| ------------------ | ---------- | -------------------------------------------- |
| **Schema Drizzle** | ❌ À faire | Créer les tables (users, films, chats, etc.) |
| **Seed data**      | ❌ À faire | Script `db:seed` à implémenter               |
| **Migrations**     | ❌ À faire | Utiliser drizzle-kit                         |

---

## 🚀 Commandes disponibles

### **Frontend**

```bash
cd frontend
pnpm dev          # Développement (Vite HMR)
pnpm build        # Build production
pnpm lint         # ESLint check
pnpm preview      # Prévisualiser le build
```

### **Backend**

```bash
cd backend
pnpm dev          # Développement (tsx watch)
pnpm build        # Build TypeScript
pnpm test         # Tests Vitest
pnpm db:push      # Pousser le schema à la DB
pnpm db:migrate   # Migrations
pnpm db:studio    # Ouvrir le studio Drizzle
```

---

## 📁 Structure du projet

```
CineConnectProjet2/
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── routes/          # TanStack Router (index, about, film, login, signin)
│   │   ├── pages/           # Composants pages
│   │   ├── components/      # Composants réutilisables (Navbar)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js       # Configuration Vite + TanStack Router Plugin
│   ├── tailwind.config.js   # Tailwind CSS
│   └── package.json
│
├── backend/                 # Express + TypeScript
│   ├── src/
│   │   ├── app.ts           # Configuration Express
│   │   ├── server.ts        # Point d'entrée
│   │   ├── routes/          # Routes API (à créer)
│   │   ├── db/              # Drizzle ORM
│   │   ├── config/          # Configuration
│   │   └── middleware/      # Middlewares (CORS, Auth, etc.)
│   ├── drizzle/             # Migrations
│   ├── drizzle.config.ts    # Configuration Drizzle
│   ├── tsconfig.json
│   └── package.json
│
├── shared/                  # Code partagé (si nécessaire)
├── docs/                    # Documentation
└── docker-compose.yml       # Docker setup
```

---

## 🎯 Prochaines priorités

### **Court terme (Critical)**

1. ✋ **Finir la BD** : Créer le schema Drizzle (users, films, rooms, messages)
2. 🔐 **Routes Auth** : Implémenter Better Auth avec les endpoints
3. 📺 **Routes Films** : CRUD pour les films
4. 🧪 **Tests** : Ajouter tests unitaires/intégration

### **Moyen terme**

5. 💬 **Socket.io Chat** : Intégrer le système de chat temps réel
6. 🎬 **Streaming** : Intégration vidéo (si applicable)
7. 🔔 **Notifs** : Système de notifications

### **Long terme**

8. 📱 **Mobile** : Responsive complète
9. 🚀 **Déploiement** : Docker + CI/CD
10. 📊 **Analytics** : Suivi utilisateurs

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
