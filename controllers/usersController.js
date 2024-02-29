const model = require('../models/model');

exports.registerPage = function (request, response) {
    response.render("register");
};

exports.registerNewUser = function (request, response) {
    const userFromRequest = request.body;
    console.log(userFromRequest);
    const passManager = model.encodePass(userFromRequest.password);

    const user = new model.User({
        nickname: userFromRequest.nickname,
        password: passManager.password,
        salt: passManager.salt,
        firstName: userFromRequest.firstName,
        lastName: userFromRequest.lastName,
        dateOfBirthday: new Date(userFromRequest.dateOfBirthday),
        sex: userFromRequest.sex,
        country: userFromRequest.country,
        city: userFromRequest.city,
        someInfo: userFromRequest.someInfo
    });

    // if error -> send status 406(user nickname not unique)
    user.save().then(result => {
        response.send(model.getUserInfo(result));
    }).catch(err => {
        console.log(err);
        response.sendStatus(406);
    });
}

exports.authPage = function (request, response) {
    response.render("auth");
};

exports.authorizeUser = function (request, response) {
    const nicknameFromRequest = request.body.nickname;
    const passwordFromRequest = request.body.password;
    console.log("From request: " + {
        nickname: nicknameFromRequest,
        password: passwordFromRequest
    });

    // call if nickname or password incorrect
    function sendIncorrectDateError() {
        response.sendStatus(400);
    }

    model.User.findOne({nickname: nicknameFromRequest}).then(user => {
        if (user === null) {
            sendIncorrectDateError();
        } else {
            model.checkPass(passwordFromRequest, user) ?
                response.send(model.getUserInfo(user)) : sendIncorrectDateError();
        }
    });
};

exports.userProfile = function (request, response) {
    const userNickname = request.params['userNickname'];

    model.User.findOne({nickname: userNickname})
        .then(user => {
            const data = model.getUserInfo(user);
            console.log(data);
            response.render('profile', {
                user: data
            });
        })
        .catch(err => {
            response.sendStatus(404);
        });
};