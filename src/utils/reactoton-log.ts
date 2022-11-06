import { reactotron } from '../configs/global/reactotron';

export function reactotronLog(title: string, log: any) {
  return reactotron.log(title, log);
}
