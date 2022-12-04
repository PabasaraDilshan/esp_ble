import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import ConnectionScreen from '../screens/ConnectionScreen';
import SearchScreen from '../screens/SearchScreen';

const Stack = createStackNavigator();

const HomeStackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          //cardStyle:{backgroundColor:'red'}
        }}
        initialRouteName="SearchScreen">
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Connection Screen',
          }}
          name="ConnectionScreen"
          component={ConnectionScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default HomeStackNavigator;
