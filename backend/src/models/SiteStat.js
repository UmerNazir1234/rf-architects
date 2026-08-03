import mongoose from 'mongoose';

const siteStatSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      enum: ['years', 'projectsLaunched', 'clientsSatisfied', 'projectsInProgress'],
      unique: true,
      required: [true, 'Key is required'],
    },
    value: {
      type: Number,
      required: [true, 'Value is required'],
      min: 0,
    },
    label: String,
    sublabel: String,
  },
  { timestamps: true }
);

export default mongoose.model('SiteStat', siteStatSchema);
