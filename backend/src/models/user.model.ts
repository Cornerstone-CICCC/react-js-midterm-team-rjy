import mongoose, {Document, Schema, Model} from "mongoose";
import bcrypt from "bcrypt";
export interface IUser extends Document {
    fullname: string;
    email: string;
    password: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
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