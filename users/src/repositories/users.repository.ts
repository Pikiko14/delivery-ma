import { Model } from "mongoose";
import UserModel from "../models/users.model";
import { User } from "../interfaces/users.interface";
import { PaginationInterface } from "../interfaces/response.interface";

class UsersRepository {
  private readonly model: Model<User>;

  constructor() {
    this.model = UserModel;
  }

  /**
   * Get User by Username
   * @param username String
   */
  public async getUserByUsername(username: string): Promise<User | void | null> {
    return await this.model.findOne({
      $or: [
        { username: username },
        { email: username }
      ]
    });
  }

  /**
   * Get User by email
   * @param email String
   */
  public async getUserByEmail(email: string): Promise<User | void | null> {
    return await this.model.findOne({ email });
  }

  /**
   * Get User by email
   * @param token String
   */
  public async getUserByToken(token: string): Promise<User | void | null> {
    return await this.model.findOne({
      $or: [
        { confirmation_token: token },
        { recovery_token: token }
      ]
    });
  }

  /**
   * delete user
   */
  public async deleteUser(id: string): Promise<User | void | null> {
    return await this.model.findByIdAndDelete(id);
  }

  /**
   * Save user in bbdd
   * @param user User
   */
  public async create (user: User): Promise<User> {
    const userBd = await this.model.create(user);
    return userBd;
  }

  /**
   * Update user data
   * @param id
   * @param body
   */
  public async update (id: string, body: User): Promise<User | void | null> {
    return await this.model.findByIdAndUpdate(id, body);
  }

  /**
   * paginate users
   * @param page
   * @param perPage
   * @param search
   */
  public async paginate (query: any, skip: number, perPage: number): Promise<PaginationInterface> {
    const users = await this.model.find(query)
    .skip(skip)
    .limit(perPage);
    const totalUsers = await this.model.find(query).countDocuments();
    return {
      data: users,
      totalItems: totalUsers
    }
  }
}

export default UsersRepository;
