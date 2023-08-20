
import { createRequire } from 'node:module';

/**
 * IPv4 address representation from "ip-address" package
 * @typedef {Object} Address4
 */
/**
 * IPv6 address representation from "ip-address" package
 * @typedef {Object} Address6
 */
const { Address6 } = createRequire(import.meta.url)('ip-address');

const SUBNET_4_IN_6 = new Address6('::ffff:0:0/96');

/**
 * IP address representation
 * @class
 */
export default class IP {
	_address;

	/**
	 * @param {string|ArrayBuffer|Buffer} value Source of IP address, can be string, ArrayBuffer or Buffer
	 */
	constructor(value) {
		if (typeof value === 'string') {
			this._address = this.#fromString(value);
		}
		else if (
			value instanceof ArrayBuffer
			|| Buffer.isBuffer(value)
		) {
			this._address = this.#fromBuffer(value);
		}
		else {
			throw new TypeError('Invalid IP address');
		}
	}

	/**
	 * Creates IP address from string
	 * @private
	 * @param {string} value Source of IP address
	 * @returns {Address6}
	 */
	#fromString(value) {
		if (value.includes(':') === false) {
			return Address6.fromAddress4(value);
		}

		return new Address6(value);
	}

	/**
	 * Creates IP address from ArrayBuffer or Buffer
	 * @private
	 * @param {ArrayBuffer|Buffer} value Source of IP address
	 * @returns {Address6}
	 */
	#fromBuffer(value) {
		if (value instanceof ArrayBuffer) {
			value = Buffer.from(value);
		}

		// ipv4
		if (value.byteLength === 4) {
			return Address6.fromAddress4(
				[ ...value ].join('.'),
			);
		}

		// ipv6
		if (value.byteLength === 16) {
			return Address6.fromUnsignedByteArray(value);
		}
	}

	/**
	 * Returns IP address as IPv4
	 * @private
	 * @returns {Address4}
	 */
	#getAddressAs4() {
		if (
			this._address.v4 === true
			&& typeof this._address.address4 === 'object'
		) {
			return this._address.address4;
		}

		if (this._address.isInSubnet(SUBNET_4_IN_6)) {
			return this._address.to4();
		}
	}

	/**
	 * Checks if current IP address is equal to another IP address
	 * @param {IP} ip IP address to check equality
	 * @returns {boolean}
	 * @throws {Error} If one or both IP addresses are subnets
	 */
	equals(ip) {
		if (
			this._address.subnetMask === 128
			&& ip._address.subnetMask === 128
		) {
			return this._address.isInSubnet(ip._address);
		}

		throw new Error('Cannot check equality for subnets.');
	}

	/**
	 * Checks if current IP address is in subnet of another IP address
	 * @param {IP} ip IP address to check
	 * @returns {boolean}
	 */
	includes(ip) {
		return ip._address.isInSubnet(this._address);
	}

	/**
	 * Returns IP address as string
	 * @returns {string}
	 */
	toString() {
		return this.#getAddressAs4()?.address ?? this._address.correctForm();
	}

	/**
	 * Returns IP address as ArrayBuffer
	 * @returns {ArrayBuffer}
	 */
	toArrayBuffer() {
		return this.#getAddressAs4()?.toArray() ?? this._address.toUnsignedByteArray();
	}

	/**
	 * Returns IP address as Node.js Buffer
	 * @returns {Buffer} IP address as Buffer
	 * @see toArrayBuffer
	 */
	toBuffer() {
		return Buffer.from(
			this.toArrayBuffer(),
		);
	}

	// toFullArrayBuffer() {
	// 	return this._address.toUnsignedByteArray();
	// }

	// toFullBuffer() {
	// 	return Buffer.from(
	// 		this.toFullArrayBuffer(),
	// 	);
	// }
}
