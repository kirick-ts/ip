import { type Address4, Address6 } from 'ip-address';

export const SUBNET_4_IN_6: Address6 = new Address6('::ffff:0:0/96');

/**
 * Creates IP address from string
 * @param value Source of IP address
 * @returns -
 */
export function fromString(value: string): Address6 {
	if (value.includes(':') === false) {
		return Address6.fromAddress4(value);
	}

	return new Address6(value);
}

/**
 * Creates IP address from ArrayBuffer or Buffer
 * @param value Source of IP address
 */
export function fromBuffer(value: ArrayBuffer | Uint8Array | Buffer): Address6 {
	let byte_array: number[];
	if (value instanceof Uint8Array || Buffer.isBuffer(value)) {
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

/** Checks if Address6 is in the IPv4-in-IPv6 subnet. */
export function isAddress4(address6: Address6): boolean {
	return (
		(address6.v4 === true && address6.address4 !== undefined)
		|| address6.isInSubnet(SUBNET_4_IN_6)
	);
}

/**
 * Returns Address6 as Address4, if it is in the IPv4-in-IPv6 subnet.
 * @returns -
 */
export function getAddress4(address6: Address6): Address4 | undefined {
	if (address6.v4 === true && address6.address4 !== undefined) {
		return address6.address4;
	}

	if (address6.isInSubnet(SUBNET_4_IN_6)) {
		return address6.to4();
	}
}
