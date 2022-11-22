import {useState} from 'react'
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import SaveButton from '../../components/Button';
import CancelButton from '../../components/CancelButton';
import ValidatEmployee from './validation';
import apiClient from '../../url/index';
import { buttonAction } from '../../store/slices/ButtonSpinerSlice';
import { employeeAction } from '../../store/slices/EmployeeSlice';
import { useDispatch } from 'react-redux';
import classes from './Employees.module.css'


const AddEmployees = (props) => {
    const [employee,setEmployee] = useState({fName:'',lName:'',phoneNumber:'',email:'',role:'local admin'})
    const [errors,setErrors] = useState({fName:'',lName:'',phoneNumber:'',email:'',role:''})
    const dispatch = useDispatch()

    const changeHandler = (e) =>{
       const {name,value} = e.target
       setEmployee(previousValues=>{
        return {...previousValues,[name]:value}
       })
       if(e.target.value){
        setErrors(prevErrors=>{
            return {...prevErrors,[name]:''}
        })
       }
    }
    const roleChangeHandler = (e) =>{
      setEmployee(previousValues=>{
        return {...previousValues,role:e.target.value}
       })
    }
    const saveHandler = async() =>{
        setErrors(ValidatEmployee(employee))
        dispatch(buttonAction.setBtnSpiner(true))
        try{
        const response = await apiClient.post('admin/employees',employee)
        if(response.status === 201){
           dispatch(employeeAction.addEmployee(response.data))
           handleClose()
        }
      }
      catch(er){}
      finally{
        dispatch(buttonAction.setBtnSpiner(false))
      }

        console.log('employee save is clicked')
    }
  const handleClose = () => {
    props.onClose()
  }

  return (
    <>
      <Modal
        show={props.show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form className='px-3'>
        <Form.Group className="mb-3" controlId="fName">
          <Form.Label>First Name</Form.Label>
          <Form.Control 
          type="text"
          name="fName"
          onChange={changeHandler}
          value={employee.fName}
          className={errors.fName?classes.errorBorder:''}
           />
           <span className={classes.errorText}>{errors.fName}</span> 
        </Form.Group>
        <Form.Group className="mb-3" controlId="lname">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
           type="text"
           name="lName"
          onChange={changeHandler}
          value={employee.lName}
          className={errors.lName?classes.errorBorder:''}
            />
            <span className={classes.errorText}>{errors.lName}</span> 
        </Form.Group>
        <Form.Group className="mb-3" controlId="phoneNo">
        <Form.Label>Phone Number</Form.Label>
        <Form.Control
         type="number"
         name="phoneNumber"
          onChange={changeHandler}
          value={employee.phoneNumber}
          className={errors.phoneNumber?classes.errorBorder:''}
          />
          <span className={classes.errorText}>{errors.phoneNumber}</span> 
      </Form.Group>
      <Form.Group className="mb-3" controlId="emailAddress">
      <Form.Label>Email Address</Form.Label>
      <Form.Control
       type="email"
       name="email"
       onChange={changeHandler}
       value={employee.email}
       className={errors.email?classes.errorBorder:''}
        />
        <span className={classes.errorText}>{errors.email}</span> 
    </Form.Group>
    
    <Form.Group className="mb-3" controlId="role">
    <Form.Label>Role</Form.Label>
    <Form.Select aria-label="Default select example" onChange={roleChangeHandler} value={employee.role}>
      <option value="1">local admin</option>
      <option value="2">Product Inspector</option>
      <option value="3">Casher</option>
    </Form.Select>

  </Form.Group>
      </Form>
  
        </Modal.Body>
        <Modal.Footer>
        <CancelButton title="Close" onClose={handleClose} />
        <SaveButton title="Save" onSave={saveHandler}/>
        </Modal.Footer>
      </Modal>
    </>
  );
}

 export default AddEmployees 