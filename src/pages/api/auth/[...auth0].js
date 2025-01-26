// import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";

// export default handleAuth({
//     signup: handleLogin({ authorizationParams: { screen_hint: "signup" } }),
// });

// pages/api/auth/[...nextauth].js
import { handleAuth, handleLogin, handleLogout } from "@auth0/nextjs-auth0";

export default handleAuth({
    login: handleLogin({
        authorizationParams: {
            screen_hint: "signup",
        },
        returnTo: "/profile",
    }),

    signup: handleLogin({
        authorizationParams: {
            screen_hint: "signup",
        },
        returnTo: "/profile",
    }),

    logout: handleLogout({ returnTo: "/" }), // Redirect to home after logout

    onError(req, error) {
        console.error(error);
        return {
            redirect: {
                destination: '/error', // Redirect to an error page
                permanent: false,
            },
        };
    },
});