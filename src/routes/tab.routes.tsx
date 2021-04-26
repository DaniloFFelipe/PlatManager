import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import colors from '../styles/colors';
import PlantSelect from '../pages/PlantSelect';
import { MaterialIcons } from '@expo/vector-icons';

const Tabs = createBottomTabNavigator();

const AuthRoutes = () => {
  return (
    <Tabs.Navigator
      tabBarOptions={{
        activeTintColor: colors.green,
        inactiveTintColor: colors.heading,
        labelPosition: 'beside-icon',
        style: {
          paddingVertical: 20,
          height: 88,
        },
      }}
    >
      <Tabs.Screen
        name="NewPlant"
        component={PlantSelect}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons
              name="add-circle-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="MyPlantsSaved"
        component={PlantSelect}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons
              name="format-list-bulleted"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};

export default AuthRoutes;
