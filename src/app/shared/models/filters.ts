export namespace Filters {
  export type StringFilter<T = string> = T | T[];

  export type IdFilter = string | string[];

  export type BooleanFilter = boolean;

  export type DateFilter = DateFilterObject;

  interface DateFilterObject {
    after?: Date;
    before?: Date;
  }
}
