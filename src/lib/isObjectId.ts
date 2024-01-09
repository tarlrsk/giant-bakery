import mongoose from "mongoose";

export const isObjectId = function (val: string) {
  if (!mongoose.isValidObjectId(val)) {
    return false;
  }
  return true;
};
