import  {Schema, model} from "mongoose";

const userCollection = "users";

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
      type: String,
      required: true
  },
  email: {
      type: String,
      required: true,
      unique: true
  },
  age: {
      type: Number,
      required: true
  },
  password: {
      type: String,
      required: true
  }
});

userSchema.pre('find', function(){
   this.populate('users')
})

const userModel = model(userCollection, userSchema);

export default userModel ;