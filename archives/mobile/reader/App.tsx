import 'react-native-gesture-handler';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThemeProvider, createTheme } from '@rneui/themed';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FileListScreen } from './src/screens/FileListScreen';
import { DocumentIntroScreen } from './src/screens/DocumentIntroScreen';
import { ReaderScreen } from './src/screens/ReaderScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { TAB_ROUTES } from './src/navigation/routes';
import { useAppStore } from './src/store/useAppStore';

const Tab = createBottomTabNavigator();
const theme = createTheme({
  lightColors: {
    primary: '#b45309',
    secondary: '#7c3aed',
    background: '#f4efe6',
    white: '#ffffff',
    black: '#1f2937',
    grey0: '#111827',
    grey1: '#374151',
    grey2: '#4b5563',
    grey3: '#9ca3af',
    grey4: '#d1d5db',
    grey5: '#f9fafb'
  },
  components: {
    Card: {
      containerStyle: {
        shadowColor: '#7c2d12',
        shadowOpacity: 0.08,
        shadowRadius: 18,
        elevation: 2
      }
    }
  }
});

export default function App() {
  const bootstrap = useAppStore((state) => state.bootstrap);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ThemeProvider theme={theme}>
          <NavigationContainer>
            <StatusBar style="dark" />
            <Tab.Navigator
              screenOptions={{
                headerTitleAlign: 'center',
                tabBarActiveTintColor: '#b45309',
                tabBarInactiveTintColor: '#9ca3af',
                tabBarStyle: styles.tabBar,
                headerStyle: styles.header,
                headerTitleStyle: styles.headerTitle
              }}
            >
              <Tab.Screen
                name={TAB_ROUTES.files}
                component={FileListScreen}
                options={{ title: '목록' }}
              />
              <Tab.Screen
                name={TAB_ROUTES.intro}
                component={DocumentIntroScreen}
                options={{ title: '소개' }}
              />
              <Tab.Screen
                name={TAB_ROUTES.reader}
                component={ReaderScreen}
                options={{ title: '리더' }}
              />
              <Tab.Screen
                name={TAB_ROUTES.options}
                component={SettingsScreen}
                options={{ title: '옵션' }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  tabBar: {
    height: 72,
    paddingBottom: 8,
    paddingTop: 8,
    backgroundColor: '#fff8ef',
    borderTopWidth: 0
  },
  header: {
    backgroundColor: '#fff8ef'
  },
  headerTitle: {
    color: '#7c2d12',
    fontWeight: '700'
  }
});
