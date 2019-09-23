import { CountryName } from '$constants/countrysNames';

export const toStringWithFirstUppercaseLetter = (string: string): string => string[0].toUpperCase() + string.slice(1);

export const generateCountryNameForSprite = (countryCode: string): string => {
  if (countryCode && /[A-Z]{2}/.test(countryCode.toUpperCase())) {
    if (CountryName[countryCode]) {
      const countryNameArr = CountryName[countryCode].split(' ');

      return countryNameArr.map((currentItem: string) => currentItem.toLowerCase()).join('-');
    }
  }

  return 'unknown';
};
