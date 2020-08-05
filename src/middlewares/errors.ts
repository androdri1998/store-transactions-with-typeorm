import { Request, Response, NextFunction } from 'express';

import AppError from '../errors/AppError';

export default function (
  err: Error,
  req: Request,
  res: Response,
  _: NextFunction,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Response<any> {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ status: 'error', error: err.message });
  }

  // eslint-disable-next-line no-console
  console.error(err);

  return res
    .status(500)
    .json({ status: 'error', error: 'Internal server error' });
}
