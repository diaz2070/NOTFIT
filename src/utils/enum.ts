export default function toEnumValue<T extends object>(
  val: string,
  enumObj: T,
): T[keyof T] | undefined {
  return Object.values(enumObj).includes(val as T[keyof T])
    ? (val as T[keyof T])
    : undefined;
}
