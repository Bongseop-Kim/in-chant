import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// inerceptor는 컨트롤러에서 @UseInterceptors(<인터셉터네임>) 방식으로 사용한다.
// https://docs.nestjs.com/interceptors 참조

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    //console.log("befor....") before는 주로 미들웨어에서 다루어서 거의 사용하지 않는다.

    return next.handle().pipe(
      map((data) => {
        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          success: true,
          data,
        };
      }),
    );
  }
}
