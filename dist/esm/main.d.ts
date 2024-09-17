import { Address6 } from 'ip-address';
/**
 * IP address representation.
 * @class
 */
export declare class IP {
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
