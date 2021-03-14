import { take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export function appInitializer(authService: AuthService): () => Promise<unknown> {
  return () =>
    new Promise((resolve) => {
      authService.refreshToken().pipe(take(1)).subscribe().add(resolve);
    });
}
