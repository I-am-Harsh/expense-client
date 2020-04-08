import React from 'react';
import { PieChart, Pie, Legend, Tooltip, Cell } from 'recharts';


const data01 = [
    { name: 'Group A', value: 400 }, { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 }, { name: 'Group D', value: 200 },
    { name: 'Group E', value: 278 }, { name: 'Group F', value: 189 },
];

const data02 = [
    { name: 'Total', value: 2400 }, { name: 'Used', value: 2000 }
];

console.log(data01);

const ChartComponent = (props) => {


    var data = [];
    const dataFinal = [];

    const totalForEachCategory = () => {
        if (props.props.expense.length != 0) {
            props.props.category.map(category => {
                var totalAmount = 0
                props.props.expense.map(item => {
                    if (category === item.category) {
                        totalAmount += Number(item.amount);
                    }
                })
                var catAmountPair = {
                    name: category,
                    value: totalAmount
                }
                data.push(catAmountPair)
            })
            console.log("Data : ", data);
        }


    }
    const COLORS = ['#5D6D7E', '#E67E22', '#2ECC71', '#9B59B6'];

    totalForEachCategory();
    return (
        <div className="container mb-2">
            <div className='row'>
                <div className='col-md-6'>
                    <div className='col-md-12 border'>
                        <h3 className='text-center'>Chart 2</h3>
                        <PieChart width={800} height={400}>
                            <Pie
                                data={data}
                                cx={200}
                                cy={200}
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {
                                    data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                                }
                            </Pie>
                            <Tooltip/>
                            <Legend/>
                        </PieChart>
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='col-md-12 border'>
                        <h3 className='text-center'>Chart 2</h3>
                        <PieChart width={400} height={400}>
                            <Pie dataKey="value" isAnimationActive={true} data={data} cx={200} cy={200} outerRadius={80} fill="#8884d8">
                                {
                                    data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]} />)
                                }
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </div>
                </div>
            </div>
        </div>
    );

}


export default ChartComponent;