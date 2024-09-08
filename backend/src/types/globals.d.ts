import { User } from '../models/User';

type RequestUserProp = {
  user?: User | null;
};

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Request extends RequestUserProp {}
  }
}
