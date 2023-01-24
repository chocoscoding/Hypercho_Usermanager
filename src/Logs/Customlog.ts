import winston, { createLogger, transports, addColors, format } from "winston";
const { combine, timestamp, colorize, printf } = format;

interface customLevel {
  levels: {
    fatal: number;
    error: number;
    warn: number;
    info: number;
  };
  colors: {
    fatal: string;
  };
}
const CustomLevels: customLevel = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
  },
  colors: {
    fatal: "bold white redBG",
  },
};

addColors(CustomLevels.colors);
const customFormat = printf(
  ({ level, message, timestamp }: any) =>
    `${timestamp} -:- [${level}] -:- ${message}`
);

const logg = createLogger({
  levels: CustomLevels.levels,
  format: combine(colorize(), timestamp(), customFormat),
  transports: [new transports.Console()],
}) as winston.Logger &
  Record<keyof typeof CustomLevels["levels"], winston.LeveledLogMethod>;

export default logg;
