import SwipeNavigator from 'react-native-swipe-navigation';

import { QRScreen, HomeScreen, SettingsPage } from '../Pages';

const Navigator = SwipeNavigator({
  Home: {
    screen: HomeScreen,
    left: 'QR',
    right: 'Settings',
  },

  Settings: {
    screen: SettingsPage,
    left: 'Home'
},

  QR: {
    screen: QRScreen,
    right: 'HomePage',
  },

});

export default Navigator