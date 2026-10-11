import * as Network from 'expo-network';
import { readRoutedAddress } from './readRoutedAddress';
import { isUsableIpv4Address } from './isUsableIpv4Address';

async function readWifiAddress() {
  try {
    return await Network.getIpAddressAsync();
  } catch {
    return null;
  }
}

export async function readNetworkAddress() {
  const wifiAddress = await readWifiAddress();
  if (isUsableIpv4Address(wifiAddress)) {
    return wifiAddress;
  }
  const routedAddress = await readRoutedAddress();
  return isUsableIpv4Address(routedAddress) ? routedAddress : null;
}
