import { reactotron } from '../configs/global/reactotron';

export function reactotronError(title: string, message: any) {
  return reactotron.log(title, message);
}
