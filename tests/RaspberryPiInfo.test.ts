import fs from 'fs';
import { RaspberryPiInfo, RaspberryPiInfoResult } from '../index'; // Adjust the path as necessary

jest.mock('fs');

describe('RaspberryPiInfo', () => {
    beforeAll(() => {
        // Mock the content of /proc/cpuinfo
        const cpuInfoContent = `
processor   : 0
BogoMIPS    : 108.00
Features    : fp asimd evtstrm aes pmull sha1 sha2 crc32 atomics fphp asimdhp cpuid asimdrdm lrcpc dcpop asimddp
CPU implementer : 0x41
CPU architecture: 8
CPU variant : 0x4
CPU part    : 0xd0b
CPU revision: 1

processor   : 1
BogoMIPS    : 108.00
Features    : fp asimd evtstrm aes pmull sha1 sha2 crc32 atomics fphp asimdhp cpuid asimdrdm lrcpc dcpop asimddp
CPU implementer : 0x41
CPU architecture: 8
CPU variant : 0x4
CPU part    : 0xd0b
CPU revision: 1

processor   : 2
BogoMIPS    : 108.00
Features    : fp asimd evtstrm aes pmull sha1 sha2 crc32 atomics fphp asimdhp cpuid asimdrdm lrcpc dcpop asimddp
CPU implementer : 0x41
CPU architecture: 8
CPU variant : 0x4
CPU part    : 0xd0b
CPU revision: 1

processor   : 3
BogoMIPS    : 108.00
Features    : fp asimd evtstrm aes pmull sha1 sha2 crc32 atomics fphp asimdhp cpuid asimdrdm lrcpc dcpop asimddp
CPU implementer : 0x41
CPU architecture: 8
CPU variant : 0x4
CPU part    : 0xd0b
CPU revision: 1

Revision    : c04170
Serial      : d18eff6ba14f4538
Model       : Raspberry Pi 5 Model B Rev 1.0
`;

        // Mock the readFileSync method to return the cpuInfoContent
        (fs.readFileSync as jest.Mock).mockReturnValue(cpuInfoContent);
    });

    it('should detect Raspberry Pi model based on /proc/cpuinfo', () => {
        const piInfo = new RaspberryPiInfo();
        const result: RaspberryPiInfoResult = piInfo.detect();

        expect(result).toEqual({
            isRaspberry: true,
            model: '5',
            fullModelName: 'Raspberry Pi 5',
            fullModelNameWithRam: 'Raspberry Pi 5 - 4GB',
            ram: '4GB',
            manufacturer: 'Sony UK',
            revisionCode: 'c04170'
        });
    });

    it('should detect Raspberry Pi model based on /proc/cpuinfo with custom revision', () => {
        const piInfo = new RaspberryPiInfo({'c04170': 
            { model: '0', ram: '128GB', manufacturer: 'Custom' }
        });
        const result: RaspberryPiInfoResult = piInfo.detect();

        expect(result).toEqual({
            isRaspberry: true,
            model: '0',
            fullModelName: 'Raspberry Pi 0',
            fullModelNameWithRam: 'Raspberry Pi 0 - 128GB',
            ram: '128GB',
            manufacturer: 'Custom',
            revisionCode: 'c04170'
        });
    });

    it('should detect Raspberry Pi model based on /proc/cpuinfo with custom rpi name', () => {
        const piInfo = new RaspberryPiInfo({}, 'Custom RPI');
        const result: RaspberryPiInfoResult = piInfo.detect();

        expect(result).toEqual({
            isRaspberry: true,
            model: '5',
            fullModelName: 'Custom RPI 5',
            fullModelNameWithRam: 'Custom RPI 5 - 4GB',
            ram: '4GB',
            manufacturer: 'Sony UK',
            revisionCode: 'c04170'
        });
    });

    it('should return default values when /proc/cpuinfo does not contain Revision', () => {
        // Mock a different content without the Revision line
        const noRevisionContent = `
processor   : 0
BogoMIPS    : 108.00
Features    : fp asimd evtstrm aes pmull sha1 sha2 crc32 atomics fphp asimdhp cpuid asimdrdm lrcpc dcpop asimddp
CPU implementer : 0x41
CPU architecture: 8
CPU variant : 0x4
CPU part    : 0xd0b
CPU revision: 1
`;

        (fs.readFileSync as jest.Mock).mockReturnValue(noRevisionContent);

        const piInfo = new RaspberryPiInfo();
        const result: RaspberryPiInfoResult = piInfo.detect();

        expect(result).toEqual({
            isRaspberry: false,
            model: null,
            fullModelName: null,
            fullModelNameWithRam: null,
            ram: null,
            manufacturer: null,
            revisionCode: null
        });
    });

    it('should return default values when revision code is not found in revisions', () => {
        // Mock a different content with an unknown Revision code
        const unknownRevisionContent = `
processor   : 0
BogoMIPS    : 108.00
Features    : fp asimd evtstrm aes pmull sha1 sha2 crc32 atomics fphp asimdhp cpuid asimdrdm lrcpc dcpop asimddp
CPU implementer : 0x41
CPU architecture: 8
CPU variant : 0x4
CPU part    : 0xd0b
CPU revision: 1

Revision    : unknown
Serial      : d18eff6ba14f4538
Model       : Raspberry Pi 5 Model B Rev 1.0
`;

        (fs.readFileSync as jest.Mock).mockReturnValue(unknownRevisionContent);

        const piInfo = new RaspberryPiInfo();
        const result: RaspberryPiInfoResult = piInfo.detect();

        expect(result).toEqual({
            isRaspberry: false,
            model: null,
            fullModelName: null,
            fullModelNameWithRam: null,
            ram: null,
            manufacturer: null,
            revisionCode: null
        });
    });

    it('should decode an unknown new-style revision code using bit fields', () => {
        // c03116 is a new-style code (bit 23 = 1) for a 4B, 4GB, Sony UK, revision 6
        // This code is NOT in the static revisions map, so it should be decoded
        const unknownNewStyleContent = `
processor   : 0
BogoMIPS    : 108.00
Features    : fp asimd evtstrm aes pmull sha1 sha2 crc32 atomics fphp asimdhp cpuid asimdrdm lrcpc dcpop asimddp
CPU implementer : 0x41
CPU architecture: 8
CPU variant : 0x4
CPU part    : 0xd0b
CPU revision: 1

Revision    : c03116
Serial      : d18eff6ba14f4538
Model       : Raspberry Pi 4 Model B Rev 1.6
`;

        (fs.readFileSync as jest.Mock).mockReturnValue(unknownNewStyleContent);

        const piInfo = new RaspberryPiInfo();
        const result: RaspberryPiInfoResult = piInfo.detect();

        expect(result).toEqual({
            isRaspberry: true,
            model: '4B',
            fullModelName: 'Raspberry Pi 4B',
            fullModelNameWithRam: 'Raspberry Pi 4B - 4GB',
            ram: '4GB',
            manufacturer: 'Sony UK',
            revisionCode: 'c03116'
        });
    });

    it('should decode an unknown new-style revision code for Pi 5 variant', () => {
        // d04172 — Pi 5 (type 0x17), 8GB (mem 5), Sony UK (mfr 0), revision 2
        const unknownPi5Content = `
processor   : 0
BogoMIPS    : 108.00

Revision    : d04172
Serial      : 0000000000000000
Model       : Raspberry Pi 5 Model B Rev 1.2
`;

        (fs.readFileSync as jest.Mock).mockReturnValue(unknownPi5Content);

        const piInfo = new RaspberryPiInfo();
        const result: RaspberryPiInfoResult = piInfo.detect();

        expect(result).toEqual({
            isRaspberry: true,
            model: '5',
            fullModelName: 'Raspberry Pi 5',
            fullModelNameWithRam: 'Raspberry Pi 5 - 8GB',
            ram: '8GB',
            manufacturer: 'Sony UK',
            revisionCode: 'd04172'
        });
    });

    it('should return default values for old-style revision code not in map', () => {
        // 0x0002 — old-style revision code (bit 23 = 0), not in the static map
        const oldStyleContent = `
processor   : 0

Revision    : 0002
Serial      : 0000000000000000
`;

        (fs.readFileSync as jest.Mock).mockReturnValue(oldStyleContent);

        const piInfo = new RaspberryPiInfo();
        const result: RaspberryPiInfoResult = piInfo.detect();

        expect(result).toEqual({
            isRaspberry: false,
            model: null,
            fullModelName: null,
            fullModelNameWithRam: null,
            ram: null,
            manufacturer: null,
            revisionCode: null
        });
    });
});
