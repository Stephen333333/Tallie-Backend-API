import { Response, Request } from "express";
import { Ireservation } from "@/types";
import { Table, Restaurant } from "@/models";

export const update = async (
  req: Request<{ id: string }, {}, Partial<Ireservation>>,
  res: Response,
  Model: any,
  allowedFields: (keyof Ireservation)[]
) => {
  const { id } = req.params;
  const existingReservation = await Model.findById(id);
  if (!existingReservation) {
    return res.status(404).json({
      success: false,
      message: Model.modelName + " not found",
    });
  }

  const restaurantId =
    req.body.restaurantId ?? existingReservation.restaurantId;
  const tableId = req.body.tableId ?? existingReservation.tableId;
  const partySize = req.body.partySize ?? existingReservation.partySize;
  const startTime = req.body.startTime ?? existingReservation.startTime;
  const endTime = req.body.endTime ?? existingReservation.endTime;
  const status = req.body.status ?? existingReservation.status;

  const [restaurant, table] = await Promise.all([
    Restaurant.findOne({
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
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  if (startDate >= endDate) {
    return res.status(400).json({
      success: false,
      message: "End time must be after start time",
    });
  }

  if (startDate.toDateString() !== endDate.toDateString()) {
    return res.status(400).json({
      success: false,
      message: "Reservations cannot span multiple days",
    });
  }

  const reservationDay = startDate
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();

  const openingHours = restaurant.openingHours;

  if (!openingHours) {
    return res.status(400).json({
      success: false,
      message: "Restaurant opening hours not configured",
    });
  }

  const dayHours = openingHours.get(reservationDay);

  if (!dayHours || dayHours.isClosed) {
    return res.status(400).json({
      success: false,
      message: `Restaurant is closed on ${reservationDay}`,
    });
  }

  const startMinutes = startDate.getHours() * 60 + startDate.getMinutes();
  const endMinutes = endDate.getHours() * 60 + endDate.getMinutes();

  const { openingTime, closingTime } = dayHours;

  if (openingTime == null || closingTime == null) {
    return res.status(400).json({
      success: false,
      message: `Opening hours not set for ${reservationDay}`,
    });
  }

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

  if (table.capacity < partySize) {
    return res.status(400).json({
      success: false,
      message: `Table capacity of ${table.capacity} is less than party size of ${partySize}`,
    });
  }

  const overlappingReservation = await Model.findOne({
    _id: { $ne: id },
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
      message: `Table ${table.tableNumber} is already reserved for the selected time range`,
    });
  }

  const result = await Model.findByIdAndUpdate(
    id,
    {
      ...req.body,
      restaurantId,
      tableId,
      partySize,
      startTime,
      endTime,
      status,
    },
    { new: true, runValidators: true }
  );

  return res.status(200).json({
    success: true,
    result,
    message: Model.modelName + " updated successfully",
  });
};
