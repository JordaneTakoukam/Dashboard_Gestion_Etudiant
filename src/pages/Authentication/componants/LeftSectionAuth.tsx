import { FaRegCopyright } from 'react-icons/fa';
import { FaFacebook } from 'react-icons/fa';
import { FaTwitter } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';

import { config } from '../../../config'
import LogoPng from "./../../../images/logo/logo.png";
import { Link } from 'react-router-dom';


function LeftSectionAuth() {
    return (
        <div className="flex flex-col justify-start items-start h-screen w-full">
            <div className='mx-30'>
                {/* entete */}
                <div className='flex items-center justify-start gap-x-5 mt-[10%]'>
                    <Link
                        to={'/signin'}
                        className="md:h-[50px] md:w-[50px]">
                        <img src={LogoPng} alt="logo" />
                    </Link>
                    <div className='flex flex-col items-start justify-center'>
                        <p className="text-4xl  font-normal text-white mt-0.5">
                            {config.nameApp}
                        </p>
                        {/* <a
                            href={config.companyUrl}
                            className="text-[12px]  font-normal hover:underline text-secondary hover:text-primary">
                            Par {config.companyName}
                        </a> */}
                    </div>
                </div>

                {/* body */}
                <div className='mt-[40%]'>
                    <h1 className='text-white font-normal text-4xl w-[400px]'>
                        Content de vous revoir
                    </h1>
                    <p className='text-md text-white pt-4'>
                        Connectez-vous à votre compte.
                    </p>
                </div>
            </div>

            <div className='flex mt-[33%] items-center justify-between w-full px-20'>


                <div className='flex'>
                    <div className='flex items-center justify-center'>
                        <div className='text-[10px] pr-1 '>
                            <FaRegCopyright />
                        </div>
                        <p className='text-[12px]'>{config.copyRight}, All Rights Reserved.</p>
                    </div>
                    <p className='text-[12px] ml-2'>Version <span className=''>{config.version}</span></p>

                </div>

                <div className='flex gap-x-5 pr-5 text-xl'>
                    <a className='hover:text-primary' href={config.facebook}>
                        <FaFacebook />
                    </a>
                    <a className='hover:text-primary' href={config.twitter}>
                        <FaTwitter />
                    </a>
                    <a className='hover:text-primary' href={config.instagram}>
                        <FaInstagram />
                    </a>
                </div>


            </div>


            {/* footer */}
        </div>
    )
}

export default LeftSectionAuth

