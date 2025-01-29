// pages/error.js

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function ErrorPage({ statusCode }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <Head>
                <title>{statusCode} - Error</title>
            </Head>

            <h1 className="text-4xl font-bold mb-4">An error occurred</h1>
            <p className="text-lg mb-6">
                {statusCode === 404
                    ? 'The page you are looking for was not found.'
                    : 'Something went wrong.'}
            </p>

            <Link href="/">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Go Back Home
                </button>
            </Link>
        </div>
    );
}