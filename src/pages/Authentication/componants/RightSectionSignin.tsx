import { Link } from "react-router-dom";
import { ErrorInput, LabelInput } from "./Label"
import { useEffect, useState } from 'react';
import { isValidEmail, isValidPassword } from "../../../fonctions/fonction";
import { signInApi } from "../../../api/auth/api_signin";
import Input from "../../../components/ui/input";
import ButtonCustom from "../../../components/ui/button";
import Loading from "../../../components/ui/loading";

function RightSectionSigin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);

    // error
    const [error2, setError2] = useState('');
    const [error3, setError3] = useState('');

    let notValidEmail = '';
    let notValidPassword = '';

    const handleSubmit = async () => {
        setError2('');
        setError3('');



        if (!email) {
            setError2("L'email est requis");
        } else {
            notValidEmail = isValidEmail(email);
            if (notValidEmail) {
                setError2(notValidEmail);
            }
        }
        if (!password) {
            setError3("Le mot de passe est requis");
        } else {
            notValidPassword = isValidPassword(password);
            if (notValidPassword) {
                setError3(notValidPassword);
            }
        }


        // declencher 
        if (email && password && notValidEmail == "" && notValidPassword == "") {
            setLoading(true);
            const signUpResult = await signInApi({ email: email, mot_de_passe: password });

            if (signUpResult.success) {
                window.location.href = '/dashboard';
            }
            setLoading(false)
        }



    }


    useEffect(() => {
        setError2('')
    }, [email])
    useEffect(() => {
        setError3('')
    }, [password])


    return (
        <div>
            <div className="w-full h-full border-stroke dark:border-strokedark xl:border-l-2 overflow-auto mt-[4%]">
                <div className='card shadow-8 mx-6 lg:mx-[100px] m-0 lg:my-10 h-[80%]'>
                    <div className="flex flex-col items-center justify-center w-full p-2 sm:p-12.5 px-5 py-8 xl:px-10">

                        {/* titre */}
                        <h1 className="mb-9 text-lg lg:text-2xl font-bold text-black dark:text-white ">
                            Se connecter
                        </h1>

                        <div className="flex flex-col items-start w-full">


                            {/* email */}
                            <div className="mb-4 w-full ">
                                <LabelInput title='Email' />
                                <Input
                                    type="text"
                                    placeholder="Entrez votre adresse email"
                                    value={email}
                                    setValue={setEmail}
                                />
                                {(!email || !notValidEmail) && <ErrorInput title={error2} />}
                            </div>

                            {/* mot de passe */}
                            <div className="mb-4 w-full">
                                <LabelInput title='Mot de passe' />
                                <Input
                                    type="password"
                                    placeholder="Entrez un mot de passe"
                                    value={password}
                                    setValue={setPassword}
                                />
                                {(!password || !notValidPassword) && <ErrorInput title={error3} />}
                            </div>




                            {/* Bouton */}
                            <div className="mt-5 w-full">

                                {
                                    loading ? <Loading />

                                        :
                                        <ButtonCustom
                                            title={'Se connecter'}
                                            onClick={handleSubmit}
                                            next={true}
                                        />
                                }
                            </div>

                            <div className="mt-6 text-center text-[15px] flex justify-end items-end w-full mb-[6%]">
                                <Link to="/reset-password" className="text-primary font-medium">
                                    Mot de passe oublier
                                </Link>
                            </div>
                            {/*  rediriger vers se connecter */}
                          

                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default RightSectionSigin