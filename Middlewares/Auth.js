module.exports = (roles) => {
    return (req, res, next) => {
        if(req.session.userRoles){
            let userRoles = new Set(req.session.userRoles.split(' '));

            if(!roles || roles === ''){
                // no particullar role is needed
                next();
                return;
            }
            
            let reqRoles = new Set(roles.split(' '));
            for(let role of userRoles.values()){
                if(reqRoles.has(role)){
                    // one role matches
                    next();
                    return;
                }
            }
        }
        
        res.redirect('/Student/Login');
    };
};