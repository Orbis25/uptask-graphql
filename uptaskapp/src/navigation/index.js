import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

//screens
import LoginScreen from '../views/LoginScreen';
import CreateAccountScreen from '../views/CreateAccountScreen';
import HomeScreen from '../views/HomeScreen';
import CreateProjectScreen from '../views/CreateProjectScreen';
import ProjectDetail from '../views/ProjectDetail';

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
        <Screen
          options={{
            title: 'Proyectos',
            headerStyle: {
              backgroundColor: '#000',
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
          }}
          name="home"
          component={HomeScreen}
        />
        <Screen
          options={{
            title: 'Nuevo Proyecto',
            headerStyle: {
              backgroundColor: '#000',
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
          }}
          name="newProject"
          component={CreateProjectScreen}
        />
        <Screen
          options={({route}) => ({ //dinamic title
            title: route.params.name,
            headerStyle: {
              backgroundColor: '#000',
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
          })}
          name="ProjectDetail"
          component={ProjectDetail}
        />
      </Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
