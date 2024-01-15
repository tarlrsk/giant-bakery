import mongoose from "mongoose";

export const isObjectId = function (val: string) {
  if (!mongoose.isValidObjectId(val)) {
    return false;
  }
  return true;
};

export const GenerateObjectIdString = function () {
  return new mongoose.Types.ObjectId().toString();
};
