export const parseBoolean = function (value: string): boolean {
  switch (value.toLowerCase()) {
    case "true":
      return true;
      break;

    case "false":
      return false;
      break;

    default:
      return true;
      break;
  }
};
