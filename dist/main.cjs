"use strict";
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

// dist/esm/main.js
var main_exports = {};
__export(main_exports, {
  IP: () => IP
});
module.exports = __toCommonJS(main_exports);
var import_ip_address = require("ip-address");
var SUBNET_4_IN_6 = new import_ip_address.Address6("::ffff:0:0/96");
function fromString(value) {
  if (value.includes(":") === false) {
    return import_ip_address.Address6.fromAddress4(value);
  }
  return new import_ip_address.Address6(value);
}
function fromBuffer(value) {
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
    return import_ip_address.Address6.fromAddress4(byte_array.join("."));
  }
  if (byte_array.length === 16) {
    return import_ip_address.Address6.fromUnsignedByteArray(byte_array);
  }
  throw new TypeError("Argument 0 cannot be converted to IP address.");
}
var IP = class {
  raw_address;
  /**
   * @param value Source of IP address, can be string, ArrayBuffer or Buffer.
   */
  constructor(value) {
    if (typeof value === "string") {
      this.raw_address = fromString(value);
    } else if (value instanceof ArrayBuffer || Buffer.isBuffer(value)) {
      this.raw_address = fromBuffer(value);
    } else {
      throw new TypeError("Invalid IP address");
    }
  }
  /**
   * Returns IP address as IPv4.
   * @returns -
   */
  getAddressAs4() {
    if (this.raw_address.v4 === true && typeof this.raw_address.address4 === "object") {
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
  is4() {
    return this.getAddressAs4() !== void 0;
  }
  /**
   * Checks if current IP address is equal to another IP address.
   * @param ip IP address to check equality.
   * @returns -
   * @throws {Error} If one or both IP addresses are subnets.
   */
  equals(ip) {
    if (this.raw_address.subnetMask === 128 && ip.raw_address.subnetMask === 128) {
      return this.raw_address.isInSubnet(ip.raw_address);
    }
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
    if (address4) {
      return address4.address;
    }
    return this.raw_address.correctForm();
  }
  /**
   * Returns IP address as byte array.
   * @returns -
   */
  toByteArray() {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  IP
});
