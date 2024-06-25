/**
 * IP address representation.
 * @class
 */
export class IP {
    /**
     * @param {string | ArrayBuffer | Buffer} value Source of IP address, can be string, ArrayBuffer or Buffer.
     */
    constructor(value: string | ArrayBuffer | Buffer);
    /**
     * @private
     * @type {Address6} -
     */
    private _raw_address;
    /**
     * Checks if current IP address is IPv4.
     * @returns {boolean} -
     */
    is4(): boolean;
    /**
     * Checks if current IP address is equal to another IP address.
     * @param {IP} ip IP address to check equality.
     * @returns {boolean} -
     * @throws {Error} If one or both IP addresses are subnets.
     */
    equals(ip: IP): boolean;
    /**
     * Checks if current IP address is in subnet of another IP address
     * @param {IP} ip IP address to check
     * @returns {boolean} -
     */
    includes(ip: IP): boolean;
    /**
     * Returns IP address as string.
     * @returns {string} -
     */
    toString(): string;
    /**
     * Returns IP address as byte array.
     * @returns {number[]} -
     */
    toByteArray(): number[];
    /**
     * Returns IP address as ArrayBuffer.
     * @returns {ArrayBuffer} -
     */
    toArrayBuffer(): ArrayBuffer;
    /**
     * Returns IP address as Node.js Buffer.
     * @returns {Buffer} -
     */
    toBuffer(): Buffer;
    #private;
}
