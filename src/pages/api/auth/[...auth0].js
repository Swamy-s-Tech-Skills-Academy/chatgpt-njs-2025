// pages/api/auth/[...auth0].js
import { handleAuth, handleLogin, handleLogout } from "@auth0/nextjs-auth0";

export default handleAuth({
    async login(req, res) {
        try {
            await handleLogin(req, res, {
                authorizationParams: {
                    screen_hint: req.query.signup === 'true' ? "signup" : undefined, // Conditional screen_hint
                },
                returnTo: "/chat", // Return to chat page after login
            });
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).end(error.message);
        }
    },

    logout: handleLogout({ returnTo: "/" }),

    onError(req, error) {
        console.error(error);
        return {
            redirect: {
                destination: '/error',
                permanent: false,
            },
        };
    },
});