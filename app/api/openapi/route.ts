import { NextResponse } from "next/server";

const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Scentora API",
    version: "1.0.0",
    description: "Public catalog, newsletter, and upload helper API.",
  },
  servers: [
    {
      url: "/",
      description: "Current deployment",
    },
  ],
  tags: [
    { name: "Products" },
    { name: "Categories" },
    { name: "Collections" },
    { name: "Newsletter" },
    { name: "Admin" },
  ],
  paths: {
    "/api/products": {
      get: {
        tags: ["Products"],
        summary: "List products",
        parameters: [
          { $ref: "#/components/parameters/CategoryQuery" },
          { $ref: "#/components/parameters/CollectionQuery" },
          { $ref: "#/components/parameters/SearchQuery" },
          { $ref: "#/components/parameters/TagQuery" },
          { $ref: "#/components/parameters/BestSellerQuery" },
          { $ref: "#/components/parameters/FeaturedQuery" },
          { $ref: "#/components/parameters/SortQuery" },
          { $ref: "#/components/parameters/PageQuery" },
          { $ref: "#/components/parameters/LimitQuery" },
        ],
        responses: {
          "200": {
            description: "Paginated products",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductListResponse" },
              },
            },
          },
        },
      },
    },
    "/api/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get a product by id or slug",
        parameters: [{ $ref: "#/components/parameters/ProductIdPath" }],
        responses: {
          "200": {
            description: "Product found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductResponse" },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/api/categories": {
      get: {
        tags: ["Categories"],
        summary: "List categories",
        responses: {
          "200": {
            description: "Categories",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CategoryListResponse" },
              },
            },
          },
        },
      },
    },
    "/api/categories/{slug}/products": {
      get: {
        tags: ["Categories", "Products"],
        summary: "List products in a category",
        parameters: [
          { $ref: "#/components/parameters/SlugPath" },
          { $ref: "#/components/parameters/SearchQuery" },
          { $ref: "#/components/parameters/TagQuery" },
          { $ref: "#/components/parameters/BestSellerQuery" },
          { $ref: "#/components/parameters/FeaturedQuery" },
          { $ref: "#/components/parameters/SortQuery" },
          { $ref: "#/components/parameters/PageQuery" },
          { $ref: "#/components/parameters/LimitQuery" },
        ],
        responses: {
          "200": {
            description: "Category with paginated products",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ProductListResponse" },
                    {
                      type: "object",
                      properties: {
                        category: { $ref: "#/components/schemas/Category" },
                      },
                    },
                  ],
                },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/api/collections": {
      get: {
        tags: ["Collections"],
        summary: "List collections",
        responses: {
          "200": {
            description: "Collections",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CollectionListResponse" },
              },
            },
          },
        },
      },
    },
    "/api/collections/{slug}": {
      get: {
        tags: ["Collections"],
        summary: "Get a collection by slug",
        parameters: [{ $ref: "#/components/parameters/SlugPath" }],
        responses: {
          "200": {
            description: "Collection found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CollectionResponse" },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/api/collections/{slug}/products": {
      get: {
        tags: ["Collections", "Products"],
        summary: "List products in a collection",
        parameters: [
          { $ref: "#/components/parameters/SlugPath" },
          { $ref: "#/components/parameters/SearchQuery" },
          { $ref: "#/components/parameters/TagQuery" },
          { $ref: "#/components/parameters/BestSellerQuery" },
          { $ref: "#/components/parameters/FeaturedQuery" },
          { $ref: "#/components/parameters/SortQuery" },
          { $ref: "#/components/parameters/PageQuery" },
          { $ref: "#/components/parameters/LimitQuery" },
        ],
        responses: {
          "200": {
            description: "Collection with paginated products",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ProductListResponse" },
                    {
                      type: "object",
                      properties: {
                        collection: { $ref: "#/components/schemas/Collection" },
                      },
                    },
                  ],
                },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/api/newsletter": {
      post: {
        tags: ["Newsletter"],
        summary: "Subscribe to the newsletter",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/NewsletterRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Subscription created or already present",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/NewsletterResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/api/admin/uploads/sign": {
      post: {
        tags: ["Admin"],
        summary: "Create a Cloudinary upload signature",
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UploadSignatureRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Upload signature",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UploadSignatureResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
  },
  components: {
    parameters: {
      ProductIdPath: {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "string" },
        description: "Product id or slug.",
      },
      SlugPath: {
        name: "slug",
        in: "path",
        required: true,
        schema: { type: "string" },
      },
      CategoryQuery: {
        name: "category",
        in: "query",
        schema: { type: "string" },
      },
      CollectionQuery: {
        name: "collection",
        in: "query",
        schema: { type: "string" },
      },
      SearchQuery: {
        name: "search",
        in: "query",
        schema: { type: "string" },
      },
      TagQuery: {
        name: "tag",
        in: "query",
        schema: { type: "string", enum: ["HOT", "NEW", "POPULAR", "LUXURY"] },
      },
      BestSellerQuery: {
        name: "bestSeller",
        in: "query",
        schema: { type: "string", enum: ["true", "false"] },
      },
      FeaturedQuery: {
        name: "featured",
        in: "query",
        schema: { type: "string", enum: ["true", "false"] },
      },
      SortQuery: {
        name: "sort",
        in: "query",
        schema: {
          type: "string",
          enum: ["newest", "price_asc", "price_desc", "name_asc"],
          default: "newest",
        },
      },
      PageQuery: {
        name: "page",
        in: "query",
        schema: { type: "integer", minimum: 1, default: 1 },
      },
      LimitQuery: {
        name: "limit",
        in: "query",
        schema: { type: "integer", minimum: 1, maximum: 50, default: 12 },
      },
    },
    responses: {
      BadRequest: {
        description: "Invalid request",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      NotFound: {
        description: "Resource not found",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        required: ["error"],
        properties: {
          error: { type: "string" },
        },
      },
      PaginationMeta: {
        type: "object",
        required: ["page", "limit", "total", "totalPages", "hasNextPage", "hasPreviousPage"],
        properties: {
          page: { type: "integer" },
          limit: { type: "integer" },
          total: { type: "integer" },
          totalPages: { type: "integer" },
          hasNextPage: { type: "boolean" },
          hasPreviousPage: { type: "boolean" },
        },
      },
      CountMeta: {
        type: "object",
        required: ["total"],
        properties: {
          total: { type: "integer" },
        },
      },
      Category: {
        type: "object",
        required: ["id", "name", "slug", "description", "createdAt", "updatedAt"],
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          slug: { type: "string" },
          description: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Collection: {
        type: "object",
        required: [
          "id",
          "name",
          "slug",
          "description",
          "image",
          "images",
          "countLabel",
          "createdAt",
          "updatedAt",
        ],
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          slug: { type: "string" },
          description: { type: "string", nullable: true },
          image: { type: "string", nullable: true },
          images: { type: "array", items: { type: "string" } },
          countLabel: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Product: {
        type: "object",
        required: [
          "id",
          "slug",
          "image",
          "name",
          "description",
          "notes",
          "price",
          "tag",
          "category",
          "categoryDetails",
          "collections",
          "collectionDetails",
          "stock",
          "isBestSeller",
          "isFeatured",
          "isActive",
          "createdAt",
          "updatedAt",
        ],
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          image: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          notes: { type: "array", items: { type: "string" } },
          price: { type: "number", format: "float" },
          tag: {
            type: "string",
            enum: ["HOT", "NEW", "POPULAR", "LUXURY"],
            nullable: true,
          },
          category: { type: "string" },
          categoryDetails: { $ref: "#/components/schemas/Category" },
          collections: { type: "array", items: { type: "string" } },
          collectionDetails: {
            type: "array",
            items: { $ref: "#/components/schemas/Collection" },
          },
          stock: { type: "integer" },
          isBestSeller: { type: "boolean" },
          isFeatured: { type: "boolean" },
          isActive: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ProductListResponse: {
        type: "object",
        required: ["data", "meta"],
        properties: {
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Product" },
          },
          meta: { $ref: "#/components/schemas/PaginationMeta" },
        },
      },
      ProductResponse: {
        type: "object",
        required: ["data"],
        properties: {
          data: { $ref: "#/components/schemas/Product" },
        },
      },
      CategoryListResponse: {
        type: "object",
        required: ["data", "meta"],
        properties: {
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Category" },
          },
          meta: { $ref: "#/components/schemas/CountMeta" },
        },
      },
      CollectionListResponse: {
        type: "object",
        required: ["data", "meta"],
        properties: {
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Collection" },
          },
          meta: { $ref: "#/components/schemas/CountMeta" },
        },
      },
      CollectionResponse: {
        type: "object",
        required: ["data"],
        properties: {
          data: { $ref: "#/components/schemas/Collection" },
        },
      },
      NewsletterRequest: {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string", format: "email" },
        },
      },
      NewsletterResponse: {
        type: "object",
        required: ["message", "data"],
        properties: {
          message: { type: "string" },
          data: {
            type: "object",
            required: ["id", "email", "createdAt"],
            properties: {
              id: { type: "string" },
              email: { type: "string", format: "email" },
              createdAt: { type: "string", format: "date-time" },
            },
          },
        },
      },
      UploadSignatureRequest: {
        type: "object",
        properties: {
          folder: {
            type: "string",
            enum: ["scentora/products", "scentora/collections"],
            default: "scentora/products",
          },
        },
      },
      UploadSignatureResponse: {
        type: "object",
        required: ["data"],
        properties: {
          data: {
            type: "object",
            required: ["signature", "timestamp", "apiKey", "cloudName", "folder"],
            properties: {
              signature: { type: "string" },
              timestamp: { type: "integer" },
              apiKey: { type: "string" },
              cloudName: { type: "string" },
              folder: { type: "string" },
            },
          },
        },
      },
    },
  },
} as const;

export function GET() {
  return NextResponse.json(openApiSpec);
}
