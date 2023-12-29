
/* global describe, test, expect */

import { IP } from './main.js';

describe('IPv4', () => {
	const ip_string = '127.0.0.1';
	const ip_buffer = Buffer.from([ 127, 0, 0, 1 ]);

	describe('in form of IPv4', () => {
		const ip_from_string = new IP(ip_string);
		const ip_from_buffer = new IP(ip_buffer);

		test('is4', () => {
			expect(
				ip_from_string.is4(),
			).toBe(true);

			expect(
				ip_from_buffer.is4(),
			).toBe(true);
		});

		test('from string to string', () => {
			expect(
				ip_from_string.toString(),
			).toBe(ip_string);
		});

		test('from string to buffer', () => {
			expect(
				ip_from_string.toBuffer(),
			).toStrictEqual(ip_buffer);
		});

		test('from buffer to string', () => {
			expect(
				ip_from_buffer.toString(),
			).toBe(ip_string);
		});

		test('from buffer to buffer', () => {
			expect(
				ip_from_buffer.toBuffer(),
			).toStrictEqual(ip_buffer);
		});
	});

	describe('in form of IPv4 in IPv6', () => {
		const ip_from_string = new IP(`::ffff:${ip_string}`);
		const ip_from_buffer = new IP(
			Buffer.from([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0xFF, 0xFF, 127, 0, 0, 1 ]),
		);

		test('is4', () => {
			expect(
				ip_from_string.is4(),
			).toBe(true);

			expect(
				ip_from_buffer.is4(),
			).toBe(true);
		});

		test('from string to string', () => {
			expect(
				ip_from_string.toString(),
			).toBe(ip_string);
		});

		test('from string to buffer', () => {
			expect(
				ip_from_string.toBuffer(),
			).toStrictEqual(ip_buffer);
		});

		test('from buffer to string', () => {
			expect(
				ip_from_buffer.toString(),
			).toBe(ip_string);
		});

		test('from buffer to buffer', () => {
			expect(
				ip_from_buffer.toBuffer(),
			).toStrictEqual(ip_buffer);
		});
	});

	describe('in form of IPv6', () => {
		const ip_from_string = new IP('::ffff:7f00:1');

		test('is4', () => {
			expect(
				ip_from_string.is4(),
			).toBe(true);
		});

		test('from string to string', () => {
			expect(
				ip_from_string.toString(),
			).toBe(ip_string);
		});

		test('from string to buffer', () => {
			expect(
				ip_from_string.toBuffer(),
			).toStrictEqual(ip_buffer);
		});
	});
});

describe('IPv6', () => {
	const ip_string = 'fe80:dead:be:ef::1';
	const ip_string_longer = 'fe80:dead:be:ef::0001';
	const ip_buffer = Buffer.from([ 0xFE, 0x80, 0xDE, 0xAD, 0, 0xBE, 0, 0xEF, 0, 0, 0, 0, 0, 0, 0, 1 ]);

	const ip_from_string = new IP(ip_string_longer);
	const ip_from_buffer = new IP(ip_buffer);

	test('is4', () => {
		expect(
			ip_from_string.is4(),
		).toBe(false);

		expect(
			ip_from_buffer.is4(),
		).toBe(false);
	});

	test('from string to string', () => {
		expect(
			ip_from_string.toString(),
		).toBe(ip_string);
	});

	test('from string to buffer', () => {
		expect(
			ip_from_string.toBuffer(),
		).toStrictEqual(ip_buffer);
	});

	test('from buffer to string', () => {
		expect(
			ip_from_buffer.toString(),
		).toBe(ip_string);
	});

	test('from buffer to buffer', () => {
		expect(
			ip_from_buffer.toBuffer(),
		).toStrictEqual(ip_buffer);
	});
});

describe('equality', () => {
	test('1', () => {
		expect(
			new IP('127.0.0.1').equals(
				new IP('::ffff:127.0.0.1'),
			),
		).toBe(true);
	});

	test('2', () => {
		expect(
			new IP('127.0.0.1').equals(
				new IP('::ffff:7f00:1'),
			),
		).toBe(true);
	});

	test('3', () => {
		expect(
			new IP('fe80:00de:00ad:0000:0000:0000:0000:0001').equals(
				new IP('fe80:de:ad::1'),
			),
		).toBe(true);
	});
});

describe('subnets', () => {
	describe('IPv4', () => {
		const ip_subnet = new IP('127.0.0.0/8');

		test('includes', () => {
			expect(
				ip_subnet.includes(
					new IP('127.0.0.1'),
				),
			).toBe(true);
		});

		test('excludes', () => {
			expect(
				ip_subnet.includes(
					new IP('8.8.8.8'),
				),
			).toBe(false);
		});
	});

	describe('IPv6', () => {
		const ip_subnet = new IP('fc00::/7');

		test('includes', () => {
			expect(
				ip_subnet.includes(
					new IP('fd80::1'),
				),
			).toBe(true);
		});

		test('excludes', () => {
			expect(
				ip_subnet.includes(
					new IP('2001:4860:4860::8888'),
				),
			).toBe(false);
		});
	});
});
