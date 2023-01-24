import logg from "../Logs/Customlog";
import { Video } from "../models";

export const toISOStringWithTimezone = (date_main: Date | string) => {
  const date = new Date(date_main);
  const tzOffset = -date.getTimezoneOffset();
  const diff = tzOffset >= 0 ? "+" : "-";
  const pad = (n: number) => `${Math.floor(Math.abs(n))}`.padStart(2, "0");
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds()) +
    diff +
    pad(tzOffset / 60) +
    ":" +
    pad(tzOffset % 60)
  );
};

export const timeDifference = (old_d: Date | string, new_d: Date | string) => {
  //get the difference in the 2 values and return it in days
  const O = new Date(old_d),
    N = new Date(new_d);
  const diff: number = (N.valueOf() - O.valueOf()) / (24 * 60 * 60 * 1000);
  return Math.abs(diff);
};

export const doesVideoExist = async (_id: string): Promise<boolean> => {
  try {
    const doesExist = await Video.findOne({ _id });
    if (doesExist) {
      //if the result is not null
      return true;
    } //if its null
    return false;
  } catch (e: any) {
    logg.warn("there was a problem while checking for video");
    console.log(e.message);
    throw new Error(e.message);
  }
};
