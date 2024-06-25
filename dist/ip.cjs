var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.js
var main_exports = {};
__export(main_exports, {
  IP: () => IP
});
module.exports = __toCommonJS(main_exports);
var import_ip_address = require("ip-address");
var SUBNET_4_IN_6 = new import_ip_address.Address6("::ffff:0:0/96");
var IP = class {
  /**
   * @private
   * @type {Address6} -
   */
  _raw_address;
  /**
   * @param {string | ArrayBuffer | Buffer} value Source of IP address, can be string, ArrayBuffer or Buffer.
   */
  constructor(value) {
    if (typeof value === "string") {
      this._raw_address = this.#fromString(value);
    } else if (value instanceof ArrayBuffer || Buffer.isBuffer(value)) {
      this._raw_address = this.#fromBuffer(value);
    } else {
      throw new TypeError("Invalid IP address");
    }
  }
  /**
   * Creates IP address from string
   * @param {string} value Source of IP address
   * @returns {Address6} -
   */
  #fromString(value) {
    if (value.includes(":") === false) {
      return import_ip_address.Address6.fromAddress4(value);
    }
    return new import_ip_address.Address6(value);
  }
  /**
   * Creates IP address from ArrayBuffer or Buffer
   * @param {ArrayBuffer | Buffer} value Source of IP address
   * @returns {Address6} -
   */
  #fromBuffer(value) {
    let byte_array;
    if (Buffer.isBuffer(value)) {
      byte_array = [...value];
    } else if (value instanceof ArrayBuffer) {
      byte_array = [
        ...new Uint8Array(value)
      ];
    } else {
      throw new TypeError("Argument 0 must be ArrayBuffer or Buffer.");
    }
    if (byte_array.length === 4) {
      return import_ip_address.Address6.fromAddress4(
        byte_array.join(".")
      );
    }
    if (byte_array.length === 16) {
      return import_ip_address.Address6.fromUnsignedByteArray(byte_array);
    }
    throw new TypeError("Argument 0 cannot be converted to IP address.");
  }
  /**
   * Returns IP address as IPv4.
   * @returns {import('ip-address').Address4 | void} -
   */
  #getAddressAs4() {
    if (this._raw_address.v4 === true && typeof this._raw_address.address4 === "object") {
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
    return this.#getAddressAs4() !== void 0;
  }
  /**
   * Checks if current IP address is equal to another IP address.
   * @param {IP} ip IP address to check equality.
   * @returns {boolean} -
   * @throws {Error} If one or both IP addresses are subnets.
   */
  equals(ip) {
    if (this._raw_address.subnetMask === 128 && ip._raw_address.subnetMask === 128) {
      return this._raw_address.isInSubnet(
        ip._raw_address
      );
    }
    throw new Error("Cannot check equality for subnets.");
  }
  /**
   * Checks if current IP address is in subnet of another IP address
   * @param {IP} ip IP address to check
   * @returns {boolean} -
   */
  includes(ip) {
    return ip._raw_address.isInSubnet(
      this._raw_address
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
      this.toByteArray()
    ).buffer;
  }
  /**
   * Returns IP address as Node.js Buffer.
   * @returns {Buffer} -
   */
  toBuffer() {
    return Buffer.from(
      this.toByteArray()
    );
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  IP
});
