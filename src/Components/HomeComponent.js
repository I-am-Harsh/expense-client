import React, { Component, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, Label, Input, FormGroup } from 'reactstrap';
import {IconButton} from '@material-ui/core'; 
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ChartComponent from './ChartComponent';
import axios from 'axios';

class HomeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expense: [],
            category : []
        }
    }


    async componentDidMount() {
        // get stuff from server
        await axios.get('http://localhost:9000/expense')
        .then((result => {
            this.setState({
                expense : result.data
            })
        }))
        .catch(err => console.log(err))

        await axios.get('http://localhost:9000/setting/budget')
        .then(result => {
            this.setState({
                category : result.data[0].category
            })
        })
        .catch(result => console.log(result));

        
    }

    addToState = () => {
        console.log("something")
    }

    deleteExpense = async (index) => {
        
        var newExpense = [...this.state.expense];
        const deleteId = newExpense[index]._id;
        
        await axios.delete('http://localhost:9000/expense/delete/' + deleteId)
        .then(result => {
            // console.log(result);    
        })
        newExpense.splice(index,1);
        this.setState({
            expense : newExpense
        })
    };

    

    render() {
        return (
            <div className='container'>
                <ChartComponent/>
                {/* call the modal for add */}
                <AddExpenseModal  props = {this.state.category} updateState={this.addToState}/>
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
                                <div className='row mb-1' key={index} style={{backgroundColor : "lightgreen"}} >
                                    <div className='col'>
                                        <IconButton >
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
            </div>
        )
    }
}



// Functional Component for modal and adding new expense

const AddExpenseModal = (props, updateState) => {

    
    const [modal, setModal] = useState(false);
    
    const [name,setName] = useState('');
    const [amount, setAmount] = useState(0)
    const [category, setCat] = useState()
    const [date, setDate] = useState('')

    const toggle = () => setModal(!modal);
    
    const getToday = () => {
        var today = new Date()
        var date = today.toJSON().slice(0, 10); 
        var nDate = date.slice(8, 10) + '/'  
                   + date.slice(5, 7) + '/'  
                   + date.slice(0, 4); 
        return nDate;
    }

    const todayDate = getToday();

    const addExpense = async () => {
        await axios.post('http://localhost:9000/expense/add', {
            "name" : name,
            "amount" : amount,
            "category" : category,
            "date": date 
        })
        .then(result => {
            if(result.data.success === 'success'){
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
                    <Form>
                        <FormGroup>
                            <Label for='category'>
                                
                            </Label>
                            <Input type='select' id='category'
                                onChange = {e => setCat(e.target.value)}>
                                <option value='Select'>Select</option>
                                {
                                    props.props.map((name,index) =>{
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
                            <Input type='date' value={date} id='date' 
                                onChange = {e => setDate(e.target.value)} required>
                            </Input>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button type='button' color="success" onClick={addExpense}>Add</Button>
                    <Button color="danger" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}

export default HomeComponent;