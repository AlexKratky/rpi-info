import fs from 'fs';

interface PiModel {
    model: string;
    ram: string;
    manufacturer: string;
    revision?: string;
}

// Define the type for the overall object using a mapped type
type RevisionsData = {
    [key: string]: PiModel;
}

/** Lookup table for model type field (bits 4-11) */
const modelTypes: { [key: number]: string } = {
    0x00: 'A',
    0x01: 'B',
    0x02: 'A+',
    0x03: 'B+',
    0x04: '2B',
    0x05: 'Alpha',
    0x06: 'CM1',
    0x08: '3B',
    0x09: 'Zero',
    0x0a: 'CM3',
    0x0c: 'Zero W',
    0x0d: '3B+',
    0x0e: '3A+',
    0x10: 'CM3+',
    0x11: '4B',
    0x12: 'Zero 2 W',
    0x13: 'Pi 400',
    0x14: 'CM4',
    0x15: 'CM4S',
    0x17: '5',
    0x18: 'CM5',
    0x19: '500',
    0x1a: 'CM5 Lite',
};

/** Lookup table for processor field (bits 12-15) */
const processorTypes: { [key: number]: string } = {
    0: 'BCM2835',
    1: 'BCM2836',
    2: 'BCM2837',
    3: 'BCM2711',
    4: 'BCM2712',
};

/** Lookup table for manufacturer field (bits 16-19) */
const manufacturerTypes: { [key: number]: string } = {
    0: 'Sony UK',
    1: 'Egoman',
    2: 'Embest',
    3: 'Sony Japan',
    4: 'Embest',
    5: 'Stadium',
};

/** Lookup table for memory size field (bits 20-22) */
const memoryTypes: { [key: number]: string } = {
    0: '256MB',
    1: '512MB',
    2: '1GB',
    3: '2GB',
    4: '4GB',
    5: '8GB',
    6: '16GB',
};

/** @see https://www.raspberrypi.com/documentation/computers/raspberry-pi.html#new-style-revision-codes-in-use */
export const revisions: RevisionsData = {
    '900021': { model: 'A+', ram: '512MB', manufacturer: 'Sony UK' },
    '900032': { model: 'B+', ram: '512MB', manufacturer: 'Sony UK' },
    '900092': { model: 'Zero', ram: '512MB', manufacturer: 'Sony UK' },
    '900093': { model: 'Zero', ram: '512MB', manufacturer: 'Sony UK' },
    '9000c1': { model: 'Zero W', ram: '512MB', manufacturer: 'Sony UK' },
    '9020e0': { model: '3A+', ram: '512MB', manufacturer: 'Sony UK' },
    '9020e1': { model: '3A+', ram: '512MB', manufacturer: 'Sony UK' },
    '920092': { model: 'Zero', ram: '512MB', manufacturer: 'Embest' },
    '920093': { model: 'Zero', ram: '512MB', manufacturer: 'Embest' },
    '900061': { model: 'CM1', ram: '512MB', manufacturer: 'Sony UK' },
    'a01040': { model: '2B', ram: '1GB', manufacturer: 'Sony UK' },
    'a01041': { model: '2B', ram: '1GB', manufacturer: 'Sony UK' },
    'a02082': { model: '3B', ram: '1GB', manufacturer: 'Sony UK' },
    'a020a0': { model: 'CM3', ram: '1GB', manufacturer: 'Sony UK' },
    'a020d3': { model: '3B+', ram: '1GB', manufacturer: 'Sony UK' },
    'a020d4': { model: '3B+', ram: '1GB', manufacturer: 'Sony UK' },
    'a02042': { model: '2B (with BCM2837)', ram: '1GB', manufacturer: 'Sony UK' },
    'a21041': { model: '2B', ram: '1GB', manufacturer: 'Embest' },
    'a22042': { model: '2B (with BCM2837)', ram: '1GB', manufacturer: 'Embest' },
    'a22082': { model: '3B', ram: '1GB', manufacturer: 'Embest' },
    'a220a0': { model: 'CM3', ram: '1GB', manufacturer: 'Embest' },
    'a32082': { model: '3B', ram: '1GB', manufacturer: 'Sony Japan' },
    'a52082': { model: '3B', ram: '1GB', manufacturer: 'Stadium' },
    'a22083': { model: '3B', ram: '1GB', manufacturer: 'Embest' },
    'a02100': { model: 'CM3+', ram: '1GB', manufacturer: 'Sony UK' },
    'a03111': { model: '4B', ram: '1GB', manufacturer: 'Sony UK' },
    'b03111': { model: '4B', ram: '2GB', manufacturer: 'Sony UK' },
    'b03112': { model: '4B', ram: '2GB', manufacturer: 'Sony UK' },
    'b03114': { model: '4B', ram: '2GB', manufacturer: 'Sony UK' },
    'b03115': { model: '4B', ram: '2GB', manufacturer: 'Sony UK' },
    'c03111': { model: '4B', ram: '4GB', manufacturer: 'Sony UK' },
    'c03112': { model: '4B', ram: '4GB', manufacturer: 'Sony UK' },
    'c03114': { model: '4B', ram: '4GB', manufacturer: 'Sony UK' },
    'c03115': { model: '4B', ram: '4GB', manufacturer: 'Sony UK' },
    'd03114': { model: '4B', ram: '8GB', manufacturer: 'Sony UK' },
    'd03115': { model: '4B', ram: '8GB', manufacturer: 'Sony UK' },
    'c03130': { model: 'Pi 400', ram: '4GB', manufacturer: 'Sony UK' },
    'a03140': { model: 'CM4', ram: '1GB', manufacturer: 'Sony UK' },
    'b03140': { model: 'CM4', ram: '2GB', manufacturer: 'Sony UK' },
    'c03140': { model: 'CM4', ram: '4GB', manufacturer: 'Sony UK' },
    'd03140': { model: 'CM4', ram: '8GB', manufacturer: 'Sony UK' },
    '902120': { model: 'Zero 2 W', ram: '512MB', manufacturer: 'Sony UK' },
    'c04170': { model: '5', ram: '4GB', manufacturer: 'Sony UK' },
    'd04170': { model: '5', ram: '8GB', manufacturer: 'Sony UK' },
    'b04171': {model: '5', revision: '1.1', ram: '2GB', manufacturer: 'Sony UK'},
    'c04171': {model: '5', revision: '1.1', ram: '4GB', manufacturer: 'Sony UK'},
    'd04171': {model: '5', revision: '1.1', ram: '8GB', manufacturer: 'Sony UK'},
    'e04171': {model: '5', revision: '1.1', ram: '16GB', manufacturer: 'Sony UK'},
    'b04180': {model: 'CM5', revision: '1.0', ram: '2GB', manufacturer: 'Sony UK'},
    'c04180': {model: 'CM5', revision: '1.0', ram: '4GB', manufacturer: 'Sony UK'},
    'd04180': {model: 'CM5', revision: '1.0', ram: '8GB', manufacturer: 'Sony UK'},
    'd04190': {model: '500', revision: '1.0', ram: '8GB', manufacturer: 'Sony UK'},
    'b041a0': {model: 'CM5 Lite', revision: '1.0', ram: '2GB', manufacturer: 'Sony UK'},
    'c041a0': {model: 'CM5 Lite', revision: '1.0', ram: '4GB', manufacturer: 'Sony UK'},
    'd041a0': {model: 'CM5 Lite', revision: '1.0', ram: '8GB', manufacturer: 'Sony UK'},
};
export type RaspberryPiInfoResult = {
    isRaspberry: boolean,
    model: string|null,
    fullModelName: string|null,
    fullModelNameWithRam: string|null,
    ram: string|null,
    manufacturer: string|null,
    revisionCode: string|null,
}

