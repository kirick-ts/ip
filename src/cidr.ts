import type { Address6 } from 'ip-address';
import { IP } from './ip.js';
import { fromString, isAddress4 } from './utils.js';

export class CIDR {
	#address6: Address6;
	readonly ip: IP;
	readonly ip_start: IP;
	readonly ip_end: IP;
	readonly mask: number;

	constructor(value: string);
	constructor(value: ArrayBuffer | Uint8Array | Buffer, mask: number);
	constructor(ip: IP, mask: number);
	constructor(
		arg0: string | ArrayBuffer | Uint8Array | Buffer | IP,
		mask?: number,
	) {
		if (typeof arg0 === 'string') {
			this.#address6 = fromString(arg0);
			this.mask =
				this.#address6.subnetMask - (isAddress4(this.#address6) ? 96 : 0);
		} else {
			this.ip = arg0 instanceof IP ? arg0 : new IP(arg0);
			this.#address6 = fromString(`${this.ip.toString()}/${mask}`);
			this.mask = mask!;
		}

		this.ip ??= new IP(this.#address6.correctForm());
		this.ip_start = new IP(this.#address6.startAddress().correctForm());
		this.ip_end = new IP(this.#address6.endAddress().correctForm());
	}

	/**
	 * Checks if IP address is in subnet of current CIDR.
	 * @param ip IP address to check.
	 */
	includes(ip: IP): boolean {
		return ip._address6.isInSubnet(this.#address6);
	}

	/** Returns IP addCIDRress as string. */
	toString(): string {
		return `${this.ip_start.toString()}/${this.mask}`;
	}
}
