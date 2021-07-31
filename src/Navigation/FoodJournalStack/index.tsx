import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { navTheme } from '../../StyleSheet';
import screens from './Screens';
import { container, UserContainerProps } from '../../store/reducers/User';
import { authService } from '../../Firebase';
import { Button, Icon } from 'react-native-elements';
import { Alert } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { LoggedInDrawerParams } from '../LoggedInDrawer/Screens';

const Stack = createStackNavigator();

function Navigation({
  storeLogin,
  navigation,
}: UserContainerProps & {
  navigation: DrawerNavigationProp<LoggedInDrawerParams, 'Food Journal'>;
}): JSX.Element {
  const logout = () => {
    Alert.alert('Log out', 'Do you want to log out?', [
      { text: 'No', onPress: () => null },
      {
        text: 'Yes',
        onPress: () => {
          authService.logout();
          storeLogin({ uid: undefined, email: undefined });
        },
      },
    ]);
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: navTheme.colors.primary,
        },
        headerTitleStyle: {
          color: navTheme.colors.text,
        },
        headerTintColor: navTheme.colors.text,
        headerLeft: () => (
          <Button
            icon={<Icon name={'menu'} />}
            onPress={() => navigation.toggleDrawer()}
          />
        ),
        headerRight: () => (
          <Button
            icon={<Icon name={'power-settings-new'} />}
            onPress={logout}
          />
        ),
      }}
    >
      {screens.map((screen, index) => (
        <Stack.Screen
          name={screen.name}
          component={screen.component}
          options={screen.options as any}
          key={index}
        />
      ))}
    </Stack.Navigator>
  );
}

export default container(Navigation);
