import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/main/HomeScreen';
import { FavoritesScreen } from '../screens/main/FavoritesScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { MainTabParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

const Tab = createBottomTabNavigator<MainTabParamList>();

const getIconName = (routeName: string, focused: boolean): keyof typeof Ionicons.glyphMap => {
  switch (routeName) {
    case 'Home':
      return focused ? 'home' : 'home-outline';
    case 'Favorites':
      return focused ? 'heart' : 'heart-outline';
    case 'Profile':
    default:
      return focused ? 'person' : 'person-outline';
  }
};

export const MainTabNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = getIconName(route.name, focused);
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 56,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favorites' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};
