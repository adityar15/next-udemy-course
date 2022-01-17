import dynamic from "next/dynamic";

import Head from "next/head";

const Navbar = dynamic(() => import("../components/Navbar"));

export default function AuthLayout({ children, title }) {
  return (
    <>
      <div className="min-h-full">
        <Head>
          <link rel="icon" href="./logo.png" />
        </Head>
        <Navbar />

        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
 
            {children}
   
          </div>
        </main>
      </div>
    </>
  );
}
