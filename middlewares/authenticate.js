const {validateToken}=require('../services/authenticate')
function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      console.log("No token found in cookies");
      return next(); // Exit early if no token is found
    }
    try {
      const userPayload = validateToken(tokenCookieValue);
      // console.log("Decoded User Payload:", userPayload);
      req.user = userPayload; // Attach the user payload to the request object
    } catch (error) {
      console.error("Error decoding token:", error.message);
      // Optionally, you could clear the cookie or handle the error in some way:
      res.clearCookie(cookieName);
    }

    return next(); // Continue to the next middleware
  };
}

module.exports = {
  checkForAuthenticationCookie,
};
