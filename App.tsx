/**
 * Main App Component
 */

import React from 'react';
import {StatusBar} from 'react-native';
import {PaperProvider} from 'react-native-paper';
import {AppNavigator} from './src/navigation/AppNavigator';

const App: React.FC = () => {
  return (
    <PaperProvider>
      <StatusBar barStyle="dark-content" />
      <AppNavigator />
    </PaperProvider>
  );
};

export default App;

