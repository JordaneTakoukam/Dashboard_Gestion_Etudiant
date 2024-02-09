import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import LoadingTable from '../Tables/common/LoadingTable';




interface ChartProps {
    series: {
        name: string;
        data: number[];
    }[];
}



export const ChartNombreEtudiant: React.FC = () => {
    const pageIsLoading = false;
    const listNiveau = ['1ère année', '2ème année', '3ème année', '4ème année', '5ème année'];
    const listHeureAbscenceEtudiant = [40, 105, 15, 55, 20];


    const options: ApexOptions = {
        colors: ['#D2691E', '#80CAEE'],
        chart: {
            fontFamily: 'Satoshi, sans-serif',
            type: 'bar',
            height: 335,
            stacked: true,
            toolbar: {
                show: true,
            },
            zoom: {
                enabled: true,
            },
        },

        responsive: [
            {
                breakpoint: 1536,
                options: {
                    plotOptions: {
                        bar: {
                            borderRadius: 0,
                            columnWidth: '25%',
                        },
                    },
                },
            },
        ],
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 0,
                columnWidth: '25%',
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'last',
            },
        },
        dataLabels: {
            enabled: false,
        },

        xaxis: {
            categories: listNiveau,
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            fontFamily: 'Satoshi',
            fontWeight: 500,
            fontSize: '12px',

            markers: {
                radius: 99,
            },
        },
        fill: {
            opacity: 1,
        },
    };




    useEffect(() => {
        setState({ series: [{ name: 'Abscences', data: listHeureAbscenceEtudiant }] });
    }, []);


    const [state, setState] = useState<ChartProps>({
        series: [{ name: '', data: [] }]
    });

    return (


        <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-3">
            <div className="mb-4 justify-between gap-4 sm:flex">
                <div>
                    <h4 className="text-md xl:text-[18px]  font-semibold text-black dark:text-white">
                        Nombres d'heures d'abscences par niveau
                    </h4>
                </div>

            </div>

            <div>
                <div id="chartTwo" className="-ml-5 -mb-9">
                    {
                        !pageIsLoading ?

                            <ReactApexChart
                                options={options}
                                series={state.series}
                                type="bar"
                                height={350}
                            /> : <LoadingTable />
                    }


                </div>
            </div>
        </div>
    );
};



