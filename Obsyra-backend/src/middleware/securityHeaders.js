const applySecurityHeaders = (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY'); 
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload'); 
    res.setHeader('X-XSS-Protection', '1; mode=block'); 
    res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade'); 
    next();
};

module.exports = { applySecurityHeaders };