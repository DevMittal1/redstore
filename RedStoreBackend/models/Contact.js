import mongoose from "mongoose";

const contactDetailsSchema = mongoose.Schema({
    name:String,
    email:String,
    phone:String,
    message:String,
    messageDate: {
        type: String,
        default: () => new Date().toISOString()
    }
});
const ContactDetail = new mongoose.model("ContactDetail",contactDetailsSchema);
export default ContactDetail;