export class RaspberryPiInfo {

    public readonly revisions: RevisionsData;
    public readonly raspberryPiBaseName: string;

    constructor(additionalRevisions: RevisionsData = {}, raspberryPiBaseName = 'Raspberry Pi') {
        this.revisions = {...revisions, ...additionalRevisions};
        this.raspberryPiBaseName = raspberryPiBaseName;
    }

    public detect(): RaspberryPiInfoResult {
        const info = {
            isRaspberry: false,
            model: null,
            fullModelName: null,
            fullModelNameWithRam: null,
            ram: null,
            manufacturer: null,
            revisionCode: null,
        } as RaspberryPiInfoResult;

        try {
            const revisionCode = this.readRevisionCode();
            if (revisionCode === null) {
                return info;
            }

            // First try the static revision map
            const revision = this.revisions[revisionCode];
            if (revision) {
                info.isRaspberry = true;
                info.model = revision.model;
                info.fullModelName = `${this.raspberryPiBaseName} ${info.model}`;
                info.fullModelNameWithRam = `${this.raspberryPiBaseName} ${info.model} - ${revision.ram}`;
                info.ram = revision.ram;
                info.manufacturer = revision.manufacturer;
                info.revisionCode = revisionCode;
                return info;
            }

            // Fallback: decode the revision code using bit fields
            const decoded = this.decodeRevisionCode(revisionCode);
            if (decoded) {
                info.isRaspberry = true;
                info.model = decoded.model;
                info.fullModelName = `${this.raspberryPiBaseName} ${info.model}`;
                info.fullModelNameWithRam = `${this.raspberryPiBaseName} ${info.model} - ${decoded.ram}`;
                info.ram = decoded.ram;
                info.manufacturer = decoded.manufacturer;
                info.revisionCode = revisionCode;
                return info;
            }

            return info;
        } catch (e) {
            // cpuinfo not found, prob not rpi
            return info;
        }
    }

    /**
     * Decode a new-style revision code by extracting bit fields.
     * This handles unknown revision codes that aren't in the static map,
     * so new board revisions are automatically supported.
     *
     * Bit layout (new-style, bit 23 = 1):
     *   Bits 0-3:   Board revision
     *   Bits 4-11:  Model type
     *   Bits 12-15: Processor
     *   Bits 16-19: Manufacturer
     *   Bits 20-22: Memory size
     *   Bit 23:     New flag (must be 1)
     *
     * @see https://www.raspberrypi.com/documentation/computers/raspberry-pi.html#new-style-revision-codes-in-use
     */
    private decodeRevisionCode(revisionCode: string): PiModel | null {
        const code = parseInt(revisionCode, 16);
        if (isNaN(code)) {
            return null;
        }

        // Check bit 23 — must be 1 for new-style revision codes
        const isNewStyle = (code >> 23) & 0x1;
        if (!isNewStyle) {
            return null;
        }

        const modelType = (code >> 4) & 0xff;
        const manufacturerId = (code >> 16) & 0xf;
        const memoryId = (code >> 20) & 0x7;

        const model = modelTypes[modelType];
        if (!model) {
            return null;
        }

        const ram = memoryTypes[memoryId] ?? 'Unknown';
        const manufacturer = manufacturerTypes[manufacturerId] ?? 'Unknown';

        return { model, ram, manufacturer };
    }

    private readRevisionCode(): string|null {
        const cpuInfo = fs.readFileSync('/proc/cpuinfo', { encoding: 'utf8' });
        const revisionLine = cpuInfo.split('\n')
            .reverse()
            .find(line => line.trim().startsWith('Revision'));

        if ( ! revisionLine) {
            return null;
        }

        return revisionLine.replace(/\s/g, '').replace('Revision:', '');
    }
}