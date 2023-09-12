/**
 * Detects if the browser is Brave
 *
 * @param device - object containing device flags
 */
export default async function ({ $device }: { $device: DeviceExtended }) {
  const navigatorBrave = navigator as NavigatorExtended
  $device.isBrave =
    (navigatorBrave.brave && (await navigatorBrave.brave.isBrave())) || false
}
