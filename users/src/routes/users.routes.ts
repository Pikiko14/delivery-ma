import  { Router} from "express";
import sessionCheck from "../middlewares/sessions.middleware";
import { ScopesOptions } from "../interfaces/scopes.interface";
import { UsersController } from "../controllers/users.controller";
import { CreateUsersValidator } from "../validators/users.validator";
import perMissionMiddleware from "../middlewares/permission.middleware";

// init router
const router = Router();

// instance controller
const controller = new UsersController();

/**
 * Do register user
 */
router.post(
    '/',
    sessionCheck,
    perMissionMiddleware(ScopesOptions.CREATE),
    CreateUsersValidator,
    controller.createUsers
);

/**
 * Do register user
 */
router.get(
    '/',
    sessionCheck,
    perMissionMiddleware(ScopesOptions.LIST),
    controller.listUsers
);

/**
 * Do show user
 */
router.get(
    '/:id',
    sessionCheck,
    perMissionMiddleware(ScopesOptions.LIST),
    controller.showUsers
);

// export router
export { router };