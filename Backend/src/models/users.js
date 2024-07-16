import mongoose from "mongoose";

const schema = mongoose.Schema(
    {
        userName: { type: String, default: null, },
        password: { type: String, default: null, },
        status: { type: Boolean, default: null, },
        loginAttemptCount: { type: Number, default: 0 },
        deletedAt: { type: Date, default: null },
        userIsBlock: { type: Boolean, default: false },
        userToken: { type: String, default: null, },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("app_users", schema);
