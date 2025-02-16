# @kirick/ip

A TypeScript library for handling IPv4 and IPv6 addresses with convenient conversion methods and subnet operations.

## Features

- 🔄 Unified handling of both IPv4 and IPv6 addresses
- 📥 Support for multiple input formats:
  - String representations
  - ArrayBuffer
  - Node.js Buffer
- 📤 Support for multiple output formats:
  - String representations (standard notation)
  - Byte arrays
  - ArrayBuffer
  - Node.js Buffer
- ✨ IPv4/IPv6 detection
- ⚖️ Address equality comparison
- 🌐 Subnet membership checking

## Installation

```bash
bun add @kirick/ip
# or
pnpm install @kirick/ip
# or
npm install @kirick/ip
```

## Usage

### Basic Usage

```typescript
import { IP } from '@kirick/ip';

// Create IP from string
const ip1 = new IP('127.0.0.1');
const ip2 = new IP('fe80:dead:be:ef::1');

// Check IP version
console.log(ip1.is4()); // true
console.log(ip2.is4()); // false

// Convert to string
console.log(ip1.toString()); // "127.0.0.1"
console.log(ip2.toString()); // "fe80:dead:be:ef::1"
```

### Different Input Formats

```typescript
// From string
const ip1 = new IP('127.0.0.1');

// From ArrayBuffer
const arrayBuffer = new Uint8Array([127, 0, 0, 1]).buffer;
const ip2 = new IP(arrayBuffer);

// From Node.js Buffer
const buffer = Buffer.from([127, 0, 0, 1]);
const ip3 = new IP(buffer);
```

### Different Output Formats

```typescript
const ip = new IP('127.0.0.1');

// To string
console.log(ip.toString()); // "127.0.0.1"

// To byte array
console.log(ip.toByteArray()); // [127, 0, 0, 1]

// To ArrayBuffer
const arrayBuffer = ip.toArrayBuffer();

// To Node.js Buffer
const buffer = ip.toBuffer();
```

### Comparing IP Addresses

```typescript
const ip1 = new IP('127.0.0.1');
const ip2 = new IP('::ffff:127.0.0.1'); // IPv4-mapped IPv6 address

console.log(ip1.equals(ip2)); // true
```

### Subnet Operations

```typescript
const subnet = new IP('127.0.0.0/8');
const ip = new IP('127.0.0.1');

console.log(subnet.includes(ip)); // true
```

## API Reference

### `class IP`

#### Constructor
- `constructor(value: string | ArrayBuffer | Buffer)`

#### Methods
- `is4(): boolean` - Checks if the address is IPv4
- `equals(ip: IP): boolean` - Checks if two IP addresses are equal
- `includes(ip: IP): boolean` - Checks if an IP address is in a subnet
- `toString(): string` - Converts to string representation
- `toByteArray(): number[]` - Converts to byte array
- `toArrayBuffer(): ArrayBuffer` - Converts to ArrayBuffer
- `toBuffer(): Buffer` - Converts to Node.js Buffer

## License

MIT
