import LeftSectionAuth from "./componants/LeftSectionAuth";
import MobileHead from "./componants/MobileHead";
import RightSectionResetPassword from "./componants/RightResetPassword";


const ResetPassword = () => {

    return (
        <>
            <div className='flex bg-white h-screen'>
                {/* gauche */}
                <div className='hidden lg:block bg-black w-1/2'>
                    <LeftSectionAuth />
                </div>


                {/* uniquement sur mobile : haut */}


                {/* Droite */}
                {/* Droite */}
                <div className='bg-white w-full lg:w-1/2 overflow-auto pb-20'>
                    {/* uniquement sur mobile : haut */}
                    <MobileHead />
                    <RightSectionResetPassword />
                </div>
            </div>
        </>
    );
};

export default ResetPassword;
