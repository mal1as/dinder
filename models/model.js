const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

// constants
const DB_URL = process.env.MONGODB_URL //|| "mongodb://root:root@cluster0-shard-00-00.ksauv.mongodb.net:27017,cluster0-shard-00-01.ksauv.mongodb.net:27017,cluster0-shard-00-02.ksauv.mongodb.net:27017/dinder_app?ssl=true&replicaSet=atlas-ix4xyp-shard-0&authSource=admin&retryWrites=true&w=majority";
const DEFAULT_AVATAR = "http://res.cloudinary.com/misha140501/image/upload/c_fill,g_face,h_300,w_300/a5hhjue38o53ryfoenlr.jpg";

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('MongoDB Connected...');
    })
    .catch(err => console.log(err));

// schema for user
const userScheme = new Schema({
    nickname: {type: String, unique: true, required: true, minlength: 3, maxlength: 20},
    password: {type: String, required: true, length: 60},
    salt: {type: String, required: true},
    firstName: {type: String, required: true, minlength: 2, maxlength: 20},
    lastName: {type: String, required: true, minlength: 2, maxlength: 20},
    dateOfBirthday: {type: Date, required: true},
    sex: {type: String, enum: ['Male', 'Female'], required: true},
    country: {type: String, required: true, minlength: 2, maxlength: 20},
    city: {type: String, required: true, minlength: 2, maxlength: 20},
    someInfo: {type: String, required: true, minlength: 20, maxlength: 255},
    avatar: {type: String, default: DEFAULT_AVATAR},
    neededSex: {type: String, enum: ['Male', 'Female']},
    partnerDescription: {type: String, minlength: 20, maxlength: 255},
    instagram: String,
    facebook: String,
    twitter: String,
    telegram: String
});

// collection 'users'
exports.User = mongoose.model("User", userScheme);

// function for sending information to server
exports.getUserInfo = function (user) {
    return {
        nickname: user.nickname,
        firstName: user.firstName,
        lastName: user.lastName,
        age: this.findAgeByDateOfBirthday(user.dateOfBirthday),
        sex: user.sex,
        country: user.country,
        city: user.city,
        someInfo: user.someInfo,
        avatar: user.avatar,
        neededSex: user.neededSex,
        partnerDescription: user.partnerDescription,
        instagram: user.instagram,
        facebook: user.facebook,
        twitter: user.twitter,
        telegram: user.telegram
    }
};

// calculate age
exports.findAgeByDateOfBirthday = function (dateOfBirthday) {
    let now = new Date();
    let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let dateOfBirthdayNow = new Date(today.getFullYear(), dateOfBirthday.getMonth(), dateOfBirthday.getDate());
    let age = today.getFullYear() - dateOfBirthday.getFullYear();
    if (today < dateOfBirthdayNow) {
        age = age - 1;
    }
    return age;
};

// update user by nickname
exports.updateUser = function (nickname, user) {
    this.User.updateOne({nickname: nickname}, user)
        .then(result => console.log(`User ${nickname} was successfully updated to ${user}`))
        .catch(err => console.log("Error in updating: " + err));
};

// return object with salt and hashed password
exports.encodePass = function (pass) {
    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(pass, salt);
    return {
        salt: salt,
        password: hashPass
    };
};

// check correct password
exports.checkPass = function (passFromRequest, user) {
    const expectingPass = user.password;
    const actualPass = bcrypt.hashSync(passFromRequest, user.salt);
    return expectingPass === actualPass;
};