import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { AuthProvider } from '@/hooks/auth';

import { Home } from './src/screens/Home';

const App = () => {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  return (
    <AuthProvider>
      <StatusBar style="light" backgroundColor="transparent" translucent />
      {fontsLoaded ? <Home /> : <AppLoading />}
    </AuthProvider>
  );
};

export default App;
