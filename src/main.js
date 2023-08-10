
import { createRequire } from 'node:module';

const { Address6 } = createRequire(import.meta.url)('ip-address');

const SUBNET_4_IN_6 = new Address6('::ffff:0:0/96');

export default class IP {
	_address;

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

	#fromString(value) {
		if (value.includes(':') === false) {
			return Address6.fromAddress4(value);
		}

		return new Address6(value);
	}

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

	equals(ip) {
		if (
			this._address.subnetMask === 128
			&& ip._address.subnetMask === 128
		) {
			return this._address.isInSubnet(ip._address);
		}

		throw new Error('Cannot check equality for subnets.');
	}

	includes(ip) {
		return ip._address.isInSubnet(this._address);
	}

	toString() {
		return this.#getAddressAs4()?.address ?? this._address.correctForm();
	}

	toArrayBuffer() {
		return this.#getAddressAs4()?.toArray() ?? this._address.toUnsignedByteArray();
	}

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
