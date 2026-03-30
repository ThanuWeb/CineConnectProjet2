import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CineConnect API",
      version: "1.0.0",
      description: "API de CineConnect — Films, Reviews, Friends, Messages",
    },
    servers: [
      { url: "http://localhost:3000", description: "Serveur local (Docker)" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
      schemas: {
        SignupRequest: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: { type: "string", example: "john_doe" },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            password: { type: "string", example: "motdepasse123" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
        },
        TokenResponse: {
          type: "object",
          properties: { token: { type: "string" } },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            username: { type: "string" },
            email: { type: "string" },
            avatarUrl: { type: "string", nullable: true },
            bio: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        UpdateProfileRequest: {
          type: "object",
          properties: {
            username: { type: "string" },
            bio: { type: "string" },
            avatarUrl: { type: "string" },
          },
        },
        Movie: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            omdbId: { type: "string", nullable: true },
            title: { type: "string" },
            year: { type: "integer", nullable: true },
            director: { type: "string", nullable: true },
            posterUrl: { type: "string", nullable: true },
            plot: { type: "string", nullable: true },
            runtimeMinutes: { type: "integer", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            description: { type: "string", nullable: true },
          },
        },
        CreateCategoryRequest: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", example: "Action" },
            description: { type: "string" },
          },
        },
        AddFilmCategoryRequest: {
          type: "object",
          required: ["categoryId"],
          properties: { categoryId: { type: "string", format: "uuid" } },
        },
        Review: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            filmId: { type: "string", format: "uuid" },
            rating: { type: "integer", minimum: 1, maximum: 10 },
            comment: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CreateReviewRequest: {
          type: "object",
          required: ["rating"],
          properties: {
            rating: { type: "integer", minimum: 1, maximum: 10, example: 8 },
            comment: { type: "string", example: "Excellent film !" },
          },
        },
        Friend: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            requesterId: { type: "string", format: "uuid" },
            addresseeId: { type: "string", format: "uuid" },
            status: {
              type: "string",
              enum: ["pending", "accepted", "rejected"],
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        FriendRequestBody: {
          type: "object",
          required: ["addresseeId"],
          properties: { addresseeId: { type: "string", format: "uuid" } },
        },
        Message: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            senderId: { type: "string", format: "uuid" },
            receiverId: { type: "string", format: "uuid" },
            content: { type: "string" },
            sentAt: { type: "string", format: "date-time" },
            isRead: { type: "boolean" },
          },
        },
        SendMessageRequest: {
          type: "object",
          required: ["receiverId", "content"],
          properties: {
            receiverId: { type: "string", format: "uuid" },
            content: { type: "string", example: "Salut !" },
          },
        },
        Error: {
          type: "object",
          properties: { error: { type: "string" } },
        },
      },
    },
    paths: {
      // ── Health ──
      "/health": {
        get: {
          summary: "Health check",
          tags: ["Health"],
          responses: { 200: { description: "OK" } },
        },
      },
      // ── Auth ──
      "/signup": {
        post: {
          summary: "Inscription",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SignupRequest" },
              },
            },
          },
          responses: {
            201: { description: "Utilisateur créé" },
            400: {
              description: "Champs manquants ou email déjà utilisé",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/login": {
        post: {
          summary: "Connexion (retourne un token JWT)",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "Token JWT",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/TokenResponse" },
                },
              },
            },
            400: { description: "Identifiants incorrects" },
          },
        },
      },
      "/me": {
        get: {
          summary: "Profil de l'utilisateur connecté",
          tags: ["Auth"],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Profil",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/User" },
                },
              },
            },
          },
        },
        put: {
          summary: "Mettre à jour le profil",
          tags: ["Auth"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateProfileRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "Profil mis à jour",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/User" },
                },
              },
            },
          },
        },
      },
      // ── Movies ──
      "/movies": {
        get: {
          summary: "Lister tous les films",
          tags: ["Movies"],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Liste des films",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Movie" },
                  },
                },
              },
            },
          },
        },
      },
      "/movies/{id}": {
        get: {
          summary: "Récupérer un film par ID",
          tags: ["Movies"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            200: {
              description: "Film trouvé",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Movie" },
                },
              },
            },
            404: { description: "Film non trouvé" },
          },
        },
      },
      // ── Categories ──
      "/categories": {
        get: {
          summary: "Lister toutes les catégories",
          tags: ["Categories"],
          responses: {
            200: {
              description: "Liste des catégories",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Category" },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Créer une catégorie",
          tags: ["Categories"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateCategoryRequest" },
              },
            },
          },
          responses: {
            201: {
              description: "Catégorie créée",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Category" },
                },
              },
            },
          },
        },
      },
      "/movies/{id}/categories": {
        get: {
          summary: "Catégories d'un film",
          tags: ["Categories"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            200: {
              description: "Catégories du film",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Category" },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Associer une catégorie à un film",
          tags: ["Categories"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AddFilmCategoryRequest" },
              },
            },
          },
          responses: { 201: { description: "Catégorie associée" } },
        },
      },
      // ── Reviews ──
      "/movies/{id}/reviews": {
        get: {
          summary: "Avis d'un film",
          tags: ["Reviews"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            200: {
              description: "Liste des avis",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Review" },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Ajouter un avis",
          tags: ["Reviews"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateReviewRequest" },
              },
            },
          },
          responses: {
            201: {
              description: "Avis ajouté",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Review" },
                },
              },
            },
            400: { description: "Note invalide ou déjà noté" },
          },
        },
      },
      "/reviews/{id}": {
        put: {
          summary: "Modifier un avis",
          tags: ["Reviews"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateReviewRequest" },
              },
            },
          },
          responses: {
            200: { description: "Avis modifié" },
            403: { description: "Non autorisé" },
            404: { description: "Avis non trouvé" },
          },
        },
        delete: {
          summary: "Supprimer un avis",
          tags: ["Reviews"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            200: { description: "Avis supprimé" },
            403: { description: "Non autorisé" },
            404: { description: "Avis non trouvé" },
          },
        },
      },
      // ── Friends ──
      "/friends/request": {
        post: {
          summary: "Envoyer une demande d'ami",
          tags: ["Friends"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/FriendRequestBody" },
              },
            },
          },
          responses: {
            201: {
              description: "Demande envoyée",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Friend" },
                },
              },
            },
            400: { description: "addresseeId manquant ou auto-ajout" },
          },
        },
      },
      "/friends/{id}/accept": {
        put: {
          summary: "Accepter une demande d'ami",
          tags: ["Friends"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            200: { description: "Demande acceptée" },
            403: { description: "Non autorisé" },
            404: { description: "Demande non trouvée" },
          },
        },
      },
      "/friends/{id}/reject": {
        put: {
          summary: "Rejeter une demande d'ami",
          tags: ["Friends"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            200: { description: "Demande rejetée" },
            403: { description: "Non autorisé" },
            404: { description: "Demande non trouvée" },
          },
        },
      },
      "/friends": {
        get: {
          summary: "Lister ses amis",
          tags: ["Friends"],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Liste des amis",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Friend" },
                  },
                },
              },
            },
          },
        },
      },
      "/friends/pending": {
        get: {
          summary: "Demandes d'ami en attente",
          tags: ["Friends"],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Demandes en attente",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Friend" },
                  },
                },
              },
            },
          },
        },
      },
      "/friends/{id}": {
        delete: {
          summary: "Supprimer un ami",
          tags: ["Friends"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            200: { description: "Ami supprimé" },
            403: { description: "Non autorisé" },
            404: { description: "Relation non trouvée" },
          },
        },
      },
      // ── Messages ──
      "/messages": {
        post: {
          summary: "Envoyer un message",
          tags: ["Messages"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SendMessageRequest" },
              },
            },
          },
          responses: {
            201: {
              description: "Message envoyé",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Message" },
                },
              },
            },
            400: { description: "receiverId ou content manquant" },
          },
        },
      },
      "/messages/{userId}": {
        get: {
          summary: "Conversation avec un utilisateur",
          tags: ["Messages"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "userId",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            200: {
              description: "Messages de la conversation",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Message" },
                  },
                },
              },
            },
          },
        },
      },
      "/messages/{id}/read": {
        put: {
          summary: "Marquer un message comme lu",
          tags: ["Messages"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            200: {
              description: "Message marqué comme lu",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Message" },
                },
              },
            },
            404: { description: "Message non trouvé" },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
