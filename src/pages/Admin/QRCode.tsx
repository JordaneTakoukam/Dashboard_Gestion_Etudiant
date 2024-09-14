import React, { useState } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { t } from 'i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../_redux/store';
import { formatYear } from '../../fonctions/fonction';
import { semestres } from '../CommonPage/EmploiDeTemp';
import { useTranslation } from 'react-i18next';
import jsPDF from 'jspdf';
import { apiGenerateQrCode } from '../../api/api_qr_code';
import createToast from '../../hooks/toastify';

const QRCodeGenerator = () => {
    const niveaux: NiveauProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const cycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections: SectionProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023; 
    const currentSemester = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const { t } = useTranslation();

    const [section, setSection] = useState<SectionProps>();
    const [cycle, setCycle] = useState<CycleProps>();
    const [niveau, setNiveau] = useState<NiveauProps>();
    const [semestre, setSemestre] = useState(currentSemester);
    const [annee, setAnnee] = useState(currentYear);
    const [filteredCycle, setFilteredCycle] = useState<CycleProps[] | undefined>([]);
    const [filteredNiveau, setFilteredNiveau] = useState<NiveauProps[] | undefined>([]);
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const [errorSection, setErrorSection] = useState("");
    const [errorCycle, setErrorCycle] = useState("");
    const [errorNiveau, setErrorNiveau] = useState("");
    const [errorSemestre, setErrorSemestre] = useState("");

    const filterCycleBySection = (sectionId: string | undefined) => {
        if (sectionId && sectionId !== '') {
            const result: CycleProps[] = cycles.filter(cycle => "" + cycle.section === sectionId);
            setFilteredCycle(result);
        }
    };

    const filterNiveauByCycle = (cycleId: string | undefined) => {
        if (cycleId && cycleId !== '') {
            const result: NiveauProps[] = niveaux.filter(niveau => "" + niveau.cycle === cycleId);
            setFilteredNiveau(result);
        }
    };

    const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSectionLibelle = e.target.value;
        let selectedSection = null;

        if (lang === 'fr') {
            selectedSection = sections.find(section => section.libelleFr === selectedSectionLibelle);
        } else {
            selectedSection = sections.find(section => section.libelleEn === selectedSectionLibelle);
        }

        if (selectedSection) {
            setSection(selectedSection);
            filterCycleBySection(selectedSection._id);
            setErrorSection("");
        }
    };

    const handleCycleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCycleLibelle = e.target.value;
        let selectedCycle = null;

        if (lang === 'fr') {
            selectedCycle = cycles.find(cycle => cycle.libelleFr === selectedCycleLibelle);
        } else {
            selectedCycle = cycles.find(cycle => cycle.libelleEn === selectedCycleLibelle);
        }

        if (selectedCycle) {
            setCycle(selectedCycle);
            filterNiveauByCycle(selectedCycle._id);
            setErrorCycle("");
        }
    };

    const handleNiveauChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedNiveauLibelle = e.target.value;
        let selectedNiveau = null;

        if (lang === 'fr') {
            selectedNiveau = filteredNiveau && filteredNiveau.find(niveau => niveau.libelleFr === selectedNiveauLibelle);
        } else {
            selectedNiveau = filteredNiveau && filteredNiveau.find(niveau => niveau.libelleEn === selectedNiveauLibelle);
        }

        if (selectedNiveau) {
            setNiveau(selectedNiveau);
            setErrorNiveau("");
        }
    };

    const handleSemestreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSemestre(parseInt(event.target.value));
        setErrorSemestre("");
    };

    const handleGenerateQR = async () => {
        setLoading(true);
        try {
            if (!section || !cycle || !niveau ||  !semestre ) {
                if (!section) setErrorSection(t('error.section'));
                if (!cycle) setErrorCycle(t('error.cycle'));
                if (!niveau) setErrorNiveau(t('error.niveau'));
                if (!semestre) setErrorSemestre(t('error.semestre'));
                return;
            }
            

            await apiGenerateQrCode({annee,semestre, section, cycle, niveau}).then((e)=>{
                if(e.success){
                    setQrCodeDataUrl(e.qrCode);
                } else {
                    createToast(e.message[lang as keyof typeof e.message], '', 2);
                }
            }).catch((e) => {
                createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
            })
        } catch (e) {
            createToast(t('message.erreur'), '', 2);
        } finally {
            setLoading(false);
        }
    };

    const downloadQRAsPDF = () => {
        const doc = new jsPDF();
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = doc.internal.pageSize.getHeight();
        const imgWidth = 160;
        const imgHeight = 160;
        const x = (pdfWidth - imgWidth) / 2;
        const y = (pdfHeight - imgHeight) / 2;
        doc.text('QR Code de Présence', pdfWidth / 2, 20, { align: 'center' });
        doc.addImage(qrCodeDataUrl, 'PNG', x, y, imgWidth, imgHeight);
        doc.save('QRCode_Presence.pdf');
    };

    return (
        <div className="max-w-4xl mx-auto my-8 bg-white p-6 rounded-lg shadow-md font-sans">
            <h1 className="text-center mb-6 text-xl font-bold">{t('label.title_qr')}</h1>

            <div className="flex flex-col md:flex-row justify-between">
                <div className="w-full md:w-1/2 space-y-4">
                    <div>
                        <label>{t('label.annee')}<span className="text-red-500"> *</span></label>
                        <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary"
                            type="text"
                            value={formatYear(annee)}
                            readOnly
                        />
                    </div>

                    <div>
                        <label>{t('label.semestre')}<span className="text-red-500"> *</span></label>
                        <select
                            value={semestre}
                            onChange={handleSemestreChange}
                            className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary"
                        >
                            <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.semestre')}</option>
                            {semestres.map((semestre, index) => (
                                <option key={index} value={semestre}>{semestre}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>{t('label.section')}<span className="text-red-500"> *</span></label>
                        <select
                            value={section ? (lang === 'fr' ? section.libelleFr : section.libelleEn) : ''}
                            onChange={handleSectionChange}
                            className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary"
                        >
                            <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.section')}</option>
                            {sections.map((section, index) => (
                                <option key={index} value={lang === 'fr' ? section.libelleFr : section.libelleEn}>
                                    {lang === 'fr' ? section.libelleFr : section.libelleEn}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>{t('label.cycle')}<span className="text-red-500"> *</span></label>
                        <select
                            value={cycle ? (lang === 'fr' ? cycle.libelleFr : cycle.libelleEn) : ''}
                            onChange={handleCycleChange}
                            className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary"
                        >
                            <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.cycle')}</option>
                            {filteredCycle?.map((cycle, index) => (
                                <option key={index} value={lang === 'fr' ? cycle.libelleFr : cycle.libelleEn}>
                                    {lang === 'fr' ? cycle.libelleFr : cycle.libelleEn}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>{t('label.niveau')}<span className="text-red-500"> *</span></label>
                        <select
                            value={niveau ? (lang === 'fr' ? niveau.libelleFr : niveau.libelleEn) : ''}
                            onChange={handleNiveauChange}
                            className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary"
                        >
                            <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.niveau')}</option>
                            {filteredNiveau?.map((niveau, index) => (
                                <option key={index} value={lang === 'fr' ? niveau.libelleFr : niveau.libelleEn}>
                                    {lang === 'fr' ? niveau.libelleFr : niveau.libelleEn}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        {loading ? (
                            <button className="bg-primary py-2 px-4 w-full text-white rounded-lg" disabled>
                                {t('message.generating')}
                            </button>
                        ) : (
                            <button
                                className="bg-primary py-2 px-4 w-full text-white rounded-lg hover:bg-primary-dark"
                                onClick={handleGenerateQR}
                            >
                                {t('boutton.generer_qr')}
                            </button>
                        )}
                    </div>
                </div>

                <div className="w-full md:w-1/2 mt-8 md:mt-0 flex flex-col items-center justify-center">
                    {qrCodeDataUrl ? (
                        <div className="text-center">
                            
                            <img src={qrCodeDataUrl} alt="QR Code" />
                            <button
                                className="mt-4 bg-secondary py-2 px-4 w-full text-white rounded-lg hover:bg-secondary-dark"
                                onClick={downloadQRAsPDF}
                            >
                                {t('boutton.telecharger')}
                            </button>
                        </div>
                    ): (
                        <p style={{ color: '#888' }}>QR Code</p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default QRCodeGenerator;
