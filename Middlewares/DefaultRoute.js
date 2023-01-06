module.exports = (url)=>{
    return (req, res, next) => {
        if(req.url == "/"){
            req.url = url;
        }
        next();
    }
};