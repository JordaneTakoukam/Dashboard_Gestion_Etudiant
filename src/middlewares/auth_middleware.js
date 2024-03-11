import { useJwt } from "react-jwt";
import { config } from "./../config.js";
const isUserAuthenticated = () => {
    const token = localStorage.getItem(config.jwt_key);

    if (token) {
        try {
            const { decodedToken, isExpired } = useJwt(token);

            if (!isExpired) {
                return {
                    value: decodedToken,
                    status: true,
                };
            } else {
                console.warn("JWT is expired");
                // window.location.replace('/auth/signin');
                return {
                    value: "Votre séssion à expirer, reconnecter vous!",
                    status: false,
                };
            }
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                console.warn("JWT is expired.");
            } else {
                console.error("Error decoding the token:", error.message);
            }
            return {
                value: "Votre séssion à expirer, reconnecter vous!",
                status: false,
            };
        }
    } else {
        return {
            value: null,
            status: false,
        };
    }
};


const storeTokenInLocalStorage = (token) => {
    try {
        localStorage.setItem(config.jwt_key, token);
        // console.log("Token stocké avec succès dans le localStorage.");
    } catch (error) {
        // console.error("Erreur lors du stockage du token dans le localStorage :", error);
    }
};

export { isUserAuthenticated, storeTokenInLocalStorage };