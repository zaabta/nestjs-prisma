import { type Request } from 'express';

export const extractTokenFromHeader = (
  request: Request,
): string | undefined => {
  const [type, token] =
    request.headers.authorization?.split(' ') ??
    [];
  return type === 'Bearer' ? token : undefined;
};


export const createFilter = <T>(value: T | T[] | undefined) => {
  if (typeof value === "string")
    return {
      contains: value,
      // mode: "insensitive",
    };
  else if (typeof value === "number")
    return {
      equals: value,
    };
  else if (Array.isArray(value) && value.length) return { in: value };
  return undefined;
};


export const createRangeFilter = <T>(
  min: T | undefined,
  max: T | undefined,
) => {
  if (typeof min === "number" || typeof max === "number") {
    return {
      lte: max ? max : Number.MAX_VALUE,
      gte: min ? min : Number.MIN_VALUE,
    } as { lte: T; gte: T };
  } else if (min instanceof Date && max instanceof Date) {
    return {
      lte: max ? max : Number.MAX_VALUE,
      gte: min ? min : Number.MIN_VALUE,
    } as { lte: T; gte: T };
  }
  return undefined;
};