import React, {Component} from 'react';
import { Button, Input } from 'reactstrap';
import DeleteIcon from '@material-ui/icons/Delete';
import {IconButton} from '@material-ui/core';
import axios from 'axios';

class SettingComponent extends Component{
    constructor(props){
        super(props);
        this.state = {
            item : [],
            budget : '',
            category : '',
            url : 'http://localhost:9000'
        }
        
    }

        
    componentDidMount(){
        // update all the states to the current values from database
        
        const getBudget = async () =>{
            axios.get(`${this.state.url}/setting/budget`)
            .then(result => {
                if(result.data[0] !== undefined){ 
                    console.log(result.data[0].totalBudget  )
                    if(result.data[0].totalBudget !== null && result.data[0].totalBudget !== undefined){
                        this.setState({
                            budget : result.data[0].totalBudget
                        })
                    }
                    else{
                        alert('Please fill in the total budget')
                    }
                    if(result.data[0].category.length){
                        this.setState({
                            item : result.data[0].category
                        })
                    }
                    else{
                        alert('Please fill in a category');
                    }
                }
                else{
                    alert('Please fill the total budget and assign one category')
                }
            })
        }

        getBudget();
    }


    // update the budget and add
    updateBudget = async() => {
        

        await axios.post(`${this.state.url}/setting/add/budget`, {
            "totalBudget" : this.state.budget
        })
        .then(result => {
            if(result.data.success === 'success'){
                alert(`Total budget updated to ${this.state.budget}`)
            }
            else{
                alert('Operation failed please try again');
            }
        })

    }

    // get input for budget
    handleBudgetChange = ({target}) =>{
        this.setState({
            [target.name] : target.value
        });
    }

    // get input for category
    handleCategoryChange = ({target}) =>{
        this.setState({
            [target.name] : target.value
        });
    }

    // add cats
    addCategory = () =>{
        var flag = 1;
        
        if(this.state.item.includes(this.state.category)){
            flag = 0
            alert('The category is already present')
        }
        if(this.state.category === ""){
            flag = 0
            alert('The category can not be empty');
        }
        if(flag){
            axios.post(`${this.state.url}/setting/category`,{
                "category" : this.state.category
            })
            .then(result => {
                if(result.data.success === 'success'){
                    var newCat = [...this.state.item];
                    newCat.push(this.state.category)
                    this.setState({
                        item : newCat
                    })
                }
                else if(result.data.success === 'failure'){
                    alert('Operation failed', result.data)
                }
            })
        }
    }

    // delete cats
    deleteCategory = async (index,item) => {
        console.log(index, item);
        
        axios.delete(`${this.state.url}/setting/category/${item}`)
        .then(result => {
            if(result.data.success === 'success'){
                var state = [...this.state.item];
                state.splice(index, 1);
                this.setState({
                    item : state
                })
            }
            else{
                console.log('failed')
            }
        })
    }

    render(){
        return(
            <div className = 'container ml-5'>
                <div className = 'row mb-5'>
                        <div className = 'col-sm-4'>
                            Total Budget
                        </div>
                        <div className = 'col-sm-4'>
                            <Input type="number" name='budget' value={this.state.budget || ''} 
                                onChange={this.handleBudgetChange}>
                            </Input>
                        </div>
                        <div className = 'col-sm-4'>
                            <Button outline color='success' onClick={this.updateBudget} >Update</Button>
                        </div>
                </div>
                <div className='row mb-5'>
                    <div className = 'col-sm-4'>
                        Categories
                    </div>
                    <div className = 'col-sm-4'>
                        <Input type="text" name='category' onChange={this.handleCategoryChange}></Input>
                    </div>
                    <div className = 'col-sm-4'>
                        <Button outline color='success' onClick={this.addCategory} >Add</Button>
                    </div>
                </div>
                <div className = 'row pt-5'>
                    <div className='col-3 box2'>
                        <p className ='mb-2'>
                            Categories
                        </p>
                        {
                            this.state.item.map((item, index) =>{
                                return(
                                    <div className = 'row mb-2' key = {index} >
                                        <div className = 'col-6 pt-2 mt-1' >
                                            {item}
                                        </div>
                                        <div>
                                            <IconButton onClick={() => this.deleteCategory(index,item)} >
                                                <DeleteIcon color='secondary' />
                                            </IconButton>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default SettingComponent

