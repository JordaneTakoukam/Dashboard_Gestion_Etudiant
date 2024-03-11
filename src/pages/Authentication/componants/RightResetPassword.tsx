import { ErrorInput, LabelInput } from "./Label"
import { useEffect, useState } from 'react';
import Input from "../../../components/ui/input";
import Loading from "../../../components/ui/loading";
import ButtonCustom from "../../../components/ui/button";
import { useTranslation } from 'react-i18next';
import { validateEmail } from "../../../fonctions/fonction";


function RightSectionResetPassword() {
    const { t } = useTranslation();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    // error
    const [error2, setError2] = useState('');

    let notValidEmail = '';

    const handleSubmit = () => {

        notValidEmail = validateEmail(email);
        if (notValidEmail) {
            setError2(t(notValidEmail));
        }

        // declencher 
        if (notValidEmail == "") {
            setLoading(true)

            //
        }



    }


    useEffect(() => {
        setError2('')
    }, [email])


    return (
        <div>
            <div className="w-full h-full border-stroke dark:border-strokedark xl:border-l-2 overflow-auto mt-[15%]">
                <div className='card shadow-8 mx-6 lg:mx-[100px] m-0 lg:my-10 h-[80%]'>
                    <div className="flex flex-col items-center justify-center w-full p-2 sm:p-12.5 px-5 py-8 xl:px-10">

                        {/* titre */}
                        <h1 className="mb-9 text-lg lg:text-2xl font-bold text-black dark:text-white ">
                            {t('boutton.reinit_pass')}
                        </h1>

                        <div className="flex flex-col items-start w-full">


                            {/* email */}
                            <div className="mb-4 w-full ">
                                <LabelInput title={t('label.email')} />
                                <Input
                                    type="text"
                                    placeholder={t('label.entree_email')}
                                    value={email}
                                    setValue={setEmail}
                                />
                                {(!email || !notValidEmail) && <ErrorInput title={error2} />}
                            </div>




                            {/* Bouton */}
                            <div className="w-full  mt-5">

                                {
                                    loading ? <Loading />

                                        :
                                        <ButtonCustom
                                            title={t('boutton.recevoir_un_nouveau_mdp')}
                                            onClick={handleSubmit}
                                            next={true}
                                        />
                                }
                            </div>




                        </div>

                    </div>
                </div>
            </div>
        </div >
    )
}

export default RightSectionResetPassword