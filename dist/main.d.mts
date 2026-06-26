import { Address6 } from "ip-address";

//#region src/ip.d.ts
declare class IP {
  #private;
  constructor(value: string | ArrayBuffer | Uint8Array | Buffer);
  /** @deprecated This property is for internal use only. */
  get address6(): Address6;
  /** Checks if current IP address is IPv4. */
  is4(): boolean;
  /**
  * Checks if current IP address is private, i.e. belongs to one of the private networks:
  * - `10.0.0.0/8`
  * - `172.16.0.0/12`
  * - `192.168.0.0/16`
  * - `fc00::/7`
  */
  isPrivate(): boolean;
  /**
  * Checks if current IP address is loopback, i.e. belongs to one of:
  * - `127.0.0.0/8`
  * - `::1/128`
  */
  isLoopback(): boolean;
  /**
  * Checks if current IP address is equal to another IP address.
  * @param ip IP address to check equality.
  */
  equals(ip: IP): boolean;
  /** Returns IP address as string. */
  toString(): string;
  /** Returns IP address as Uint8Array. */
  toBytes(): Uint8Array;
  /** Returns IP address as an array of uint8 numbers. */
  toByteArray(): number[];
  /** Returns IP address as ArrayBuffer. */
  toArrayBuffer(): ArrayBuffer;
  /**
  * Returns IP address as Node.js Buffer.
  * @deprecated Use `.toBytes()` to receive a Uint8Array instead of Node.js Buffer.
  * @see https://sindresorhus.com/blog/goodbye-nodejs-buffer
  */
  toBuffer(): Buffer;
}
//#endregion
//#region src/cidr.d.ts
declare class CIDR {
  #private;
  readonly ip: IP;
  readonly ip_start: IP;
  readonly ip_end: IP;
  readonly mask: number;
  constructor(value: string);
  constructor(value: ArrayBuffer | Uint8Array | Buffer, mask: number);
  constructor(ip: IP, mask: number);
  /**
  * Checks if IP address is in subnet of current CIDR.
  * @param ip IP address to check.
  */
  includes(ip: IP): boolean;
  /** Returns IP addCIDRress as string. */
  toString(): string;
}
//#endregion
export { CIDR, IP };