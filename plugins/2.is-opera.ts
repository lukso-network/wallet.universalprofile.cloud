type OperaWindow = Window & {
  opera?: { addons?: unknown }
  opr?: { addons?: unknown }
}

/**
 * Detects if the browser is Opera
 *
 * @param device - object containing device flags
 */
export default async function ({ $device }: { $device: DeviceExtended }) {
  const operaWindow = window as OperaWindow
  $device.isOpera =
    (!!operaWindow.opr && !!operaWindow.opr.addons) ||
    !!operaWindow.opera ||
    navigator.userAgent.indexOf(' OPR/') >= 0
}
