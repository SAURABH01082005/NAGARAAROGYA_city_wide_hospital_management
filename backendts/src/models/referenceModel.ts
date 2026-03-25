import mongoose, { Schema, model, models, Types,Model } from "mongoose";

interface IReference {
  hospitalId: string;
  docId: string;
  referToHospitalId: string;
  report: Types.ObjectId[];
  reason: string;
  date: Date;
}

const referenceSchema = new Schema<IReference>(
  {
    hospitalId: {
      type: String,
      required: true,
    },
    docId: {
      type: String,
      required: true,
    },
    referToHospitalId: {
      type: String,
      required: true,
    },
    report: [
      {
        type: Schema.Types.ObjectId,
        ref: "Report",
      },
    ],
    reason: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default:Date.now,
    },
  },
  { timestamps: true }
);

const Reference:Model<IReference> =
  models.Reference || model<IReference>("Reference", referenceSchema);

export default Reference;