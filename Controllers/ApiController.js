const db = require('../Models/DromDb');

module.exports = {
    postLogin: async (req, res) => {
        // console.log(req.body.name, req.body.pass);

        let userData = await db.validLogin(req.body.name, req.body.pass);
        // console.log(userData);

        if(userData){
            req.session.regenerate(err => {
                if(err) next(err);

                req.session.userRoles = userData.userRoles;
                req.session.userId = userData.userId;
                req.session.userName = userData.userName;
                
                req.session.save(err => {
                    if(err) next(err);
                    let roles = new Set(req.session.userRoles.split(' '));
                    if(roles.has('Admin')){
                        res.redirect('/Admin/Dorm');
                    }else if(roles.has('DormAdmin')){
                        res.redirect('/DormAdmin/Announcement');
                    }else{
                        res.redirect('/Student/Announcement');
                    }
                });
            });
        }else{
            res.send('<script> alert("Login Failed!"); window.location = "/"; </script>');
        }
    },

    getLogout: async (req, res) => {
        req.session.userRoles = null;
        req.session.userId = null;
        req.session.userName = null;
        req.session.save(err => {
            if(err) next(err);

            req.session.regenerate(err => {
                if(err) next(err);
                res.redirect('/');
            });
        });
    },
};