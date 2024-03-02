import { Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import LogoPng from "./../../images/logo/logo.png";

import { signinApi } from '../../api/auth/api_signin';
import createToast from '../../hooks/toastify';
import { config } from '../../config';
import { FaRegCopyright } from "react-icons/fa6";
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setShowLanguage } from '../../_redux/features/setting_slice';
import { RootState } from '../../_redux/store';


const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('lang')?.toString() ?? 'fr');
  const dispatch = useDispatch();
  const language = useSelector((state: RootState) => state.setting.language);
  useEffect(() => {
    i18next.changeLanguage(language);
  }, [language]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);
    localStorage.setItem('lang', newLanguage);
    dispatch(setShowLanguage(newLanguage));
  };

  const handleSubmit = async () => {

    // if (email && password) {
    setLoading(true);

    const signInResult = await signinApi({ email: email, password: password });

    if (signInResult.success) {
      window.location.href = '/';
      createToast(signInResult.message, "", 0);

    }

    // if (signInResult.success) {
    // createToast(signInResult.message, "", 0);
    // window.location.href = '/';


    // } else {
    //   createToast(signInResult.message, "", 2);
    // }
    setLoading(false);

    // } else {
    //   alert("Veuillez renseigner tous les champs!")
    // }


  };


  return (
    <>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark h-screen overflow-hidden">
        <div className="flex flex-wrap items-center h-screen px-10 lg:px-35">
          <div className="hidden w-full xl:block xl:w-1/2 mt">
            <div className="py-17.5 px-26 text-center">

              <div className='h-20 w-50'>
                <p className="mt-5 text-lg ">
                  {t('label.content')}
                </p>
              </div>

              <div className="md:h-[200px] md:w-[200px]">
                <img src={LogoPng} alt="logo" />
              </div>
              <div className='h-20 w-50'>
                <p className="mt-8 text-2xl  font-bold text-boxdark-2 ">
                  {config.nameApp}
                </p>

                {/* copy ritght */}
                <div className='w-full flex flex-col justify-center items-center -ml-4 mt-15 mb-5 text-body'>
                  <div className='flex items-center'>
                    <div className='text-[10px]  pr-1 '>
                      <FaRegCopyright />
                    </div>
                    <p className='text-[12px]'>{config.copyRight}</p>

                  </div>

                  <p className='text-[13px] ml-2'>Version <span className='font-semibold'>{config.version}</span></p>

                </div>
              </div>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="lang-selector ">
              {/* <label htmlFor="lang">{t('header.langue')}</label> */}
              <select id="lang" value={selectedLanguage} onChange={handleLanguageChange}>
                <option value="fr">{t('header.francais')}</option>
                <option value="en">{t('header.anglais')}</option>
              </select>
            </div>
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                {t('label.se_connecter')}
              </h2>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  {t('label.email')}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder={t('label.entree_email')}
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <span className="absolute right-4 top-4">
                    <div className='text-md lg:text-[22px]'>
                      <IoMdMail />
                    </div>
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  {t('label.mot_de_passe')}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('label.entree_pass')}
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    className="absolute right-4 top-4 cursor-pointer text-md lg:text-[22px]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {!showPassword ? (
                      <div>
                        <FaEye />

                      </div>
                    ) : <div><FaEyeSlash />
                    </div>
                    }</span>
                </div>
              </div>



              <div className="my-5 mt-10">

                {
                  loading ? <div className='flex items-center justify-center h-[60px]'>
                    <div className={`flex items-center justify-center  bg-transparent'}`}>
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                    </div>

                  </div>
                    :
                    <button
                      className="h-[60px] w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                      onClick={handleSubmit}

                    >{t('boutton.se_connecter')} </button>
                }
              </div>



              <div className="mt-6 text-center">
                <p>
                  {t('boutton.oublie_pass')}{' '}
                  <Link to="?" className="text-primary font-medium">
                    {t('boutton.reinit_pass')}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
