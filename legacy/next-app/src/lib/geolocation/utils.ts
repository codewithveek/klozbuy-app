/**
 * Calculates the great-circle distance between two points on Earth
 * using the Haversine formula
 *
 * @param firstLatitude - Latitude of the first point in decimal degrees
 * @param firstLongitude - Longitude of the first point in decimal degrees
 * @param secondLatitude - Latitude of the second point in decimal degrees
 * @param secondLongitude - Longitude of the second point in decimal degrees
 * @returns Distance between the two points in kilometers
 */
export function calculateHaversineDistance(
  firstLatitude: number,
  firstLongitude: number,
  secondLatitude: number,
  secondLongitude: number
): number {
  const earthRadiusInKilometers = 6371;

  // Convert latitude and longitude differences to radians
  const latitudeDifferenceInRadians =
    ((secondLatitude - firstLatitude) * Math.PI) / 180;
  const longitudeDifferenceInRadians =
    ((secondLongitude - firstLongitude) * Math.PI) / 180;

  // Convert latitudes to radians
  const firstLatitudeInRadians = (firstLatitude * Math.PI) / 180;
  const secondLatitudeInRadians = (secondLatitude * Math.PI) / 180;

  // Haversine formula calculation
  const haversineValue =
    Math.sin(latitudeDifferenceInRadians / 2) *
      Math.sin(latitudeDifferenceInRadians / 2) +
    Math.cos(firstLatitudeInRadians) *
      Math.cos(secondLatitudeInRadians) *
      Math.sin(longitudeDifferenceInRadians / 2) *
      Math.sin(longitudeDifferenceInRadians / 2);

  const centralAngle =
    2 * Math.atan2(Math.sqrt(haversineValue), Math.sqrt(1 - haversineValue));

  return earthRadiusInKilometers * centralAngle;
}
