/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import { useColorScheme, View, Text, LogBox } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import persistStore from 'redux-persist/es/persistStore';
import store from './app/store';
import { ignoreLogs } from './functions/functions';
import Orientation from 'react-native-orientation-locker';
import RootNavigator from './Routes/RootNavigator';
import { Root } from 'react-native-alert-notification';

// ignoreLogs();
LogBox.ignoreAllLogs();

Orientation.lockToPortrait();

let persistor = persistStore(store);

interface AppProps {
}
const App: React.FC<AppProps> = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Root theme='dark'>
          <RootNavigator />
        </Root>
      </PersistGate>
    </Provider>
  );
};

export default App;
