import React, { Component, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, Label, Input, FormGroup } from 'reactstrap';
import {IconButton} from '@material-ui/core'; 
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ChartComponent from './ChartComponent';
import axios from 'axios';
import {Redirect} from 'react-router-dom';

class HomeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expense: [],
            category : [],
            totalBudget : '',
            redirect : false,
            url : 'http://localhost:9000',
            data : []
        }
    }

    async componentDidMount() {
        // get stuff from server
        await axios.get(`${this.state.url}/expense`)
        .then((result => {
            this.setState({
                expense : result.data
            })
        }))
        .catch(err => console.log(err))

        await axios.get(`${this.state.url}/setting/budget`)
        .then(result => {
            if(result.data[0] !== undefined){
                this.setState({
                    category : result.data[0].category,
                    totalBudget : result.data[0].totalBudget
                })
            }
        })
        .catch(result => console.log(result));
        if(this.state.totalBudget === ''|| this.state.totalBudget === undefined || this.state.category.length === 0){
            this.setState({
                redirect : true
            })
        }
        else{

        }
        
        
    }

    addToState = (name,amount,category,date,_id) => {
        var newState = [...this.state.expense]
        newState.push({_id,name,amount,category,date})
        console.log(newState);
        this.setState({
            expense : newState
        })   
        
    }

    deleteExpense = async (index) => {
        
        var newExpense = [...this.state.expense];
        const deleteId = newExpense[index]._id;
        
        await axios.delete(`${this.state.url}/expense/delete/${deleteId}`)
        .then(result => {
            // console.log(result);    
        })
        newExpense.splice(index,1);
        this.setState({
            expense : newExpense
        })
    };
    
    

    render() {
        var render;
        var redir = <Redirect to='settings'/>
        // empty message
        var message = 
            <div className='text-center'>
                Please add some expense using the Add Expense Button
            </div>;

        // main content
        const main = 
        <div>
            <div className='row mb-2'>
            <div className='col'>
                Action
            </div>
            <div className='col'>
                Category
            </div>
            <div className='col'>
                Item Name
            </div>
            <div className='col'>
                Amount
            </div>
            <div className='col'>
                Expense Date
            </div>
        </div>
        
        <React.Fragment>
            {   
                this.state.expense.map((name, index) => {
                    return (
                        <div className='row mb-1' key={index}   >
                            <div className='col'>
                                <IconButton onClick={() => <AddExpenseModal/>} >
                                    <EditIcon fontSize = 'small'/>
                                </IconButton>
                                <IconButton onClick={() => this.deleteExpense(index)} >
                                    <DeleteIcon fontSize='small'/>
                                </IconButton>
                            </div>
                            <div className='col pt-2'>
                            {name.category}
                            </div>
                            <div className='col pt-2'>
                                {name.name}
                            </div>
                            <div className='col pt-2'>
                                {name.amount}
                            </div>
                            <div className='col pt-2'>
                                {name.date}
                            </div>
                        </div>
                    )
                })
            }
        </React.Fragment>
    </div>;
    // check if expense is empty and render
    if(this.state.redirect) {render = redir}
    else{this.state.expense.length ? render = main : render = message}
    // render = redir

    // return method
        return (
            <div className='container'>
                <ChartComponent props={this.state}/>

                {/* call the modal for add */}
                <AddExpenseModal  cat = {this.state.category} updateState={this.addToState}/>
                
                {/* render called */}
                {render}
            </div>
        )
    }
}



// Functional Component for modal and adding new expense

const AddExpenseModal = (props) => {


    const [modal, setModal  ] = useState(false);
    const [name,setName] = useState('');
    const [amount, setAmount] = useState(0)
    const [category, setCat] = useState()
    

    const toggle = () => setModal(!modal);
    
    const getToday = () => {
        var curr = new Date();
        curr.setDate(curr.getDate());
        var dateT = curr.toISOString().substr(0,10);
        // setDate(dateT)
        return dateT

    }

    const todayDate = getToday();
    var [date, setDate] = useState(todayDate)


    
    
    const addExpense = async (e) => {
        console.log(props.cat[0])
        e.preventDefault()
        await axios.post('http://localhost:9000/expense/add', {
            "name" : name,
            "amount" : amount,
            "category" : category,
            "date": date 
        })
        .then(result => {
            if(result.data.success === 'success'){
                var _id = result.data._id
                console.log("ID : ", result.data);
                props.updateState(name,amount,category,date,_id);
                setName('');
                setAmount(0);
                toggle();
            }
            else{
                alert('Something went wrong please try again')
            }
        })
        .catch(err => console.log(err));
        
    }
    return (    
        <div>
            <Button outline color="success mb-2" onClick={toggle} >Add Expense</Button>
            <Modal isOpen={modal} toggle={toggle} backdrop='static' >
                <ModalHeader toggle={toggle}>Add an Expense</ModalHeader>
                <ModalBody>
                    <Form onSubmit={e => addExpense(e)}>
                        <FormGroup>
                            <Label for='category'>
                                Category
                            </Label>
                            <Input type='select' id='category'
                                onChange = {e => setCat(e.target.value)}>
                                <option value=''>Select</option>
                                {
                                    props.cat.map((name,index) =>{
                                        
                                        return(
                                            <option key = {index} value = {name}>
                                                {name}
                                            </option>
                                        )
                                    })
                                }
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for='name'>
                                Name
                            </Label>
                            <Input type='text' id='name' value={name} 
                                onChange = {e => setName(e.target.value)} required>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for='amount'>
                                Amount
                            </Label>
                            <Input type='number' id='amount' value={amount}
                                onChange = {e => setAmount(e.target.value)} required>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for='date'>
                                Date
                            </Label>
                            <Input type='date'  id='date' 
                                defaultValue={todayDate} onChange = {e => setDate(e.target.value)} required>
                            </Input>
                        </FormGroup>
                        <ModalFooter>
                    <Button type='submit' color="success" >Add</Button>
                    <Button color="danger" onClick={toggle}>Cancel</Button>
                </ModalFooter>
                    </Form>
                </ModalBody>
                
            </Modal>
        </div>
    )
}

export default HomeComponent;