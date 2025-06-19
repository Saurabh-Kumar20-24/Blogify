const requireAuth = (req, res, next) =>{
    console.log("requireAuth triggered. Session:", req.session);
    if(!req.session.userId){
        console.log("Not authenticated. Redirecting to login."); 
       return res.redirect('/login')
    }
    next()
}

const checkAuth = (req, res, next) =>{
    
    res.locals.isAuthenticated = req.session.userId ? true : false
    next()
}

module.exports = {
    requireAuth,
    checkAuth
}
