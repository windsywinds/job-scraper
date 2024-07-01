import { WORKTYPES, WORKSTYLES, SENIORITYS, LOCATIONS, TIMING, BUSINESS_AREAS } from './keywords';
import purifyDesc from './purifyDesc';

import { JobListing } from '../../types/interfaces';

const mapDescription = async (value: string): Promise<string> => {
  const purifiedValue = await purifyDesc(value);
  return purifiedValue;
};

const mapApplyLink = (value: string): string =>
  value.replace(/^(https?:\/\/)?(www\.)?/, 'https://');

const mapTitle = (value: string): string => toPascalCase(value);

const mapWorkStyle = (value: string): string => findMatchAndUpdate(value, WORKSTYLES) || '';

const mapWorkType = (value: string): string => findMatchAndUpdate(value, WORKTYPES) || '';

const mapSeniority = (value: string): string => findMatchAndUpdate(value, SENIORITYS) || '';

const mapLocations = (value: string): string => findMatchAndUpdate(value, LOCATIONS) || '';

const mapTiming = (value: string): string => findMatchAndUpdate(value, TIMING) || '';

const mapBusinessAreas = (value: string): string => findMatchAndUpdate(value, BUSINESS_AREAS) || '';


async function dataRationaliser(jobListing: JobListing): Promise<Partial<JobListing>> {
    console.log(`Keys provided: ${Object.keys(jobListing).join(', ')}`);
    const rationalisedData: Partial<JobListing> = {
      applyLink: mapApplyLink(jobListing.applyLink),
      ...(jobListing.title && { title: mapTitle(jobListing.title) }),
      ...(jobListing.workStyle && { workStyle: mapWorkStyle(jobListing.workStyle) }),
      ...(jobListing.workType && { workType: mapWorkType(jobListing.workType) }),
      ...(jobListing.seniority && { seniority: mapSeniority(jobListing.seniority) }),
      ...(jobListing.locations && { locations: mapLocations(jobListing.locations) }),
      ...(jobListing.timing && { timing: mapTiming(jobListing.timing) }),
      ...(jobListing.areas && { areas: mapBusinessAreas(jobListing.areas) }),
      ...(jobListing.description && { description: await mapDescription(jobListing.description) }),
    };
  
    for (const [key, value] of Object.entries(rationalisedData)) {
      if (!value) {
        delete rationalisedData[key as keyof JobListing];
      }
    }
  
    return rationalisedData;
  }
  
  function findMatchAndUpdate(keyword: any, keywordArray: string[][]): any | null {
    let newArray = keyword;
    let matches = {};
  
    // if value is a string split words and create newArray
    if (typeof keyword === "string") {
      const value = keyword.toUpperCase();
      newArray = value.split(",").map((word) => word.trim());
    }
  
    if (typeof newArray === "object") {
      for (const key in newArray) {
        if (Object.hasOwnProperty.call(newArray, key)) {
          const value = newArray[key].toUpperCase();
          for (const arr of keywordArray) {
            if (arr.includes(value)) {
              console.log(
                `Match found in array from provided value: "${value}" matching keywords: "${arr}"`
              );
              matches = [arr[0]];
              break;
            }
          }
        }
      }
    }
  
    if (Object.keys(matches).length > 0) {
      return matches;
    } else {
      console.log(`no match found for: ${newArray}`);
      return null;
    }
  }

function toPascalCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word) {
      return word.toUpperCase();
    })
    .replace(/^\s+|\s+$/g, '');
}

export default dataRationaliser;
