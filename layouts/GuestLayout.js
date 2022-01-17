import Navbar from '../components/Navbar/index';
import Head from 'next/head'




export default function GuestLayout({children, title=""}) {
    return (
        <div className="w-full h-full">
            <Head>
                <link rel="icon" href="./logo.png" />
            </Head>
           <Navbar /> 
           <div className="p-6">
            {children} 
           </div>
        </div>
    )
}
