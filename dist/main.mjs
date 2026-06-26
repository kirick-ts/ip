import { Address4, Address6 } from "ip-address";
//#region src/utils.ts
const SUBNET_4_IN_6 = new Address6("::ffff:0:0/96");
/**
* Creates IP address from string
* @param value Source of IP address
* @returns -
*/
function fromString(value) {
	if (value.includes(":") === false) return Address6.fromAddress4(value);
	return new Address6(value);
}
/**
* Creates IP address from ArrayBuffer or Buffer
* @param value Source of IP address
*/
function fromBuffer(value) {
	let byte_array;
	if (value instanceof Uint8Array || Buffer.isBuffer(value)) byte_array = [...value];
	else if (value instanceof ArrayBuffer) byte_array = [...new Uint8Array(value)];
	else throw new TypeError("Argument 0 must be ArrayBuffer or Buffer.");
	if (byte_array.length === 4) return Address6.fromAddress4(byte_array.join("."));
	if (byte_array.length === 16) return Address6.fromUnsignedByteArray(byte_array);
	throw new TypeError("Argument 0 cannot be converted to IP address.");
}
/** Checks if Address6 is in the IPv4-in-IPv6 subnet. */
function isAddress4(address6) {
	return address6.v4 === true && address6.address4 !== void 0 || address6.isInSubnet(SUBNET_4_IN_6);
}
/**
* Returns Address6 as Address4, if it is in the IPv4-in-IPv6 subnet.
* @returns -
*/
function getAddress4(address6) {
	if (address6.v4 === true && address6.address4 !== void 0) return address6.address4;
	if (address6.isInSubnet(SUBNET_4_IN_6)) return address6.to4();
}
//#endregion
//#region src/ip.ts
const CIDR_LOOPBACK_4 = new Address4("127.0.0.0/8");
const CIDR_PRIVATE_4 = [
	new Address4("10.0.0.0/8"),
	new Address4("172.16.0.0/12"),
	new Address4("192.168.0.0/16")
];
const CIDR_LOOPBACK_6 = new Address6("::1/128");
const CIDR_PRIVATE_6 = new Address6("fc00::/7");
var IP = class {
	#address6;
	constructor(value) {
		if (typeof value === "string") this.#address6 = fromString(value);
		else if (value instanceof ArrayBuffer || value instanceof Uint8Array || Buffer.isBuffer(value)) this.#address6 = fromBuffer(value);
		else throw new TypeError(`Invalid IP address type (received "${typeof value}")`);
		if (this.#address6.subnetMask !== 128) throw new TypeError("IP address cannot have a subnet mask.");
	}
	/** @deprecated This property is for internal use only. */
	get address6() {
		return this.#address6;
	}
	/** Checks if current IP address is IPv4. */
	is4() {
		return this.#address6.v4 === true && this.#address6.address4 !== void 0 || this.#address6.isInSubnet(SUBNET_4_IN_6);
	}
	/**
	* Checks if current IP address is private, i.e. belongs to one of the private networks:
	* - `10.0.0.0/8`
	* - `172.16.0.0/12`
	* - `192.168.0.0/16`
	* - `fc00::/7`
	*/
	isPrivate() {
		if (this.#address6.address4) {
			for (const cidr of CIDR_PRIVATE_4) if (this.#address6.address4.isInSubnet(cidr)) return true;
		} else return this.#address6.isInSubnet(CIDR_PRIVATE_6);
		return false;
	}
	/**
	* Checks if current IP address is loopback, i.e. belongs to one of:
	* - `127.0.0.0/8`
	* - `::1/128`
	*/
	isLoopback() {
		if (this.#address6.address4) return this.#address6.address4.isInSubnet(CIDR_LOOPBACK_4);
		return this.#address6.isInSubnet(CIDR_LOOPBACK_6);
	}
	/**
	* Checks if current IP address is equal to another IP address.
	* @param ip IP address to check equality.
	*/
	equals(ip) {
		return this.#address6.isInSubnet(ip.address6);
	}
	/** Returns IP address as string. */
	toString() {
		const address4 = getAddress4(this.#address6);
		if (address4) return address4.address;
		return this.#address6.correctForm();
	}
	/** Returns IP address as Uint8Array. */
	toBytes() {
		return Uint8Array.from(this.toByteArray());
	}
	/** Returns IP address as an array of uint8 numbers. */
	toByteArray() {
		const address4 = getAddress4(this.#address6);
		if (address4) return address4.toArray();
		return this.#address6.toUnsignedByteArray();
	}
	/** Returns IP address as ArrayBuffer. */
	toArrayBuffer() {
		return Uint8Array.from(this.toByteArray()).buffer;
	}
	/**
	* Returns IP address as Node.js Buffer.
	* @deprecated Use `.toBytes()` to receive a Uint8Array instead of Node.js Buffer.
	* @see https://sindresorhus.com/blog/goodbye-nodejs-buffer
	*/
	toBuffer() {
		return Buffer.from(this.toByteArray());
	}
};
//#endregion
//#region src/cidr.ts
var CIDR = class {
	#address6;
	ip;
	ip_start;
	ip_end;
	mask;
	constructor(arg0, mask) {
		if (arg0 instanceof IP) {
			this.#address6 = fromString(`${arg0.toString()}/${mask}`);
			this.ip = arg0;
			this.mask = mask;
		} else if (typeof arg0 === "string") {
			this.#address6 = fromString(arg0);
			this.mask = this.#address6.subnetMask - (isAddress4(this.#address6) ? 96 : 0);
		} else {
			this.#address6 = fromBuffer(arg0);
			this.mask = mask;
		}
		this.ip ??= new IP(this.#address6.correctForm());
		this.ip_start = new IP(this.#address6.startAddress().correctForm());
		this.ip_end = new IP(this.#address6.endAddress().correctForm());
	}
	/**
	* Checks if IP address is in subnet of current CIDR.
	* @param ip IP address to check.
	*/
	includes(ip) {
		return ip.address6.isInSubnet(this.#address6);
	}
	/** Returns IP addCIDRress as string. */
	toString() {
		return `${this.ip_start.toString()}/${this.mask}`;
	}
};
//#endregion
export { CIDR, IP };
