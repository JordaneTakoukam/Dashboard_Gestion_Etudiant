import { Link } from "react-router-dom";
import Input from "../../../components/Input/input"
import { ErrorInput, LabelInput } from "./Label"
import { useEffect, useState } from 'react';
import ButtonCustom from "../../../components/Button/ButtonCustom";
import { isValidEmail, isValidPassword, samePassword } from "../../../fonctions/fonction";
import Loading from "../../../components/Animation/Loading";
import { signupApi } from "../../../api/auth/api_signup";

function RightSectionSignup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // error
    const [error1, setError1] = useState('');
    const [error2, setError2] = useState('');
    const [error3, setError3] = useState('');
    const [error4, setError4] = useState('');

    var notValidEmail = ''
    var notValidPassword = ''
    var samePass = ''
    const handleSubmit = async () => {
        // Réinitialiser tous les messages d'erreur
        setError1('');
        setError2('');
        setError3('');
        setError4('');

        let notValidEmail = '';
        let notValidPassword = '';
        let samePass = '';

        // Vérifier les champs vides
        if (!username) {
            setError1('Le nom et le prénom sont requis');
        }
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

        if (!confirmPassword) {
            setError4("Vous devez confirmer le mot de passe");
        } else {
            samePass = samePassword(password, confirmPassword);
            if (samePass) {
                setError4(samePass);
            }
        }

        // Vérifier si toutes les conditions sont remplies avant de soumettre
        if (username && email && password && confirmPassword && !notValidEmail && !notValidPassword && !samePass) {
            setLoading(true);
            const signUpResult = await signupApi({ email: email, nom_et_prenom: username, mot_de_passe: password });

            if (signUpResult.success) {
                window.location.href = '/dashboard';
            }
            setLoading(false)
        }
    }



    useEffect(() => {
        setError1('')
    }, [username])
    useEffect(() => {
        setError2('')
    }, [email])
    useEffect(() => {
        setError3('')
    }, [password])
    useEffect(() => {
        setError4('')
    }, [confirmPassword])

    // const handleSubmit = async () => {

    //     // if (email && password) {
    //     setLoading(true);

    // const signInResult = await signinApi({ email: email, password: password });

    //     if (signInResult.success) {
    //         window.location.href = '/';
    //         createToast(signInResult.message, "", 0);

    //     }

    // // if (signInResult.success) {
    // // createToast(signInResult.message, "", 0);
    // // window.location.href = '/';


    // // } else {
    // //   createToast(signInResult.message, "", 2);
    // // }
    // setLoading(false);

    //     // } else {
    //     //   alert("Veuillez renseigner tous les champs!")
    //     // }


    // };
    return (
        <div>
            <div className="w-full h-full border-stroke dark:border-strokedark xl:border-l-2 overflow-auto">
                <div className='card shadow-8 mx-6 lg:mx-[100px] m-0 lg:my-10 h-[90%]'>
                    <div className="flex flex-col items-center justify-center w-full p-2 sm:p-12.5 px-5 py-8 xl:px-10">

                        {/* titre */}
                        <h1 className="mb-9 text-lg lg:text-2xl font-bold text-black dark:text-white ">
                            S'inscrire
                        </h1>

                        <div className="flex flex-col items-start w-full">
                            {/* nom et prenom */}
                            <div className="mb-4 w-full">
                                <LabelInput title='Nom et prénom' />
                                <Input
                                    type="text"
                                    placeholder="Entrez votre nom et prénom"
                                    value={username}
                                    setValue={setUsername}
                                />
                                {!username && <ErrorInput title={error1} />}
                            </div>

                            {/* email */}
                            <div className="mb-4 w-full">
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

                            {/* confirmer le mot de passe */}
                            <div className="mb-4 w-full">
                                <LabelInput title='Confirmer le mot de passe' />
                                <Input
                                    type="password"
                                    placeholder="Confirmer votre mot de passe"
                                    value={confirmPassword}
                                    setValue={setConfirmPassword}
                                />
                                {(!confirmPassword || !samePass) && <ErrorInput title={error4} />}
                            </div>



                            {/* Bouton */}
                            <div className="my-5 mt-5 w-full">
                                {
                                    loading ?
                                        <Loading /> :
                                        <ButtonCustom
                                            title={"S'inscrire"}
                                            onClick={handleSubmit}
                                            next={true}
                                        />
                                }
                            </div>


                            {/*  rediriger vers se connecter */}
                            <div className="mt-6 w-full flex justify-center text-md">
                                <p>
                                    Vous avez déja un compte ?{' '}
                                    <Link to="/signin" className="text-primary font-medium">
                                        Se connecter
                                    </Link>
                                </p>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div >
    )
}

export default RightSectionSignup