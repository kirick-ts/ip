import { Address4, Address6 } from 'ip-address';

const SUBNET_4_IN_6 = new Address6('::ffff:0:0/96');

const CIDR_LOOPBACK_4 = new Address4('127.0.0.0/8');
const CIDR_PRIVATE_4 = [
	new Address4('10.0.0.0/8'),
	new Address4('172.16.0.0/12'),
	new Address4('192.168.0.0/16'),
];

const CIDR_LOOPBACK_6 = new Address6('::1/128');
const CIDR_PRIVATE_6 = new Address6('fc00::/7');

/**
 * Creates IP address from string
 * @param value Source of IP address
 * @returns -
 */
function fromString(value: string): Address6 {
	if (value.includes(':') === false) {
		return Address6.fromAddress4(value);
	}

	return new Address6(value);
}

/**
 * Creates IP address from ArrayBuffer or Buffer
 * @param value Source of IP address
 * @returns -
 */
function fromBuffer(value: ArrayBuffer | Buffer) {
	let byte_array: number[];
	if (Buffer.isBuffer(value)) {
		byte_array = [...value];
	} else if (value instanceof ArrayBuffer) {
		byte_array = [...new Uint8Array(value)];
	} else {
		throw new TypeError('Argument 0 must be ArrayBuffer or Buffer.');
	}

	// ipv4
	if (byte_array.length === 4) {
		return Address6.fromAddress4(byte_array.join('.'));
	}

	// ipv6
	if (byte_array.length === 16) {
		return Address6.fromUnsignedByteArray(byte_array);
	}

	throw new TypeError('Argument 0 cannot be converted to IP address.');
}

export class IP {
	raw_address: Address6;

	/**
	 * @param value Source of IP address, can be string, ArrayBuffer or Buffer.
	 */
	constructor(value: string | ArrayBuffer | Buffer) {
		if (typeof value === 'string') {
			this.raw_address = fromString(value);
		} else if (value instanceof ArrayBuffer || Buffer.isBuffer(value)) {
			this.raw_address = fromBuffer(value);
		} else {
			throw new TypeError('Invalid IP address');
		}
	}

	/**
	 * Returns IP address as IPv4.
	 * @returns -
	 */
	private getAddressAs4(): Address4 | undefined {
		if (
			this.raw_address.v4 === true &&
			typeof this.raw_address.address4 === 'object'
		) {
			return this.raw_address.address4;
		}

		if (this.raw_address.isInSubnet(SUBNET_4_IN_6)) {
			return this.raw_address.to4();
		}
	}

	/**
	 * Checks if current IP address is IPv4.
	 * @returns -
	 */
	is4(): boolean {
		return this.getAddressAs4() !== undefined;
	}

	/**
	 * Checks if current IP address is private, i.e. belongs to one of the private networks:
	 * - `10.0.0.0/8`
	 * - `172.16.0.0/12`
	 * - `192.168.0.0/16`
	 * - `fc00::/7`
	 * @returns -
	 */
	isPrivate(): boolean {
		if (this.raw_address.address4) {
			for (const cidr of CIDR_PRIVATE_4) {
				if (this.raw_address.address4.isInSubnet(cidr)) {
					return true;
				}
			}
		} else {
			return this.raw_address.isInSubnet(CIDR_PRIVATE_6);
		}

		return false;
	}

	/**
	 * Checks if current IP address is loopback, i.e. belongs to one of:
	 * - `127.0.0.0/8`
	 * - `::1/128`
	 * @returns -
	 */
	isLoopback(): boolean {
		if (this.raw_address.address4) {
			return this.raw_address.address4.isInSubnet(CIDR_LOOPBACK_4);
		}

		return this.raw_address.isInSubnet(CIDR_LOOPBACK_6);
	}

	/**
	 * Checks if current IP address is equal to another IP address.
	 * @param ip IP address to check equality.
	 * @returns -
	 * @throws {Error} If one or both IP addresses are subnets.
	 */
	equals(ip: IP): boolean {
		if (
			this.raw_address.subnetMask === 128 &&
			ip.raw_address.subnetMask === 128
		) {
			return this.raw_address.isInSubnet(ip.raw_address);
		}

		throw new Error('Cannot check equality for subnets.');
	}

	/**
	 * Checks if current IP address is in subnet of another IP address
	 * @param ip IP address to check
	 * @returns -
	 */
	includes(ip: IP): boolean {
		return ip.raw_address.isInSubnet(this.raw_address);
	}

	/**
	 * Returns IP address as string.
	 * @returns -
	 */
	toString(): string {
		const address4 = this.getAddressAs4();
		if (address4) {
			return address4.address;
		}

		return this.raw_address.correctForm();
	}

	/**
	 * Returns IP address as byte array.
	 * @returns -
	 */
	toByteArray(): number[] {
		const address4 = this.getAddressAs4();
		if (address4) {
			return address4.toArray();
		}

		return this.raw_address.toUnsignedByteArray();
	}

	/**
	 * Returns IP address as ArrayBuffer.
	 * @returns -
	 */
	toArrayBuffer(): ArrayBuffer {
		return Uint8Array.from(this.toByteArray()).buffer as ArrayBuffer;
	}

	/**
	 * Returns IP address as Node.js Buffer.
	 * @returns -
	 */
	toBuffer(): Buffer {
		return Buffer.from(this.toByteArray());
	}
}
