import Head from "next/head";
import Link from "next/link";
import { useUser } from '@auth0/nextjs-auth0/client';
import { getSession } from "@auth0/nextjs-auth0";

export default function Home() {

    const { isLoading, error, user } = useUser();

    if (isLoading) return <div>Loading...</div>;

    if (error) return <div>{error.message}</div>;

    return (
        <>
            <Head>
                <title>ChatGPT - Login or Sign Up</title>
            </Head>
            <div className="flex justify-center items-center min-h-screen w-full bg-gray-800 text-white text-center">
                <div>
                    {user ? (
                        <div className='bg-gray-600 shadow-md rounded-md p-10 m-5'>
                            <Link href="/api/auth/logout" className="rounded-md bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600">Logout</Link>
                        </div>
                    ) : (
                        <>
                            <Link href="/api/auth/login" className="btn">Login</Link>
                            <Link href="/api/auth/signup" className="btn">Signup</Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export const getServerSideProps = async (ctx) => {
    const session = await getSession(ctx.req, ctx.res);

    if (!!session) {
        return {
            redirect: {
                destination: "/chat",
            },
        };
    }

    return {
        props: {},
    };
};
