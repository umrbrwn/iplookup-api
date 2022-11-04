/**
 * Converts IPv4 address to integer
 * @param {*} ip IPv4 address
 * @returns numeric format of the given ip
 */
// Using bit shift technique [shorturl.at/cwGO9]
export const ipToInt = (ip, separator = '.') => {
  const [a, b, c, d] = ip.split(separator);
  return (((a ? a << 24 : 0) | (b ? b << 16 : 0) | (c ? c << 8 : 0) | (d)) >>> 0);
};

/**
 * Converts IPv4 address to integer while truncating number of bits
 * @param {*} ip IPv4 address
 * @param {*} separator IP address separator notation
 * @param {*} bits Number of bits to truncate 0 is default. Can set to (8, 16, 24 bits)
 * @returns numeric format of the given ip
 */
export const ipToIntTrunk = (ip, separator = '.', bits = 0) => {
  const [a, b, c, d] = ip.split(separator);
  const dw = ((a ? a << 24 : 0) | (b ? b << 16 : 0) | (c ? c << 8 : 0) | (d));
  const bitmap = { 0: 0, 8: 0xFF, 16: 0xFFFF, 24: 0xFFFFFF };
  return ((dw & ~(bitmap[bits])) >>> 0);
}
