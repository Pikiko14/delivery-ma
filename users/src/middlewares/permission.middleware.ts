import { User } from "../interfaces/users.interface";
import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../utils/responseHandler";
import { RequestExt } from "../interfaces/req-ext.interface";

// middleare permission
const perMissionMiddleware = (scope: string) => {
    return (req: RequestExt, res: Response, next: NextFunction) => {
      try {
        const { scopes } = req.user as User; // obtenemos los scopes del usuario que hace la peticion.
        if (scopes && scopes.length > 0) {
            if (!scopes.includes(scope)) { // si el usuario no cuenta con el permiso de ver el recurso
                return ResponseHandler.handleDenied(res, {}, "Don´t have permission for do this action.");
            }
            next(); // pasa la peticion normal.
        } else {
          // El usuario no tiene el permiso, devuelve una respuesta de no autorizado
          return ResponseHandler.handleDenied(res, {}, "Don´t have permission for do this action.");
        }
      } catch (e) {
        return ResponseHandler.handleDenied(res, {}, "Error on permission valdiations.");
      }
    };
};

export default perMissionMiddleware;