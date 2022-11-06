import reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules } from 'react-native';
import url from 'url';

const { hostname } = url.parse(NativeModules.SourceCode.scriptURL);

reactotron
  .setAsyncStorageHandler(AsyncStorage)
  .configure({
    name: 'NLW',
    host: hostname,
    port: 9090,
  })
  .useReactNative({
    asyncStorage: false,
    networking: {
      ignoreUrls: /symbolicate|127.0.0.1/,
    },
    editor: false,
    errors: { veto: (stackfram) => false },
    overlay: false,
  });

export { reactotron };
