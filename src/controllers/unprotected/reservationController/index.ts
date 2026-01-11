import { Reservation as Model } from "@/models";
import { Ireservation } from "@/types";
import { create } from "./create";
import { update } from "./update";
import { remove } from "./remove";
import { read } from "./read";

export const reservationController = (() => {
  
  const allowedFields: (keyof Ireservation)[] = [
    "customerName",
    "customerPhone",
    "customerEmail",
    "restaurantId",
    "tableId",
    "status",
    "startTime",
    "endTime",
    "partySize",
  ];

  return {
    create: (req: any, res: any) => create(req, res, Model, allowedFields),
    update: (req: any, res: any) => update(req, res, Model, allowedFields),
    delete: (req: any, res: any) => remove(req, res, Model),
    read: (req: any, res: any) => read(req, res, Model),
  };
})();
