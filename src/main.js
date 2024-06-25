
import { Address6 } from 'ip-address';

const SUBNET_4_IN_6 = new Address6('::ffff:0:0/96');

/**
 * IP address representation.
 * @class
 */
export class IP {
	/**
	 * @private
	 * @type {Address6} -
	 */
	_raw_address;

	/**
	 * @param {string | ArrayBuffer | Buffer} value Source of IP address, can be string, ArrayBuffer or Buffer.
	 */
	constructor(value) {
		if (typeof value === 'string') {
			this._raw_address = this.#fromString(value);
		}
		else if (
			value instanceof ArrayBuffer
			|| Buffer.isBuffer(value)
		) {
			this._raw_address = this.#fromBuffer(value);
		}
		else {
			throw new TypeError('Invalid IP address');
		}
	}

	/**
	 * Creates IP address from string
	 * @param {string} value Source of IP address
	 * @returns {Address6} -
	 */
	#fromString(value) {
		if (value.includes(':') === false) {
			return Address6.fromAddress4(value);
		}

		return new Address6(value);
	}

	/**
	 * Creates IP address from ArrayBuffer or Buffer
	 * @param {ArrayBuffer | Buffer} value Source of IP address
	 * @returns {Address6} -
	 */
	#fromBuffer(value) {
		/** @type {number[]} */
		let byte_array;
		if (Buffer.isBuffer(value)) {
			byte_array = [ ...value ];
		}
		else if (value instanceof ArrayBuffer) {
			byte_array = [
				...new Uint8Array(value),
			];
		}
		else {
			throw new TypeError('Argument 0 must be ArrayBuffer or Buffer.');
		}

		// ipv4
		if (byte_array.length === 4) {
			return Address6.fromAddress4(
				byte_array.join('.'),
			);
		}

		// ipv6
		if (byte_array.length === 16) {
			return Address6.fromUnsignedByteArray(byte_array);
		}

		throw new TypeError('Argument 0 cannot be converted to IP address.');
	}

	/**
	 * Returns IP address as IPv4.
	 * @returns {import('ip-address').Address4 | void} -
	 */
	#getAddressAs4() {
		if (
			this._raw_address.v4 === true
			&& typeof this._raw_address.address4 === 'object'
		) {
			return this._raw_address.address4;
		}

		if (this._raw_address.isInSubnet(SUBNET_4_IN_6)) {
			return this._raw_address.to4();
		}
	}

	/**
	 * Checks if current IP address is IPv4.
	 * @returns {boolean} -
	 */
	is4() {
		return this.#getAddressAs4() !== undefined;
	}

	/**
	 * Checks if current IP address is equal to another IP address.
	 * @param {IP} ip IP address to check equality.
	 * @returns {boolean} -
	 * @throws {Error} If one or both IP addresses are subnets.
	 */
	equals(ip) {
		if (
			this._raw_address.subnetMask === 128
			&& ip._raw_address.subnetMask === 128
		) {
			return this._raw_address.isInSubnet(
				ip._raw_address,
			);
		}

		throw new Error('Cannot check equality for subnets.');
	}

	/**
	 * Checks if current IP address is in subnet of another IP address
	 * @param {IP} ip IP address to check
	 * @returns {boolean} -
	 */
	includes(ip) {
		return ip._raw_address.isInSubnet(
			this._raw_address,
		);
	}

	/**
	 * Returns IP address as string.
	 * @returns {string} -
	 */
	toString() {
		const address4 = this.#getAddressAs4();
		if (address4) {
			return address4.address;
		}

		return this._raw_address.correctForm();
	}

	/**
	 * Returns IP address as byte array.
	 * @returns {number[]} -
	 */
	toByteArray() {
		const address4 = this.#getAddressAs4();
		if (address4) {
			return address4.toArray();
		}

		return this._raw_address.toUnsignedByteArray();
	}

	/**
	 * Returns IP address as ArrayBuffer.
	 * @returns {ArrayBuffer} -
	 */
	toArrayBuffer() {
		return Uint8Array.from(
			this.toByteArray(),
		).buffer;
	}

	/**
	 * Returns IP address as Node.js Buffer.
	 * @returns {Buffer} -
	 */
	toBuffer() {
		return Buffer.from(
			this.toByteArray(),
		);
	}
}
