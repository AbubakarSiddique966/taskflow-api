
import mongoose, { Schema, Document } from "mongoose";

interface IProject extends Document {
    title: string;
    description: string;
    owner: mongoose.Types.ObjectId;
    status: "active" | "completed" | "on-hold";
}

const projectSchema = new Schema<IProject>(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: ["active", "completed", "on-hold"],
            default: "active"
        }
    },
    {
        timestamps: true
    }
);

const projectModel = mongoose.model<IProject>(
    "Project",
    projectSchema
);

export default projectModel;
