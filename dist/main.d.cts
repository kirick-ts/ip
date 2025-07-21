import { Address6 } from "ip-address";

//#region src/main.d.ts
declare class IP {
  raw_address: Address6;
  /**
  * @param value Source of IP address, can be string, ArrayBuffer or Buffer.
  */
  constructor(value: string | ArrayBuffer | Buffer);
  /**
  * Returns IP address as IPv4.
  * @returns -
  */
  private getAddressAs4;
  /**
  * Checks if current IP address is IPv4.
  * @returns -
  */
  is4(): boolean;
  /**
  * Checks if current IP address is private, i.e. belongs to one of the private networks:
  * - `10.0.0.0/8`
  * - `172.16.0.0/12`
  * - `192.168.0.0/16`
  * - `fc00::/7`
  * @returns -
  */
  isPrivate(): boolean;
  /**
  * Checks if current IP address is loopback, i.e. belongs to one of:
  * - `127.0.0.0/8`
  * - `::1/128`
  * @returns -
  */
  isLoopback(): boolean;
  /**
  * Checks if current IP address is equal to another IP address.
  * @param ip IP address to check equality.
  * @returns -
  * @throws {Error} If one or both IP addresses are subnets.
  */
  equals(ip: IP): boolean;
  /**
  * Checks if current IP address is in subnet of another IP address
  * @param ip IP address to check
  * @returns -
  */
  includes(ip: IP): boolean;
  /**
  * Returns IP address as string.
  * @returns -
  */
  toString(): string;
  /**
  * Returns IP address as byte array.
  * @returns -
  */
  toByteArray(): number[];
  /**
  * Returns IP address as ArrayBuffer.
  * @returns -
  */
  toArrayBuffer(): ArrayBuffer;
  /**
  * Returns IP address as Node.js Buffer.
  * @returns -
  */
  toBuffer(): Buffer;
}
//#endregion
export { IP };