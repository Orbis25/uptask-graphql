import React from 'react';
import 'react-native-gesture-handler';
import Navigation from './src/navigation';
import {ThemeProvider} from 'react-native-elements';

const App = () => {
  return (
    <ThemeProvider>
      <Navigation />
    </ThemeProvider>
  );
};

export default App;
