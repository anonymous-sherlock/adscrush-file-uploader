export class ValidationError extends Error {
    status: number;
  
    constructor(message: string, status: number) {
      super(message);
      this.name = "ValidationError";
      this.status = status;
    }
  }
  