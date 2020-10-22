import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

//screens
import LoginScreen from '../views/LoginScreen';
import CreateAccountScreen from '../views/CreateAccountScreen';

const {Screen, Navigator} = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Navigator
        initialRouteName="login"
        screenOptions={{
          cardStyle: {backgroundColor: '#D32F2F'},
        }}>
        <Screen
          options={{headerShown: false}}
          name="login"
          component={LoginScreen}
        />
        <Screen
          options={{
            title: 'Crear cuenta',
            headerStyle: {
              backgroundColor: '#000',
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
          }}
          name="CreateAccount"
          component={CreateAccountScreen}
        />
      </Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
