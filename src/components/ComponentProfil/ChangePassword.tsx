import { useTranslation } from "react-i18next";
import { RiLockPasswordLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { useState } from "react";
import { apiUpdatePassword } from "../../api/auth/api_reset_password";
import createToast from "../../hooks/toastify";
import { validatePassword } from "../../fonctions/fonction";

export function ChangePassword() {
    const {t}=useTranslation();
    const userState:UserState = useSelector((state: RootState) => state.user);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const [currentPassword, setCurrentPassord]=useState('');
    const [newPassword, setNewPassord]=useState('');
    const [confirmPassword, setConfirmPassord]=useState('');
    const [errorCurrentPassword, setErrorCurrentPassword]=useState('')
    const [errorNewPassword, setErrorNewPassword]=useState('')
    const [errorConfirmPassword, setErrorConfirmPassword]=useState('')

    const handleClean = async () => {
        setNewPassord('');
        setCurrentPassord('')
        setConfirmPassord('')
        setErrorConfirmPassword('')
        setErrorCurrentPassword('')
        setErrorNewPassword('')
    }

    const handleUpdate = async () => {
        if(!currentPassword && !newPassword && !confirmPassword){
            if(!currentPassword){
                setErrorCurrentPassword(t('error.current_pass'))
            }
            if(!newPassword){
                setErrorNewPassword(t('error.new_pass'))
            }

            if(!confirmPassword){
                setErrorConfirmPassword(t('error.confirm_pass_field'))
            }
            return;
        }

        const notValidPassword = validatePassword(newPassword);
        if (notValidPassword) {
            setErrorConfirmPassword(t(notValidPassword));
            return;
        }

        if(confirmPassword!==newPassword){
            setErrorConfirmPassword(t('error.confirm_pass'));
            return;
        }

        await apiUpdatePassword({userId:userState._id, newPassword:newPassword}).then((e: ReponseApiPros) => {
            if (e.success) {
                createToast(e.message[lang as keyof typeof e.message], '', 0);
                handleClean();

            } else {
                createToast(e.message[lang as keyof typeof e.message], '', 2);
            }
        }).catch((e) => {
            createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);

        })
    }
    return (
        <div className="col-span-5 xl:col-span-3 mt-4">

            <div className="max-h-[525px] rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        {t('label.changer_pass')}
                    </h3>
                </div>
                <div className="p-7">
                    <form action="#">

                        <div className="mb-5.5">
                            <label
                                className="mb-3 block text-sm font-medium text-black dark:text-white"
                            >
                                {t('label.actuel_pass')}<label className="text-red-500"> *</label>
                            </label>
                            <div className="relative">
                                <span className="absolute left-4.5 top-4">
                                    <div className='text-[18px]'>
                                        <RiLockPasswordLine />
                                    </div>
                                </span>
                                <input
                                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) =>{setCurrentPassord(e.target.value); setErrorCurrentPassword("");} }
                                    placeholder="********"
                                />
                                {errorCurrentPassword && <p className="text-red-500">{errorCurrentPassword}</p>}
                            </div>
                        </div>
                        <div className="mb-5.5">
                            <label
                                className="mb-3 block text-sm font-medium text-black dark:text-white"
                            >
                                {t('label.nouveau_pass')}<label className="text-red-500"> *</label>
                            </label>
                            <div className="relative">
                                <span className="absolute left-4.5 top-4">
                                    <div className='text-[18px]'>
                                        <RiLockPasswordLine />
                                    </div>
                                </span>
                                <input
                                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) =>{setNewPassord(e.target.value); setErrorNewPassword("");} }
                                    placeholder="********"
                                />
                                {errorNewPassword && <p className="text-red-500">{errorNewPassword}</p>}
                            </div>
                        </div>
                        <div className="mb-5.5">
                            <label
                                className="mb-3 block text-sm font-medium text-black dark:text-white"
                            >
                                {t('label.confirm_pass')}<label className="text-red-500"> *</label>
                            </label>
                            <div className="relative">
                                <span className="absolute left-4.5 top-4">
                                    <div className='text-[18px]'>
                                        <RiLockPasswordLine />
                                    </div>
                                </span>
                                <input
                                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) =>{setConfirmPassord(e.target.value); setErrorConfirmPassword("");} }
                                    placeholder="********"
                                />
                                {errorConfirmPassword && <p className="text-red-500">{errorConfirmPassword}</p>}
                            </div>
                        </div>



                        <div className="flex justify-end gap-4.5 mt-8 ">
                            <button
                                className=" text-sm flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white hover:border-body duration-300 "
                                onClick={handleClean}
                            >
                               {t('boutton.effacer_champs')}
                            </button>
                            <button
                                className="text-sm flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1 hover:bg-opacity-70 duration-300 "
                                onClick={handleUpdate}
                            >
                                {t('boutton.modifier_mot_de_passe')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

