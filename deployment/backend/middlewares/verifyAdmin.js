const verifyAdmin = (req, res, next) => {
    console.log('TXSD223 ');
    console.log(JSON.stringify(req.decoded.user.isAdmin));

    if (req.decoded.user.isAdmin) {
        console.log('TXSD4444 ');
        console.log(JSON.stringify(req.decoded));

        next();
    } else {
        res.status(401).send('You are not an administrator');
        console.log('TXSD393 ');
        console.log(JSON.stringify(req.decoded.user));
    }
};

module.exports = verifyAdmin;