# raspberrypi-info

A simple package to detect if your app is currently running on Raspberry Pi and also to detect which one.

## Usage

```ts
import { RaspberryPiInfo } from 'raspberrypi-info';

const raspberryPiInfo = new RaspberryPiInfo();

console.log(raspberryPiInfo.detect());
```

Expected output on Raspberry Pi device:

```js
{
    isRaspberry: true,
    model: '5',
    fullModelName: 'Raspberry Pi 5',
    fullModelNameWithRam: 'Raspberry Pi 5 - 4GB',
    ram: '4GB',
    manufacturer: 'Sony UK',
    revisionCode: 'c04170'
}
```

on non-Raspberry Pi device the output will be:

```js
{
    isRaspberry: false,
    model: null,
    fullModelName: null,
    fullModelNameWithRam: null,
    ram: null,
    manufacturer: null,
    revisionCode: null
}
```

## Custom usage

This package uses detection based on revision code presented in `/proc/cpuinfo` (you can list that on your machine by typing `cat /proc/cpuinfo` in your terminal) and uses that revision code to detect which model you are currently using. I will try to keep the list updated, but in case there is a new version of Raspberry Pi, or some custom, you can always pass additional revision codes to the constructor as the first parameter (You can add a completly new one, or override the existing):

```ts
import { RaspberryPiInfo } from 'raspberrypi-info';

const raspberryPiInfo = new RaspberryPiInfo(
    {'c04170': { model: '0', ram: '128GB', manufacturer: 'Custom' }},
    {'customRevisionCode': { model: 'New Raspberry Pi 6?', ram: '16GB', manufacturer: 'Custom' }},
);

console.log(raspberryPiInfo.detect());
```

Expected output on Raspberry Pi device:

```js
{
    isRaspberry: true,
    model: '0',
    fullModelName: 'Raspberry Pi 0',
    fullModelNameWithRam: 'Raspberry Pi 0 - 128GB',
    ram: '128GB',
    manufacturer: 'Custom',
    revisionCode: 'c04170'
}
```


By default, the fullModelName and fullModelNameWithRam start with 'Raspberry Pi', you can modify this behavior by passing the base name to the constructor as a second parameter:

```ts
import { RaspberryPiInfo } from 'raspberrypi-info';

const raspberryPiInfo = new RaspberryPiInfo({}, 'Custom PI');

console.log(raspberryPiInfo.detect());
```

Expected output on Raspberry Pi device:

```js
{
    isRaspberry: true,
    model: '5',
    fullModelName: 'Custom PI 5',
    fullModelNameWithRam: 'Custom PI 5 - 4GB',
    ram: '4GB',
    manufacturer: 'Sony UK',
    revisionCode: 'c04170'
}
```


## Contributing

Pull requests are always welcomed.

## With ❤️ by Alex Kratky

[Contact webpage](https://alexkratky.com/)