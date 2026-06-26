import { describe, expect, test } from 'vitest';
import { CIDR } from './cidr.js';
import { IP } from './ip.js';

describe('constructor', () => {
	describe('IPv4', () => {
		const ip_string = '192.168.0.1';
		const mask = 24;
		const cidr_string = `192.168.0.0/24`;

		test('from string', () => {
			const cidr = new CIDR(`${ip_string}/${mask}`);
			expect(cidr.toString()).toBe(cidr_string);
			expect(cidr.ip.toString()).toBe(ip_string);
			expect(cidr.mask).toBe(mask);
		});

		test('from string (as IPv6)', () => {
			const cidr = new CIDR(`::ffff:${ip_string}/${96 + mask}`);
			expect(cidr.toString()).toBe(cidr_string);
			expect(cidr.ip.toString()).toBe(ip_string);
			expect(cidr.mask).toBe(mask);
		});
	});

	describe('IPv6', () => {
		const ip_string = 'fe80:dead:be:ef::1';
		const mask = 64;
		const cidr_string = `fe80:dead:be:ef::/64`;

		test('from string', () => {
			const cidr = new CIDR(`${ip_string}/${mask}`);
			expect(cidr.toString()).toBe(cidr_string);
			expect(cidr.ip.toString()).toBe(ip_string);
			expect(cidr.mask).toBe(mask);
		});
	});
});

describe('includes', () => {
	test('IPv4', () => {
		const cidr = new CIDR('127.0.0.0/8');

		expect(cidr.includes(new IP('127.0.0.1'))).toBe(true);
		expect(cidr.includes(new IP('8.8.8.8'))).toBe(false);
	});

	test('IPv6', () => {
		const cidr = new CIDR('fc00::/7');

		expect(cidr.includes(new IP('fd80::1'))).toBe(true);
		expect(cidr.includes(new IP('2001:4860:4860::8888'))).toBe(false);
	});
});
