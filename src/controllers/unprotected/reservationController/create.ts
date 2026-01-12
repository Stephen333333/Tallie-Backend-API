import { Response, Request } from "express";
import { Ireservation } from "@/types";
import { Table } from "@/models";

export const create = async (
  req: Request<{}, {}, Ireservation>,
  res: Response,
  Model: any,
  allowedFields: (keyof Ireservation)[]
) => {
  const {
    restaurantId,
    tableId,
    customerName,
    customerPhone,
    customerEmail,
    partySize,
    startTime,
    endTime,
  } = req.body;

  const [restaurant, table] = await Promise.all([
    Model.findOne({
      _id: restaurantId,
      removed: false,
    }),
    Table.findOne({
      _id: tableId,
      removed: false,
      restaurantId,
    }),
  ]);
  if (!restaurant || !table) {
    return res.status(404).json({
      success: false,
      message: "Restaurant or Table not found",
    });
  }

  // check if the restaurant opening time and closing time allow for the reservation
  const dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  const reservationDay = dayNames[startDate.getDay()];

  const openingHours = restaurant.openingHours;
  const dayHours = openingHours[reservationDay];

  if (!dayHours) {
    return res.status(400).json({
      success: false,
      message: `Restaurant is closed on ${reservationDay}`,
    });
  }

  const startMinutes = startDate.getHours() * 60 + startDate.getMinutes();
  const endMinutes = endDate.getHours() * 60 + endDate.getMinutes();

  const { openingTime, closingTime } = dayHours;

  if (startMinutes < openingTime || endMinutes > closingTime) {
    return res.status(400).json({
      success: false,
      message: `Restaurant is closed during the requested time on ${reservationDay}`,
    });
  }

  if (table.capacity < partySize) {
    return res.status(400).json({
      success: false,
      message: `Table capacity of ${table.capacity} is less than party size of ${partySize}`,
    });
  }

  if (new Date(startTime) >= new Date(endTime)) {
    return res.status(400).json({
      success: false,
      message: "End time must be after start time",
    });
  }

  // check for overlapping reservations
  const overlappingReservation = await Model.findOne({
    tableId,
    restaurantId,
    removed: false,
    status: { $nin: ["cancelled", "completed"] },
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  });

  if (overlappingReservation) {
    return res.status(409).json({
      success: false,
      message:
        "Table " +
        table.tableNumber +
        " is already reserved for the selected time range",
    });
  }

  const result = await new Model({
    restaurantId,
    tableId,
    customerName,
    customerPhone,
    customerEmail,
    partySize,
    startTime,
    endTime,
  }).save();

  return res.status(201).json({
    success: true,
    result,
    message: Model.modelName + " created successfully",
  });
};
