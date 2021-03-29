import { HttpParams } from '@angular/common/http';

export function createQueryParameters<T = Record<string, unknown>>(
  params?: T,
): { params: HttpParams } {
  const query = params ? params : {};
  return { params: new HttpParams({ fromObject: query }) };
}
