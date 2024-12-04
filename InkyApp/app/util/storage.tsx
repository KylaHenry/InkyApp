// app/utils/storage.ts

import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isWeb = Platform.OS === 'web';

const storage = {
  getItemAsync: isWeb
    ? AsyncStorage.getItem
    : SecureStore.getItemAsync,
  setItemAsync: isWeb
    ? AsyncStorage.setItem
    : SecureStore.setItemAsync,
  deleteItemAsync: isWeb
    ? AsyncStorage.removeItem
    : SecureStore.deleteItemAsync,
};

export default storage;
