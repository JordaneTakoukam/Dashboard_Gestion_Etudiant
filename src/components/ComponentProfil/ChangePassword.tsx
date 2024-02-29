import { useTranslation } from "react-i18next";
import { RiLockPasswordLine } from "react-icons/ri";

export function ChangePassword() {
    const {t}=useTranslation();
    return (
        <div className="col-span-5 xl:col-span-3 mt-4">

            <div className="max-h-[370px] rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
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
                                {t('label.actuel_pass')}
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
                                    placeholder="********"
                                />
                            </div>
                        </div>
                        <div className="mb-5.5">
                            <label
                                className="mb-3 block text-sm font-medium text-black dark:text-white"
                            >
                                {t('label.nouveau_pass')}
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
                                    placeholder="********"
                                />
                            </div>
                        </div>



                        <div className="flex justify-end gap-4.5 mt-8 ">
                            <button
                                className=" text-sm flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white hover:border-body duration-300 "
                                type="submit"
                            >
                               {t('boutton.effacer_champs')}
                            </button>
                            <button
                                className="text-sm flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1 hover:bg-opacity-70 duration-300 "
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

