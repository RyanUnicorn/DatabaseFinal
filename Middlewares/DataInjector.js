module.exports = (req, res, next)=>{

    if(req.session.userRoles){
        req.userData = {
            roles: new Set(req.session.userRoles.split(' ')),
            id: req.session.userId,
            name: req.session.userName,
        };
    }else{
        req.userData = null;
    }

    res.renderInjected = (view, data, callback) => {
        res.render(view, {
            userData: req.userData,

            ...data,
        }, callback);
    };

    next();
};