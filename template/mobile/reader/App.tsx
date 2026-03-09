import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FileListScreen } from './src/screens/FileListScreen';
import { ReaderScreen } from './src/screens/ReaderScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { useAppStore } from './src/store/useAppStore';

const Tab = createBottomTabNavigator();

export default function App() {
  const bootstrap = useAppStore((state) => state.bootstrap);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Tab.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
          <Tab.Screen name="Files" component={FileListScreen} options={{ title: '목록' }} />
          <Tab.Screen name="Reader" component={ReaderScreen} options={{ title: '리더' }} />
          <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: '설정' }} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
