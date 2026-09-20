import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabNavigator } from './MainTabNavigator';
import { ImageDetailScreen } from '../screens/main/ImageDetailScreen';
import { EditProfileScreen } from '../screens/main/EditProfileScreen';
import { MainStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen
        name="ImageDetail"
        component={ImageDetailScreen}
        options={{ presentation: 'card' }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ presentation: 'card', headerShown: true, title: 'Edit Profile' }}
      />
    </Stack.Navigator>
  );
};
