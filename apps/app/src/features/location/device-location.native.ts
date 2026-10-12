import type { PointInput } from '@klozbuy/contracts';
import * as Location from 'expo-location';

/** Native: asks for foreground permission once, then reads a coarse position. */
export async function getDeviceLocation(): Promise<PointInput> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') throw new Error('Location permission was declined');
  const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  return { lat: position.coords.latitude, lng: position.coords.longitude };
}
