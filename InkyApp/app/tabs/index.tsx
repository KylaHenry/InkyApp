import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LibraryScreen from './library'; // Ensure correct import path
import HomeScreen from '../index'; // Assuming your home screen is in app/index.tsx

const Tab = createBottomTabNavigator();

export default function TabsNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Library" component={LibraryScreen} />
    </Tab.Navigator>
  );
}
