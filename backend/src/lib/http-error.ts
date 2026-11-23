/** An error the error handler turns into a JSON response with this status. */
export class HttpError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function notFound(what: string): HttpError {
  return new HttpError(404, 'not_found', `${what} not found`);
}
