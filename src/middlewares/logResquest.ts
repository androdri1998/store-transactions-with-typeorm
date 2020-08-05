/* eslint-disable no-console */
import { Request, Response, NextFunction } from 'express';

function logRequests(req: Request, res: Response, next: NextFunction): void {
  const { method, url } = req;
  const logLabel = `[${method.toUpperCase()}] ${url}`;
  console.time(logLabel);
  next();
  console.timeEnd(logLabel);
}

export default logRequests;
