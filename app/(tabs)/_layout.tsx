import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import { Activity, CircleDollarSign, LayoutDashboard, Settings } from 'lucide-react-native';
import React from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import Colors from '@/src/constants/Colors';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext(Navigator);

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <MaterialTopTabs
      tabBarPosition="bottom"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderTopWidth: 1,
          borderTopColor: Colors[colorScheme ?? 'light'].border || '#333',
        },
        tabBarIndicatorStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].tint,
          height: 3,
          top: 0,
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          textTransform: 'none',
          fontWeight: 'bold',
        },
        tabBarShowIcon: true,
      }}>
      <MaterialTopTabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }: { color: string }) => <LayoutDashboard size={24} color={color} />,
        }}
      />
      <MaterialTopTabs.Screen
        name="health"
        options={{
          title: 'Bio-Hacks',
          tabBarIcon: ({ color }: { color: string }) => <Activity size={24} color={color} />,
        }}
      />
      <MaterialTopTabs.Screen
        name="rewards"
        options={{
          title: 'Rewards',
          tabBarIcon: ({ color }: { color: string }) => <CircleDollarSign size={24} color={color} />,
        }}
      />
      <MaterialTopTabs.Screen
        name="settings"
        options={{
          title: 'Config',
          tabBarIcon: ({ color }: { color: string }) => <Settings size={24} color={color} />,
        }}
      />
      <MaterialTopTabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </MaterialTopTabs>
  );
}
