import React, {Component} from 'react';


class ChartComponent extends Component{
    // constructor(){
    //     super();
    // }

    render(){
        return(
            <div className="container mb-2">
                <div className='row'>
                    <div className = 'col-6'>
                        First Chart
                    </div>
                    <div className = 'col-6'>
                        Second Chart
                    </div>
                </div>
            </div>
        );
    }
}


export default ChartComponent;