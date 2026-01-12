import { Table as Model } from '@/models';
import { Itable } from '@/types';
import { create } from './create';
import { update } from './update';
import { remove } from './remove';
import { read } from './read';

export const tableController = (() => {
  const allowedFields: (keyof Itable)[] = [
    "restaurantId",
    "tableNumber",
    "capacity",
  ];

  return {
    create: (req: any, res: any) => create(req, res, Model, allowedFields),
    update: (req: any, res: any) => update(req, res, Model, allowedFields),
    delete: (req: any, res: any) => remove(req, res, Model),
    read: (req: any, res: any) => read(req, res, Model),
  };
})();
