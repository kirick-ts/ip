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
var import_node_module = require("node:module");
var import_meta = {};
function _require(name) {
  try {
    if (true) {
      return require(name);
    }
  } catch {
  }
  return (0, import_node_module.createRequire)(import_meta.url)(name);
}
var { Address6 } = _require("ip-address");
var SUBNET_4_IN_6 = new Address6("::ffff:0:0/96");
var IP = class {
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
    if (typeof value === "string") {
      raw_address = this.#fromString(value);
    } else if (value instanceof ArrayBuffer || Buffer.isBuffer(value)) {
      raw_address = this.#fromBuffer(value);
    } else {
      throw new TypeError("Invalid IP address");
    }
    Object.defineProperty(
      this,
      "raw_address",
      {
        value: raw_address,
        enumerable: true,
        writable: false,
        configurable: false
      }
    );
  }
  /**
   * Creates IP address from string
   * @private
   * @param {string} value Source of IP address
   * @returns {Address6} -
   */
  #fromString(value) {
    if (value.includes(":") === false) {
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
    if (value.byteLength === 4) {
      return Address6.fromAddress4(
        [...value].join(".")
      );
    }
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
    if (raw_address.v4 === true && typeof raw_address.address4 === "object") {
      return raw_address.address4;
    }
    if (raw_address.isInSubnet(SUBNET_4_IN_6)) {
      return raw_address.to4();
    }
  }
  is4() {
    return this.#getAddressAs4() !== void 0;
  }
  /**
   * Checks if current IP address is equal to another IP address
   * @param {IP} ip IP address to check equality
   * @returns {boolean} -
   * @throws {Error} If one or both IP addresses are subnets
   */
  equals(ip) {
    if (this.raw_address.subnetMask === 128 && ip.raw_address.subnetMask === 128) {
      return this.raw_address.isInSubnet(
        ip.raw_address
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
      this.toArrayBuffer()
    );
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  IP
});
