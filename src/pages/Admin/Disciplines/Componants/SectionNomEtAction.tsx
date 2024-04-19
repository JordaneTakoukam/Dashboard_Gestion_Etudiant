import { nbTotalAbsences } from "../../../../fonctions/fonction";
import { CardGestionUser } from "./CardGestionAbsences";

interface SectionNomEtActionProps {
  user: UserDiscipline;
}



function SectionNomEtAction({ user }: SectionNomEtActionProps) {
  const totalAbsence = nbTotalAbsences(user.absences);

  return (
    <div className="flex flex-col lg:flex-row mt-1 gap-y-4 lg:gap-y-0 gap-x-4">

      <CardGestionUser title={'gestion_absence.nom_et_prenom'} value={`${user.nom} ${user.prenom}`} id={100} />
      <CardGestionUser title={'gestion_absence.semestre'} id={101} />
      <CardGestionUser title={totalAbsence === '0' ? 'menu.heure_d_absence' : 'menu.heures_d_absences'} value={totalAbsence} id={102} />



    </div>
  )
}

export default SectionNomEtAction