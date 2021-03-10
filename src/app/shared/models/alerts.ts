export namespace Alerts {
  export type Type = 'error' | 'info' | 'success' | 'warning';
  export interface Alert {
    type: Type;
    message: string;
    autoClose?: AlertLength;
  }

  export const enum AlertLength {
    Long = 3000,
    Normal = 2000,
    Short = 1000,
  }
}
