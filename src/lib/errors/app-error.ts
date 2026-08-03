export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status = 400,
  ) {
    super(message);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "You do not have permission to perform this action.") {
    super(message, "authorization_denied", 403);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Please sign in to continue.") {
    super(message, "authentication_required", 401);
  }
}
