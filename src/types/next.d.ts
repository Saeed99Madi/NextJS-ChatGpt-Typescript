declare module 'next/font/google' {
  export interface FontOptions {
    subsets: string[];
  }

  export function Inter(options: FontOptions): {
    className: string;
  };
}
