/**
 * App Navigator
 * Main navigation structure
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen} from '../screens/HomeScreen';
import {CameraScreen} from '../screens/CameraScreen';
import {ResultsScreen} from '../screens/ResultsScreen';
import {ProcedureDetailScreen} from '../screens/ProcedureDetailScreen';

export type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
  Results: {analysisResult: any};
  ProcedureDetail: {analysis: any};
  Report: {analysisResult: any};
  History: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: {backgroundColor: '#fff'},
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
        <Stack.Screen name="ProcedureDetail" component={ProcedureDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

