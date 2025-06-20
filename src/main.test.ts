import { describe, expect, test } from 'vitest';
import { IP } from './main.js';

interface TestFactory {
	is_ipv4: boolean;
	source_string: string;
	source_byte_array: number[];
	target_string: string;
	target_byte_array: number[];
}

// eslint-disable-next-line jsdoc/require-jsdoc
function testFactory({
	is_ipv4,
	source_string,
	source_byte_array,
	target_string,
	target_byte_array,
}: TestFactory) {
	const source_array_buffer = new Uint8Array(source_byte_array)
		.buffer as ArrayBuffer;
	const source_buffer = Buffer.from(source_byte_array);

	const ip_from_string = new IP(source_string);
	const ip_from_array_buffer = new IP(source_array_buffer);
	const ip_from_buffer = new IP(source_buffer);

	const target_array_buffer = new Uint8Array(target_byte_array).buffer;
	const target_buffer = Buffer.from(target_byte_array);

	test(is_ipv4 ? 'is IPv4' : 'is IPv6', () => {
		expect(ip_from_string.is4()).toBe(is_ipv4);

		expect(ip_from_array_buffer.is4()).toBe(is_ipv4);

		expect(ip_from_buffer.is4()).toBe(is_ipv4);
	});

	for (const [type_from, ip] of Object.entries({
		string: ip_from_string,
		ArrayBuffer: ip_from_array_buffer,
		Buffer: ip_from_buffer,
	})) {
		test(`${type_from} -> string`, () => {
			expect(ip.toString()).toBe(target_string);
		});

		test(`${type_from} -> number[]`, () => {
			expect(ip.toByteArray()).toStrictEqual(target_byte_array);
		});

		test(`${type_from} -> ArrayBuffer`, () => {
			expect(ip.toArrayBuffer()).toStrictEqual(target_array_buffer);
		});

		test(`${type_from} -> Buffer`, () => {
			expect(ip.toBuffer()).toStrictEqual(target_buffer);
		});
	}
}

describe('IPv4', () => {
	const target_string = '127.0.0.1';
	const target_byte_array = [127, 0, 0, 1];

	describe('in form of IPv4', () => {
		testFactory({
			is_ipv4: true,
			source_string: target_string,
			source_byte_array: target_byte_array,
			target_string,
			target_byte_array,
		});
	});

	describe('in form of IPv4 in IPv6', () => {
		testFactory({
			is_ipv4: true,
			source_string: `::ffff:${target_string}`,
			source_byte_array: [
				0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0xff, 0xff, 127, 0, 0, 1,
			],
			target_string,
			target_byte_array,
		});
	});

	describe('in form of IPv6', () => {
		testFactory({
			is_ipv4: true,
			source_string: '::ffff:7f00:1',
			source_byte_array: [
				0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0xff, 0xff, 127, 0, 0, 1,
			],
			target_string,
			target_byte_array,
		});
	});
});

describe('IPv6', () => {
	const target_string = 'fe80:dead:be:ef::1';
	const target_byte_array = [
		0xfe, 0x80, 0xde, 0xad, 0, 0xbe, 0, 0xef, 0, 0, 0, 0, 0, 0, 0, 1,
	];

	describe('short form', () => {
		testFactory({
			is_ipv4: false,
			source_string: target_string,
			source_byte_array: target_byte_array,
			target_string,
			target_byte_array,
		});
	});

	describe('longer form', () => {
		testFactory({
			is_ipv4: false,
			source_string: 'fe80:dead:be:ef::0001',
			source_byte_array: target_byte_array,
			target_string,
			target_byte_array,
		});
	});

	describe('full form', () => {
		testFactory({
			is_ipv4: false,
			source_string: 'fe80:dead:00be:00ef:0000:0000:0000:0001',
			source_byte_array: target_byte_array,
			target_string,
			target_byte_array,
		});
	});
});

describe('equality', () => {
	test('1', () => {
		expect(new IP('127.0.0.1').equals(new IP('::ffff:127.0.0.1'))).toBe(true);
	});

	test('2', () => {
		expect(new IP('127.0.0.1').equals(new IP('::ffff:7f00:1'))).toBe(true);
	});

	test('3', () => {
		expect(
			new IP('fe80:00de:00ad:0000:0000:0000:0000:0001').equals(
				new IP('fe80:de:ad::1'),
			),
		).toBe(true);
	});
});

describe('isPrivate', () => {
	test('IPv4', () => {
		expect(new IP('10.10.13.1').isPrivate()).toBe(true);
		expect(new IP('172.16.18.1').isPrivate()).toBe(true);
		expect(new IP('5.9.69.13').isPrivate()).toBe(false);
	});

	test('IPv6', () => {
		expect(new IP('fd80::1').isPrivate()).toBe(true);
		expect(new IP('fc00::1').isPrivate()).toBe(true);
		expect(new IP('2001:4860:4860::8888').isPrivate()).toBe(false);
	});
});

describe('isLoopback', () => {
	test('IPv4', () => {
		expect(new IP('127.0.0.1').isLoopback()).toBe(true);
		expect(new IP('10.0.13.1').isLoopback()).toBe(false);
		expect(new IP('8.8.8.8').isLoopback()).toBe(false);
	});

	test('IPv6', () => {
		expect(new IP('::1').isLoopback()).toBe(true);
		expect(new IP('fc00::1').isLoopback()).toBe(false);
		expect(new IP('2001:4860:4860::8888').isLoopback()).toBe(false);
	});
});

describe('subnets', () => {
	describe('IPv4', () => {
		const ip_subnet = new IP('127.0.0.0/8');

		test('includes', () => {
			expect(ip_subnet.includes(new IP('127.0.0.1'))).toBe(true);
		});

		test('excludes', () => {
			expect(ip_subnet.includes(new IP('8.8.8.8'))).toBe(false);
		});
	});

	describe('IPv6', () => {
		const ip_subnet = new IP('fc00::/7');

		test('includes', () => {
			expect(ip_subnet.includes(new IP('fd80::1'))).toBe(true);
		});

		test('excludes', () => {
			expect(ip_subnet.includes(new IP('2001:4860:4860::8888'))).toBe(false);
		});
	});
});
