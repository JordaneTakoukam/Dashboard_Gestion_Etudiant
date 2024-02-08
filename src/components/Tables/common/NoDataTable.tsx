
function NoDataTable({title}:{title?:string}) {
    return (
        <thead className='mb-45 mt-35 flex justify-center items-center'>
            <tr>
                <th className="text-sm font-medium">{title?title:"Aucune donnée enregistrée durant cette période."}</th>
            </tr>
        </thead>
    )
}

export default NoDataTable