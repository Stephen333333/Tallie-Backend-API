import express from 'express';
import { catchErrors } from '@/handlers/error/errorHandlers';
import { restaurantController, tableController, reservationController} from '@/controllers/unprotected';
export const router = express.Router();

// restaurant routes
router.route(`/restaurant/create`).post(catchErrors(restaurantController.create));
router.route(`/restaurant/read/:id`).get(catchErrors(restaurantController.read));
router.route(`/restaurant/update/:id`).patch(catchErrors(restaurantController.update));
router.route(`/restaurant/delete/:id`).delete(catchErrors(restaurantController.delete));

// table routes
router.route(`/table/create`).post(catchErrors(tableController.create));
router.route(`/table/read/:id`).get(catchErrors(tableController.read));
router.route(`/table/update/:id`).patch(catchErrors(tableController.update));
router.route(`/table/delete/:id`).delete(catchErrors(tableController.delete));

// reservation routes
router.route(`/reservation/create`).post(catchErrors(reservationController.create));
router.route(`/reservation/read/:id`).get(catchErrors(reservationController.read));
router.route(`/reservation/update/:id`).patch(catchErrors(reservationController.update));
router.route(`/reservation/delete/:id`).delete(catchErrors(reservationController.delete));

