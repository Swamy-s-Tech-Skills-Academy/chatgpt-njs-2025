// pages/_app.js
import React from 'react'
import "@/styles/globals.css";
import { UserProvider } from '@auth0/nextjs-auth0/client';

const PageLayout = ({ Component, pageProps }) => {
    return (
        <UserProvider>
            <Component {...pageProps} />
        </UserProvider>
    );
};

export default PageLayout;
