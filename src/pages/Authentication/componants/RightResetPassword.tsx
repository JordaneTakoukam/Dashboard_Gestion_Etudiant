import { ErrorInput, LabelInput } from "./Label"
import { useEffect, useState } from 'react';
import { isValidEmail } from "../../../fonctions/fonction";
import Input from "../../../components/ui/input";
import Loading from "../../../components/ui/loading";
import ButtonCustom from "../../../components/ui/button";

function RightSectionResetPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    // error
    const [error2, setError2] = useState('');

    let notValidEmail = '';

    const handleSubmit = () => {

        if (!email) {
            setError2("L'email est requis")
        }


        // 
        if (!email) {
            setError2("L'email est requis");
        } else {
            notValidEmail = isValidEmail(email);
            if (notValidEmail) {
                setError2(notValidEmail);
            }
        }

        // declencher 
        if (email && notValidEmail == "") {
            setLoading(true)

            //
        }



    }


    useEffect(() => {
        setError2('')
    }, [email])


    // const handleSubmit = async () => {

    //     // if (email && password) {
    //     setLoading(true);

    //     const signInResult = await signinApi({ email: email, password: password });

    //     if (signInResult.success) {
    //         window.location.href = '/';
    //         createToast(signInResult.message, "", 0);

    //     }

    //     // if (signInResult.success) {
    //     // createToast(signInResult.message, "", 0);
    //     // window.location.href = '/';


    //     // } else {
    //     //   createToast(signInResult.message, "", 2);
    //     // }
    //     setLoading(false);

    //     // } else {
    //     //   alert("Veuillez renseigner tous les champs!")
    //     // }


    // };
    return (
        <div>
            <div className="w-full h-full border-stroke dark:border-strokedark xl:border-l-2 overflow-auto mt-[15%]">
                <div className='card shadow-8 mx-6 lg:mx-[100px] m-0 lg:my-10 h-[80%]'>
                    <div className="flex flex-col items-center justify-center w-full p-2 sm:p-12.5 px-5 py-8 xl:px-10">

                        {/* titre */}
                        <h1 className="mb-9 text-lg lg:text-2xl font-bold text-black dark:text-white ">
                            Réinitialiser le mot de passe
                        </h1>

                        <div className="flex flex-col items-start w-full">


                            {/* email */}
                            <div className="mb-4 w-full ">
                                <LabelInput title='Email' />
                                <Input
                                    type="text"
                                    placeholder="Entrez l'adresse mail associer à votre compte"
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
                                            title={'Recoir un nouveau mot de passe'}
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