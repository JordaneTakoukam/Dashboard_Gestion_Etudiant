import LanguageToogle from "../../components/ui/language_toggle";
import LeftSectionAuth from "./componants/LeftSectionAuth";
import MobileHead from "./componants/MobileHead";
import RightSectionSigin from "./componants/RightSectionSignin";


const SignIn = () => {

  return (
    <>
      <div className='flex bg-white h-screen'>
        {/* gauche */}
        <div className='hidden lg:block bg-black w-1/2'>
          <LeftSectionAuth />
        </div>


        {/* uniquement sur mobile : haut */}


        {/* Droite */}
        <div className='bg-white h-screen w-full lg:w-1/2 overflow-auto'>
          {/* uniquement sur mobile : haut */}
          <LanguageToogle />
          <MobileHead />
          <RightSectionSigin />
        </div>
      </div>
    </>
  );
};

export default SignIn;
