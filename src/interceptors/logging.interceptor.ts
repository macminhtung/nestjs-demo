import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, ip } = req;
    const now = Date.now();
    const userAgent = req.get('user-agent');

    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(`${now} - ${ip} - ${method} - ${url} - ${userAgent}`),
        ),
      );
  }
}
