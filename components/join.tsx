"use client";

import Link from 'next/link';

import { Button } from "./ui/button";

const Join = () => {

    return (
        <div className="items-center justify-center text-center">
            <div className="text-7xl font-bold text-white pt-12">
                Join <span className="letter-color">Us.</span>
            </div>
            {/* <div className="text-3xl text-white pt-8">
                First identify yourself...
            </div> */}
            <div className="flex flex-col text-white gap-4 justify-center mt-16">
                <Link href="/officerdashboard">
                    <div>
                        <Button
                            className="text-xl text-black bg-white" 
                            variant="ghost">
                                I'm a PIB Officer
                        </Button>
                    </div>
                </Link>
                <Link href="/memberdashboard">
                    <div>
                        <Button 
                            className="text-xl text-black bg-white" 
                            variant="ghost">
                                I'm a PIB Member   
                        </Button>
                    </div>
                </Link>
            </div>
        </div>
    );
}
 
export default Join;
