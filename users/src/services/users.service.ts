import { Response } from "express";
import { Utils } from "../utils/utils";
import messageBroker from "../utils/messageBroker";
import { User } from "../interfaces/users.interface";
import { ResponseHandler } from "../utils/responseHandler";
import UsersRepository from "../repositories/users.repository";
import { PaginationInterface } from "../interfaces/response.interface";
import { MessageBrokerInterface, TypeNotification } from "../interfaces/broker.interface";

class UsersService extends UsersRepository {
  private utils: Utils;

  constructor() {
    super();
    this.utils = new Utils();
  }

  /**
   * Create new user
   * @param { Response } resp The response object
   * @param body The body of the request
   * @param userId The parent user id
   * @returns A Promise of 1
   */
  public async createUsers(
    res: Response,
    body: User,
    userId: string
  ): Promise<User | void | null> {
    try {
      // set password
      body.password = await this.utils.encryptPassword(body.password);

      // set parent
      body.parent = userId;

      // create user on bbdd
      const user: any = await this.create(body);

      // set token recovery valid by 1d
      user.confirmation_token = await this.utils.generateToken(user);
      await this.update(user.id, user);

      // push notification queue
      const message: MessageBrokerInterface = {
        data: user,
        type_notification: TypeNotification.EMAIL,
        template: "welcome",
      }
      await messageBroker.publishMessage('notifications', message);

      // return data
      return ResponseHandler.createdResponse(
        res,
        user,
        "User created correctly"
      );
    } catch (error: any) {
      throw error.message;
    }
  }

  /**
   * List users
   * @param { Response } resp The response object
   * @param userId The parent user id
   * @param { number } page Number page
   * @param { number } perPage Rows by page
   * @param { string } search Search string
   * @returns A Promise of 1
   */
  public async listUsers(
    res: Response,
    userId: string,
    page: number,
    perPage: number,
    search: string
  ): Promise<User | void | null> {
    try {
       // validamos la data de la paginacion
       page = page || 1;
       perPage = perPage || 12;
       const skip = (page - 1) * perPage;
 
       // Iniciar busqueda
       let query: any = {
        parent: userId
       };
       if (search) {
          const searchRegex = new RegExp(search, 'i');
          query.$or = [
            { name: searchRegex },
            { email: searchRegex },
            { last_name: searchRegex },
            { username: searchRegex },
            { role: searchRegex },
          ];
       }

      // get users
      const users: PaginationInterface = await this.paginate(query, skip, perPage);

      // return data
      return ResponseHandler.createdResponse(
        res,
        {
          users: users.data,
          totalItems: users.totalItems
        },
        "Users list"
      );
    } catch (error: any) {
      throw error.message;
    }
  }

  /**
   * Show user
   * @param { Response } resp The response object
   * @param { string } userId
   */
  public async showUsers(
    res: Response,
    userId: string,
  ): Promise<User | void | null> {
    try {
      // get user
      const user: User | void | null = await this.getUserById(userId);

      // return data
      return ResponseHandler.createdResponse(
        res,
        {
          user,
        },
        "Users data"
      );
    } catch (error: any) {
      throw error.message;
    }
  }
}

export { UsersService };
