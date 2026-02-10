export interface ICreateRatingDTO {
  userId?: string;           // Usuario que RECIBE la calificación (quien es calificado)       // Usuario que HACE la calificación (quien califica)
  workId?: string;
  score?: number;
  comment?: string;
  type?: "worker" | "employer";  // Rol del usuario calificado: "worker" si calificas a un trabajador, "employer" si calificas a un empleador
}