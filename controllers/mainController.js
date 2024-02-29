const model = require('../models/model');
const fs = require('fs');
const multiparty = require('multiparty');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: "misha140501",
    api_key: "798352692683958",
    api_secret: "OZImwSvHGPxCyQijMpQlZVMJNhg"
});

// todo
exports.about = function (request, response) {
    response.send("Information about site and authors");
};

exports.mainPage = function (request, response) {
    const nickname = request.query.nickname;

    model.User.findOne({nickname: nickname}).then((result) => {
        model.User.find()
            .then(data => {
                let docs = data.map(item => model.getUserInfo(item));

                // handler undefined or null nickname param
                // send just unsorted data
                if (nickname === undefined || nickname === 'null') {
                    response.render("index", {
                        users: docs
                    });
                } else {
                    // sort data
                    const user = model.getUserInfo(result);

                    // delete yourself from variants
                    docs = docs.filter(item => item.nickname !== user.nickname);
                    docs.sort(function (a, b) {
                        // function for sorting
                        // params for compare
                        const neededSex = user.neededSex;
                        const city = user.city;
                        const age = user.age;

                        // firstly check needSex parameter
                        // secondly check city
                        // finally check age difference
                        if (a.sex === neededSex && b.sex === neededSex || a.sex !== neededSex && b.sex !== neededSex) {
                            if (a.city === city && b.city === city || a.city !== city && b.city !== city) {
                                const ageDifA = Math.abs(age - a.age);
                                const ageDifB = Math.abs(age - b.age);
                                return ageDifA < ageDifB ? -1 : 1;
                            } else if (a.city === city) {
                                return -1;
                            } else return 1;
                        } else if (a.sex === neededSex) {
                            return -1;
                        } else return 1;
                    });

                    // send sorted data
                    response.render("index", {
                        users: docs
                    });
                }
            }).catch(err => {
            // handler db error
            response.sendStatus(404);
        });
    });
};

exports.myProfile = function (request, response) {
    response.render("myProfile");
};

exports.editProfile = function (request, response) {
    response.render("editProfile");
};

exports.updateProfile = function (request, response) {
    const userForUpdate = request.body;
    const nickname = request.query.nickname;
    console.log(userForUpdate);
    model.updateUser(nickname, userForUpdate);
    response.send(userForUpdate);
};

exports.uploadAvatar = function (request, response) {
    let form = new multiparty.Form();
    let uploadFile = {uploadPath: '', type: '', size: 0};
    let supportTypes = ['image/jpg', 'image/jpeg', 'image/png'];
    let maxSize = 10 * 1024 * 1024; //10MB
    let errors = [];
    let nickname = request.query.nickname;

    // if file already exists remove this file
    form.on('error', function (err) {
        if (fs.existsSync(uploadFile.path)) {
            fs.unlinkSync(uploadFile.path);
            console.log('error');
        }
    });

    // send response
    form.on('close', function () {
        if (errors.length === 0) {
            cloudinary.uploader.upload(uploadFile.path, function (err, res) {
                if(err) {
                    console.log(err);
                } else {
                    const imageName = res.public_id+"."+res.format;
                    const avatarUrl = cloudinary.url(imageName, {width: 300, height:300, crop: "fill", gravity: "face"});
                    model.updateUser(nickname, {avatar: avatarUrl});
                    response.send({status: 'ok', text: 'Success', newAvatar: avatarUrl});
                    console.log(avatarUrl);
                }
            });
        } else {
            if (fs.existsSync(uploadFile.path)) {
                fs.unlinkSync(uploadFile.path);
            }
            response.send({status: 'bad', errors: errors});
        }
    });

    form.on('part', function (part) {
        uploadFile.size = part.byteCount;
        uploadFile.type = part.headers['content-type'];
        uploadFile.path = './public/images/avatars/' + part.filename;

        // change name to nickname.(jpg|png) format
        //uploadFile.path = uploadFile.path.replace(/\/\w+\.(\w+)$/, `/${nickname}.$1`);
        //fileType = uploadFile.path.match(/\.(\w+)$/);

        // if size bigger than max size
        if (uploadFile.size > maxSize) {
            errors.push('File size is ' + uploadFile.size + '. Limit is' + (maxSize / 1024 / 1024) + 'MB.');
        }

        // if type isn't supported
        if (supportTypes.indexOf(uploadFile.type) === -1) {
            errors.push('Unsupported type ' + uploadFile.type);
        }

        if (errors.length === 0) {
            let out = fs.createWriteStream(uploadFile.path);
            part.pipe(out);
        } else {
            part.resume();
        }
    });

    form.parse(request);
};