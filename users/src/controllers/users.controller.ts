import { Response, Request } from "express";
import { matchedData } from 'express-validator';
import { User } from "../interfaces/users.interface";
import { UsersService } from "../services/users.service";
import { ResponseHandler } from "../utils/responseHandler";
import { RequestExt } from './../interfaces/req-ext.interface';

export class UsersController {
  private service: UsersService;

  constructor() {
    this.service = new UsersService();
  }

  /**
   * Create new user
   * @param { RequestExt } req Express request with extend data
   * @param res Express response
   * @returns Promise<void>
   */
  createUsers = async (req: RequestExt, res: Response): Promise<void | User | null>  => {
    try {
      const { user } = req;
      const body = matchedData(req) as User;
      return await this.service.createUsers(res, body, user._id);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  }

  /**
   * List users
   * @param { RequestExt } req Express request with extend data
   * @param res Express response
   * @returns Promise<void>
   */
  listUsers = async (req: RequestExt, res: Response): Promise<void | User | null>  => {
    try {
      const { user } = req;
      const { page, perPage, search, fields } = req.query as any; // get pagination data
      return await this.service.listUsers(res, user.parent || user._id, page, perPage, search);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  }

  /**
   * Show users
   * @param { RequestExt } req Express request with extend data
   * @param res Express response
   * @returns Promise<void>
   */
  showUsers = async (req: Request, res: Response): Promise<void | User | null>  => {
    try {
      const { id } = req.params;
      return await this.service.showUsers(res, id);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message);
    }
  }
}
