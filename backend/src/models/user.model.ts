import mongoose, {Document, Schema, Model} from "mongoose";
import bcrypt from "bcrypt";
export interface IUser extends Document {
    fullname: string;
    email: string;
    password: string;
    address?: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
    role: string;
}

const UserSchema: Schema<IUser> = new Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    address: { type: String }
},{timestamps: true});

UserSchema.pre("save", async function (this: IUser) {
    if(!this.isModified("password")) return;
    const hashed = await bcrypt.hash(this.password, 12);
    this.password = hashed; 
});

UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);