//middleware personalizado para usar nos serviços e mostrar ao cliente
export class AppError extends Error {
   statusCode: number;

   constructor (statusCode: number, message: string) {
      super(message);
      this.statusCode = statusCode;
   }
}
