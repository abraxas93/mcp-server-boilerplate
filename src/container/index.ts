import {
  IMathService,
  IErrorService,
  MathService,
  ErrorService,
} from 'src/services';

export interface IContainer {
  mathService: IMathService;
  errorService: IErrorService;
}

export default function createContainer(): IContainer {
  return {
    mathService: new MathService(),
    errorService: new ErrorService(),
  };
}
