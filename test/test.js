import {
	strictEqual,
	deepStrictEqual } from 'node:assert/strict';
import {
	describe,
	it              } from 'mocha';

import IP from '../src/main.js';

const BUFFER_127_0_0_1 = Buffer.from([ 127, 0, 0, 1 ]);

describe('Raw IPv4', () => {
	describe('from string', () => {
		const ip = new IP('127.0.0.1');

		it('toString', () => {
			strictEqual(
				ip.toString(),
				'127.0.0.1',
			);
		});

		it('toBuffer', () => {
			deepStrictEqual(
				ip.toBuffer(),
				BUFFER_127_0_0_1,
			);
		});
	});

	describe('from buffer', () => {
		const ip = new IP(BUFFER_127_0_0_1);

		it('toString', () => {
			strictEqual(
				ip.toString(),
				'127.0.0.1',
			);
		});

		it('toBuffer', () => {
			deepStrictEqual(
				ip.toBuffer(),
				BUFFER_127_0_0_1,
			);
		});
	});
});

describe('Prefixed IPv4', () => {
	describe('from string', () => {
		const ip = new IP('::ffff:127.0.0.1');

		it('toString', () => {
			strictEqual(
				ip.toString(),
				'127.0.0.1',
			);
		});

		it('toBuffer', () => {
			deepStrictEqual(
				ip.toBuffer(),
				BUFFER_127_0_0_1,
			);
		});
	});

	describe('from buffer', () => {
		const ip = new IP(Buffer.from([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0xFF, 0xFF, 127, 0, 0, 1 ]));

		it('toString', () => {
			strictEqual(
				ip.toString(),
				'127.0.0.1',
			);
		});

		it('toBuffer', () => {
			deepStrictEqual(
				ip.toBuffer(),
				BUFFER_127_0_0_1,
			);
		});
	});
});

describe('Prefixed IPv4 as IPv6', () => {
	describe('from string', () => {
		const ip = new IP('::ffff:7f00:1');

		it('toString', () => {
			strictEqual(
				ip.toString(),
				'127.0.0.1',
			);
		});

		it('toBuffer', () => {
			deepStrictEqual(
				ip.toBuffer(),
				BUFFER_127_0_0_1,
			);
		});
	});

	describe('from buffer', () => {
		const ip = new IP(Buffer.from([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0xFF, 0xFF, 127, 0, 0, 1 ]));

		it('toString', () => {
			strictEqual(
				ip.toString(),
				'127.0.0.1',
			);
		});

		it('toBuffer', () => {
			deepStrictEqual(
				ip.toBuffer(),
				BUFFER_127_0_0_1,
			);
		});
	});
});

describe('IPv6', () => {
	describe('from string', () => {
		const ip = new IP('fe80:dead:be:ef::0001');

		it('toString', () => {
			strictEqual(
				ip.toString(),
				'fe80:dead:be:ef::1',
			);
		});

		it('toBuffer', () => {
			deepStrictEqual(
				ip.toBuffer(),
				Buffer.from([ 0xFE, 0x80, 0xDE, 0xAD, 0, 0xBE, 0, 0xEF, 0, 0, 0, 0, 0, 0, 0, 1 ]),
			);
		});
	});

	describe('from buffer', () => {
		const ip = new IP(Buffer.from([ 0xFE, 0x80, 0xDE, 0xAD, 0, 0xBE, 0, 0xEF, 0, 0, 0, 0, 0, 0, 0, 1 ]));

		it('toString', () => {
			strictEqual(
				ip.toString(),
				'fe80:dead:be:ef::1',
			);
		});

		it('toBuffer', () => {
			deepStrictEqual(
				ip.toBuffer(),
				Buffer.from([ 0xFE, 0x80, 0xDE, 0xAD, 0, 0xBE, 0, 0xEF, 0, 0, 0, 0, 0, 0, 0, 1 ]),
			);
		});
	});
});

describe('equality', () => {
	it('1', () => {
		strictEqual(
			new IP('127.0.0.1').equals(
				new IP('::ffff:127.0.0.1'),
			),
			true,
		);
	});
	it('2', () => {
		strictEqual(
			new IP('127.0.0.1').equals(
				new IP('::ffff:7f00:1'),
			),
			true,
		);
	});
	it('3', () => {
		strictEqual(
			new IP('fe80:00de:00ad:0000:0000:0000:0000:0001').equals(
				new IP('fe80:de:ad::1'),
			),
			true,
		);
	});
});

describe('Subnets', () => {
	describe('IPv4', () => {
		const ip_subnet = new IP('127.0.0.0/8');

		it('includes', () => {
			strictEqual(
				ip_subnet.includes(
					new IP('127.0.0.1'),
				),
				true,
			);
		});

		it('excludes', () => {
			strictEqual(
				ip_subnet.includes(
					new IP('8.8.8.8'),
				),
				false,
			);
		});
	});

	describe('IPv6', () => {
		const ip_subnet = new IP('fc00::/7');

		it('includes', () => {
			strictEqual(
				ip_subnet.includes(
					new IP('fd80::1'),
				),
				true,
			);
		});

		it('excludes', () => {
			strictEqual(
				ip_subnet.includes(
					new IP('2001:4860:4860::8888'),
				),
				false,
			);
		});
	});
});
