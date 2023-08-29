import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  //실무에서는 nest morgan을 사용하자
  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      req['startTime'] = Date.now();
      this.logger.log(
        `${req.ip}, ${req.method}, ${res.statusCode}, ${req.originalUrl} `,
      );
    });
    next();
  }
}
