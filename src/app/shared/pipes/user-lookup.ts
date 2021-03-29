import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Pipe({ name: 'userLookup' })
export class UserLookupPipe implements PipeTransform {
  private authService: AuthService;

  public constructor(authService: AuthService) {
    this.authService = authService;
  }

  public transform(userId: string): Observable<string> {
    return this.authService.users.pipe(
      map((users) => {
        const exist = users.find((user) => user.id === userId);
        return exist?.email || userId;
      }),
    );
  }
}
