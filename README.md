# @kirick/ip

A TypeScript library for handling IPv4 and IPv6 addresses with convenient conversion methods and CIDR subnet operations.

## Features

- 🔄 Unified handling of both IPv4 and IPv6 addresses
- 📥 Support for multiple input formats:
  - String representations
  - Uint8Array
  - ArrayBuffer
  - Node.js Buffer
- 📤 Support for multiple output formats:
  - String representations (standard notation)
  - Uint8Array
  - Byte arrays
  - ArrayBuffer
  - Node.js Buffer
- ✨ IPv4/IPv6 detection
- 🧭 Private and loopback address detection
- ⚖️ Address equality comparison
- 🌐 CIDR parsing and subnet membership checking

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

// From Uint8Array
const bytes = new Uint8Array([127, 0, 0, 1]);
const ip2 = new IP(bytes);

// From ArrayBuffer
const arrayBuffer = new Uint8Array([127, 0, 0, 1]).buffer;
const ip3 = new IP(arrayBuffer);

// From Node.js Buffer
const buffer = Buffer.from([127, 0, 0, 1]);
const ip4 = new IP(buffer);
```

### Different Output Formats

```typescript
const ip = new IP('127.0.0.1');

// To string
console.log(ip.toString()); // "127.0.0.1"

// To Uint8Array
console.log(ip.toBytes()); // Uint8Array [127, 0, 0, 1]

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

### Checking IP Addresses

```typescript
const ip1 = new IP('10.0.0.1');
const ip2 = new IP('127.0.0.1');

console.log(ip1.isPrivate()); // true
console.log(ip1.isLoopback()); // false

console.log(ip2.isPrivate()); // false
console.log(ip2.isLoopback()); // true
```

### Subnet Operations

```typescript
import { CIDR, IP } from '@kirick/ip';

const subnet = new CIDR('192.168.0.1/24');
const ip = new IP('192.168.0.42');

console.log(subnet.includes(ip)); // true
console.log(subnet.toString()); // "192.168.0.0/24"
console.log(subnet.ip.toString()); // "192.168.0.1"
console.log(subnet.ip_start.toString()); // "192.168.0.0"
console.log(subnet.ip_end.toString()); // "192.168.0.255"
console.log(subnet.mask); // 24
```

## API Reference

### `class IP`

#### Constructor
- `constructor(value: string | ArrayBuffer | Uint8Array | Buffer)`

#### Methods
- `is4(): boolean` - Checks if the address is IPv4
- `isPrivate(): boolean` - Checks if the address is private
- `isLoopback(): boolean` - Checks if the address is loopback
- `equals(ip: IP): boolean` - Checks if two IP addresses are equal
- `toString(): string` - Converts to string representation
- `toBytes(): Uint8Array` - Converts to Uint8Array
- `toByteArray(): number[]` - Converts to byte array
- `toArrayBuffer(): ArrayBuffer` - Converts to ArrayBuffer
- `toBuffer(): Buffer` - Converts to Node.js Buffer (deprecated)

### `class CIDR`

#### Constructor
- `constructor(value: string)`
- `constructor(value: ArrayBuffer | Uint8Array | Buffer, mask: number)`
- `constructor(ip: IP, mask: number)`

#### Properties
- `ip: IP` - Original IP address
- `ip_start: IP` - First IP address in the subnet
- `ip_end: IP` - Last IP address in the subnet
- `mask: number` - Subnet mask

#### Methods
- `includes(ip: IP): boolean` - Checks if an IP address is in the subnet
- `toString(): string` - Converts to string representation

## License

MIT
