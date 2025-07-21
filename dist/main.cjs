//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion
const ip_address = __toESM(require("ip-address"));

//#region src/main.ts
const SUBNET_4_IN_6 = new ip_address.Address6("::ffff:0:0/96");
const CIDR_LOOPBACK_4 = new ip_address.Address4("127.0.0.0/8");
const CIDR_PRIVATE_4 = [
	new ip_address.Address4("10.0.0.0/8"),
	new ip_address.Address4("172.16.0.0/12"),
	new ip_address.Address4("192.168.0.0/16")
];
const CIDR_LOOPBACK_6 = new ip_address.Address6("::1/128");
const CIDR_PRIVATE_6 = new ip_address.Address6("fc00::/7");
/**
* Creates IP address from string
* @param value Source of IP address
* @returns -
*/
function fromString(value) {
	if (value.includes(":") === false) return ip_address.Address6.fromAddress4(value);
	return new ip_address.Address6(value);
}
/**
* Creates IP address from ArrayBuffer or Buffer
* @param value Source of IP address
* @returns -
*/
function fromBuffer(value) {
	let byte_array;
	if (Buffer.isBuffer(value)) byte_array = [...value];
	else if (value instanceof ArrayBuffer) byte_array = [...new Uint8Array(value)];
	else throw new TypeError("Argument 0 must be ArrayBuffer or Buffer.");
	if (byte_array.length === 4) return ip_address.Address6.fromAddress4(byte_array.join("."));
	if (byte_array.length === 16) return ip_address.Address6.fromUnsignedByteArray(byte_array);
	throw new TypeError("Argument 0 cannot be converted to IP address.");
}
var IP = class {
	raw_address;
	/**
	* @param value Source of IP address, can be string, ArrayBuffer or Buffer.
	*/
	constructor(value) {
		if (typeof value === "string") this.raw_address = fromString(value);
		else if (value instanceof ArrayBuffer || Buffer.isBuffer(value)) this.raw_address = fromBuffer(value);
		else throw new TypeError("Invalid IP address");
	}
	/**
	* Returns IP address as IPv4.
	* @returns -
	*/
	getAddressAs4() {
		if (this.raw_address.v4 === true && typeof this.raw_address.address4 === "object") return this.raw_address.address4;
		if (this.raw_address.isInSubnet(SUBNET_4_IN_6)) return this.raw_address.to4();
	}
	/**
	* Checks if current IP address is IPv4.
	* @returns -
	*/
	is4() {
		return this.getAddressAs4() !== void 0;
	}
	/**
	* Checks if current IP address is private, i.e. belongs to one of the private networks:
	* - `10.0.0.0/8`
	* - `172.16.0.0/12`
	* - `192.168.0.0/16`
	* - `fc00::/7`
	* @returns -
	*/
	isPrivate() {
		if (this.raw_address.address4) {
			for (const cidr of CIDR_PRIVATE_4) if (this.raw_address.address4.isInSubnet(cidr)) return true;
		} else return this.raw_address.isInSubnet(CIDR_PRIVATE_6);
		return false;
	}
	/**
	* Checks if current IP address is loopback, i.e. belongs to one of:
	* - `127.0.0.0/8`
	* - `::1/128`
	* @returns -
	*/
	isLoopback() {
		if (this.raw_address.address4) return this.raw_address.address4.isInSubnet(CIDR_LOOPBACK_4);
		return this.raw_address.isInSubnet(CIDR_LOOPBACK_6);
	}
	/**
	* Checks if current IP address is equal to another IP address.
	* @param ip IP address to check equality.
	* @returns -
	* @throws {Error} If one or both IP addresses are subnets.
	*/
	equals(ip) {
		if (this.raw_address.subnetMask === 128 && ip.raw_address.subnetMask === 128) return this.raw_address.isInSubnet(ip.raw_address);
		throw new Error("Cannot check equality for subnets.");
	}
	/**
	* Checks if current IP address is in subnet of another IP address
	* @param ip IP address to check
	* @returns -
	*/
	includes(ip) {
		return ip.raw_address.isInSubnet(this.raw_address);
	}
	/**
	* Returns IP address as string.
	* @returns -
	*/
	toString() {
		const address4 = this.getAddressAs4();
		if (address4) return address4.address;
		return this.raw_address.correctForm();
	}
	/**
	* Returns IP address as byte array.
	* @returns -
	*/
	toByteArray() {
		const address4 = this.getAddressAs4();
		if (address4) return address4.toArray();
		return this.raw_address.toUnsignedByteArray();
	}
	/**
	* Returns IP address as ArrayBuffer.
	* @returns -
	*/
	toArrayBuffer() {
		return Uint8Array.from(this.toByteArray()).buffer;
	}
	/**
	* Returns IP address as Node.js Buffer.
	* @returns -
	*/
	toBuffer() {
		return Buffer.from(this.toByteArray());
	}
};

//#endregion
exports.IP = IP;