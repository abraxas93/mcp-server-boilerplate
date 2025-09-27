export interface IMathService {
  add(a: number, b: number): number;
}

export class MathService implements IMathService {
  add(a: number, b: number): number {
    return a + b;
  }
}
