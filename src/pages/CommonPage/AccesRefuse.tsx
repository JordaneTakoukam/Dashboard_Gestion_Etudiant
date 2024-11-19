import { useEffect } from "react";
import {useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { useNavigate } from "react-router-dom";


const AccessDenied = () => {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en    
    
        
    useEffect(() => {
        // Modifier le code d'état HTTP
        document.title = "401 - Unauthorized";
    }, []);

    return (
        <div className="h-screen w-screen bg-white flex items-center justify-center">
            <div className="text-center p-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">401 - Accès non autorisé</h1>
                <p className="text-lg text-gray-600">
                    Vous n'avez pas la permission d'accéder à cette page.
                </p>
            </div>
        </div>
    );
        
};

export default AccessDenied;

