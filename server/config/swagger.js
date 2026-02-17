import swaggerJsdoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Clinic App API",
    version: "1.0.0",
    description: "API documentation for the Clinic App system.",
    // ... rest of your info
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          username: { type: "string", example: "siyabonga" },
          email: { type: "string", example: "siyabonga@gmail.com" },
          password: { type: "string", example: "Password-123" },
          role: { type: "string", example: "doctor" },
          profilePhoto: { type: "string", example: "cloudinary url" },
          isVerified: { type: "boolean", example: false },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    "/auth/register": {
      post: {
        // Changed to POST because registration is a POST request
        summary: "Registers a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/models/userModel" },
            },
          },
        },
        responses: {
          201: {
            description:
              "User successfully registered                   (http://localhost:3000/api-docs#/Auth/post_auth_login)",
          },
          409: { description: "Email already exists" },
          422: { description: "Please fill all the fields" },
          500: { description: "Internal server error" },
        },
      },
      "/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register a new user with a profile photo",
          description:
            "Creates a new user account, hashes the password, and uploads the profile photo to Cloudinary.",
          operationId: "registerUser",
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["username", "email", "password", "role", "file"],
                  properties: {
                    username: { type: "string", example: "siyabonga" },
                    email: {
                      type: "string",
                      format: "email",
                      example: "siya@clinic.com",
                    },
                    password: {
                      type: "string",
                      format: "password",
                      example: "StrongPass123!",
                    },
                    role: {
                      type: "string",
                      enum: ["doctor", "admin", "nurse"],
                      example: "doctor",
                    },
                    file: {
                      type: "string",
                      format: "binary",
                      description:
                        "Profile image to upload (Supported fields: file, photo, or profilePhoto)",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "User successfully registered",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "User successfully registered",
                      },
                      user: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          email: { type: "string" },
                          username: { type: "string" },
                          profilePhoto: { type: "string", format: "url" },
                          role: { type: "string" },
                          token: { type: "string" },
                          isVerified: { type: "string", example: "false" },
                        },
                      },
                    },
                  },
                },
              },
            },
            409: {
              description: "Conflict - Email already exists",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Email already exists",
                      },
                    },
                  },
                },
              },
            },
            422: {
              description:
                "Unprocessable Entity - Validation failed (Weak password, invalid email, or missing fields)",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Please enter a stronger password",
                      },
                    },
                  },
                },
              },
            },
            500: {
              description:
                "Internal Server Error - Cloudinary upload failure or database error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "An error occurred while uploading your photo",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/verify-email-request": {
      post: {
        tags: ["Auth"],
        summary: "Request an account verification email",
        description:
          "Sends a verification link containing a JWT token to the user's email address if the account exists.",
        operationId: "verifyEmailRequest",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "user@example.com",
                    description:
                      "The email address associated with the account to be verified.",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description:
              "Success. To prevent user enumeration, this is returned even if the email is not found in the database.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example:
                        "If an account exists for this email, a verification link has been sent.",
                    },
                  },
                },
              },
            },
          },
          422: {
            description: "Validation Error - Missing or invalid email format.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Please provide a valid email.",
                    },
                  },
                },
              },
            },
          },
          502: {
            description:
              "Bad Gateway - The email service (Nodemailer) failed to send the message.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example:
                        "We couldn't send the verification email. Please try again later.",
                    },
                  },
                },
              },
            },
          },
          500: {
            description:
              "Internal Server Error - Something went wrong on the server.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "An unexpected error occurred.",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/confirmemail": {
      get: {
        tags: ["Auth"],
        summary: "Confirm and verify user email",
        description:
          "Receives the token and email from the verification link, validates the JWT, and updates the user's verification status in the database.",
        operationId: "verifyEmail",
        parameters: [
          {
            name: "email",
            in: "query",
            required: true,
            description: "The email address to be verified.",
            schema: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
          },
          {
            name: "token",
            in: "query",
            required: true,
            description: "The JWT verification token sent to the user's email.",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Email successfully verified",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Email successfully verified.",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized - Invalid or expired token",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Invalid token." },
                  },
                },
              },
            },
          },
          404: {
            description: "Not Found - User with this email does not exist",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "User not found." },
                  },
                },
              },
            },
          },
          422: {
            description:
              "Unprocessable Entity - Missing or invalid email/token format",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Please provide a valid email.",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "An unexpected error occurred.",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login a user",
        description:
          "Authenticates a user using email and password. Returns a JWT token and user profile if credentials are valid and the email is verified.",
        operationId: "loginUser",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "doctor@clinic.com",
                  },
                  password: {
                    type: "string",
                    format: "password",
                    example: "StrongPass123!",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "User logged in successfully",
                    },
                    user: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        email: { type: "string" },
                        username: { type: "string" },
                        profilePhoto: { type: "string", format: "url" },
                        role: { type: "string" },
                        token: { type: "string" },
                        isVerified: { type: "string", example: "true" },
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              "Unauthorized - Incorrect password or unverified email",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      enum: [
                        "Invalid email or password.",
                        "Please verify your email.",
                      ],
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Not Found - User with this email does not exist",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "User not found." },
                  },
                },
              },
            },
          },
          422: {
            description:
              "Unprocessable Entity - Missing or invalid email/password format",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Please provide a valid email.",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "An unexpected error occurred.",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/forgot-password": {
      post: {
        tags: ["Auth"],
        summary: "Request a password reset link",
        description:
          "Sends a time-sensitive (20 mins) password reset link to the user's email. The link is signed with a dynamic JWT secret based on the user's current password hash.",
        operationId: "forgotPasswordLink",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "user@example.com",
                    description:
                      "The email address associated with the account.",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Reset link sent successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Reset link sent to email.",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Bad Request - Email field is missing",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Email is required." },
                  },
                },
              },
            },
          },
          422: {
            description: "Unprocessable Entity - Invalid email format",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Please provide a valid email.",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Not Found - No user exists with that email",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "No account found with that email.",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Internal server error.",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/reset-password/{id}/{token}": {
      post: {
        tags: ["Auth"],
        summary: "Reset user password",
        description:
          "Validates the reset token against a dynamic secret and updates the user's password in the database using bcrypt hashing.",
        operationId: "resetPassword",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "The unique MongoDB ID of the user.",
            schema: {
              type: "string",
              example: "65ab123cd456ef7890",
            },
          },
          {
            name: "token",
            in: "path",
            required: true,
            description: "The JWT reset token received via email.",
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "user@example.com",
                  },
                  password: {
                    type: "string",
                    format: "password",
                    description: "The new strong password.",
                    example: "NewStrongPass!123",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Password updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example:
                        "Password updated successfully. You can now log in.",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Bad Request - Missing fields or token",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "All fields are required.",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized - Invalid or expired reset token",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Invalid or expired reset link.",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Not Found - User ID not found or email mismatch",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "User not found or email mismatch.",
                    },
                  },
                },
              },
            },
          },
          422: {
            description:
              "Unprocessable Entity - Weak password or invalid email format",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Password is too weak. Must be 8+ chars...",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Internal server error.",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  // Path to the API docs (where you will write the @swagger comments)
  apis: ["./src/routes/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
