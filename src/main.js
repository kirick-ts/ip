
/* global IS_BUILD, require */

import { createRequire } from 'node:module';

// eslint-disable-next-line jsdoc/require-jsdoc
function _require(name) {
	try {
		if (IS_BUILD) {
			// eslint-disable-next-line unicorn/prefer-module
			return require(name);
		}
	}
	catch {}

	return createRequire(import.meta.url)(name);
}
const { Address6 } = _require('ip-address');

const SUBNET_4_IN_6 = new Address6('::ffff:0:0/96');

/**
 * IP address representation
 * @class
 */
export class IP {
	/**
	 * @private
	 * @type {Address6} -
	 */
	raw_address;

	/**
	 * @param {string|ArrayBuffer|Buffer} value Source of IP address, can be string, ArrayBuffer or Buffer
	 */
	constructor(value) {
		let raw_address;

		if (typeof value === 'string') {
			raw_address = this.#fromString(value);
		}
		else if (
			value instanceof ArrayBuffer
			|| Buffer.isBuffer(value)
		) {
			raw_address = this.#fromBuffer(value);
		}
		else {
			throw new TypeError('Invalid IP address');
		}

		Object.defineProperty(
			this,
			'raw_address',
			{
				value: raw_address,
				enumerable: true,
				writable: false,
				configurable: false,
			},
		);
	}

	/**
	 * Creates IP address from string
	 * @private
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
	 * @private
	 * @param {ArrayBuffer|Buffer} value Source of IP address
	 * @returns {Address6 | void} -
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
	 * @returns {Address4 | void} -
	 */
	#getAddressAs4() {
		const { raw_address } = this;

		if (
			raw_address.v4 === true
			&& typeof raw_address.address4 === 'object'
		) {
			return raw_address.address4;
		}

		if (raw_address.isInSubnet(SUBNET_4_IN_6)) {
			return raw_address.to4();
		}
	}

	is4() {
		return this.#getAddressAs4() !== undefined;
	}

	/**
	 * Checks if current IP address is equal to another IP address
	 * @param {IP} ip IP address to check equality
	 * @returns {boolean} -
	 * @throws {Error} If one or both IP addresses are subnets
	 */
	equals(ip) {
		if (
			this.raw_address.subnetMask === 128
			&& ip.raw_address.subnetMask === 128
		) {
			return this.raw_address.isInSubnet(
				ip.raw_address,
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
		return ip.raw_address.isInSubnet(this.raw_address);
	}

	/**
	 * Returns IP address as string
	 * @returns {string} -
	 */
	toString() {
		return this.#getAddressAs4()?.address ?? this.raw_address.correctForm();
	}

	/**
	 * Returns IP address as ArrayBuffer
	 * @returns {ArrayBuffer} -
	 */
	toArrayBuffer() {
		return this.#getAddressAs4()?.toArray() ?? this.raw_address.toUnsignedByteArray();
	}

	/**
	 * Returns IP address as Node.js Buffer
	 * @returns {Buffer} -
	 * @see toArrayBuffer
	 */
	toBuffer() {
		return Buffer.from(
			this.toArrayBuffer(),
		);
	}
}
