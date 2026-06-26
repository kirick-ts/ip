import { Address4, Address6 } from 'ip-address';
import { fromBuffer, fromString, getAddress4, SUBNET_4_IN_6 } from './utils.js';

const CIDR_LOOPBACK_4 = new Address4('127.0.0.0/8');
const CIDR_PRIVATE_4 = [
	new Address4('10.0.0.0/8'),
	new Address4('172.16.0.0/12'),
	new Address4('192.168.0.0/16'),
];

const CIDR_LOOPBACK_6 = new Address6('::1/128');
const CIDR_PRIVATE_6 = new Address6('fc00::/7');

export class IP {
	#address6: Address6;

	constructor(value: string | ArrayBuffer | Uint8Array | Buffer) {
		if (typeof value === 'string') {
			this.#address6 = fromString(value);
		} else if (
			value instanceof ArrayBuffer
			|| value instanceof Uint8Array
			|| Buffer.isBuffer(value)
		) {
			this.#address6 = fromBuffer(value);
		} else {
			throw new TypeError(
				`Invalid IP address type (received "${typeof value}")`,
			);
		}

		if (this.#address6.subnetMask !== 128) {
			throw new TypeError('IP address cannot have a subnet mask.');
		}
	}

	/** @deprecated This property is for internal use only. */
	get address6(): Address6 {
		return this.#address6;
	}

	/** Checks if current IP address is IPv4. */
	is4(): boolean {
		return (
			(this.#address6.v4 === true && this.#address6.address4 !== undefined)
			|| this.#address6.isInSubnet(SUBNET_4_IN_6)
		);
	}

	/**
	 * Checks if current IP address is private, i.e. belongs to one of the private networks:
	 * - `10.0.0.0/8`
	 * - `172.16.0.0/12`
	 * - `192.168.0.0/16`
	 * - `fc00::/7`
	 */
	isPrivate(): boolean {
		if (this.#address6.address4) {
			for (const cidr of CIDR_PRIVATE_4) {
				if (this.#address6.address4.isInSubnet(cidr)) {
					return true;
				}
			}
		} else {
			return this.#address6.isInSubnet(CIDR_PRIVATE_6);
		}

		return false;
	}

	/**
	 * Checks if current IP address is loopback, i.e. belongs to one of:
	 * - `127.0.0.0/8`
	 * - `::1/128`
	 */
	isLoopback(): boolean {
		if (this.#address6.address4) {
			return this.#address6.address4.isInSubnet(CIDR_LOOPBACK_4);
		}

		return this.#address6.isInSubnet(CIDR_LOOPBACK_6);
	}

	/**
	 * Checks if current IP address is equal to another IP address.
	 * @param ip IP address to check equality.
	 */
	equals(ip: IP): boolean {
		return this.#address6.isInSubnet(ip.address6);
	}

	/** Returns IP address as string. */
	toString(): string {
		const address4 = getAddress4(this.#address6);
		if (address4) {
			return address4.address;
		}

		return this.#address6.correctForm();
	}

	/** Returns IP address as Uint8Array. */
	toBytes(): Uint8Array {
		return Uint8Array.from(this.toByteArray());
	}

	/** Returns IP address as an array of uint8 numbers. */
	toByteArray(): number[] {
		const address4 = getAddress4(this.#address6);
		if (address4) {
			return address4.toArray();
		}

		return this.#address6.toUnsignedByteArray();
	}

	/** Returns IP address as ArrayBuffer. */
	toArrayBuffer(): ArrayBuffer {
		return Uint8Array.from(this.toByteArray()).buffer as ArrayBuffer;
	}

	/**
	 * Returns IP address as Node.js Buffer.
	 * @deprecated Use `.toBytes()` to receive a Uint8Array instead of Node.js Buffer.
	 * @see https://sindresorhus.com/blog/goodbye-nodejs-buffer
	 */
	toBuffer(): Buffer {
		return Buffer.from(this.toByteArray());
	}
}
