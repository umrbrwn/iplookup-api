export function CustomError(error) {
  if (typeof error === 'string') {
    error = { message: error }
  }
  this.statusCode = error.statusCode || 400;
  this.message = error.message || 'Bad Request';
}
CustomError.prototype = Object.create(Error.prototype);
