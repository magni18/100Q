const IPV4_PATTERN = /^\d{1,3}(\.\d{1,3}){3}$/;
const UNASSIGNED_ADDRESS = '0.0.0.0';

export function isUsableIpv4Address(address) {
  return typeof address === 'string' && IPV4_PATTERN.test(address) && address !== UNASSIGNED_ADDRESS;
}
