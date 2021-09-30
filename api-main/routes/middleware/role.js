roles.use(function(req, act) {
    if (act === action) {
        return fn(req);
    }
});

roles.use('edit user', '/user/:userID', function(req) {
    if (req.params.userID === req.user.id) return true;
});