import { User } from "@entities/user";
import { IUserService } from "@services/contracts/user.service.interface";
import BaseService from "@services/implements/base.service";

export default class UserService extends BaseService<User> implements IUserService {}