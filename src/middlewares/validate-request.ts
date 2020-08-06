/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Request, Response, NextFunction } from 'express';
import HTTPStatusCode from 'http-status-codes';

import AppError from '../errors/AppError';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (schema: any, scope: string) => async (
  req: Request,
  res: Response,
  next: NextFunction,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await schema[scope].validateAsync((req as any)[scope]);
  } catch (err) {
    throw new AppError("There's a parameter error", HTTPStatusCode.BAD_REQUEST);
  }

  return next();
};
