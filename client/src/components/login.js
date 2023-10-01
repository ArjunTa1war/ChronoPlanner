import React from 'react'
import {useNavigate} from 'react-router-dom';

export default function Login(props) {
  const port = process.env.REACT_APP_PORT;
  const [formData,setFormData] = React.useState({
    email:"",
    password:"",
  })

  let navigate = useNavigate();
  const handleSubmit = async(event)=>{
    event.preventDefault();
    const response = await fetch(`${port}/login`,{
      method : "POST",
      headers : {
         'content-type':'application/json'            
      },
      body : JSON.stringify({email : formData.email,password : formData.password})
    });
    const json = await response.json();
    // console.log(json);
    if(json.success){
      localStorage.setItem('token' , json.authtoken);
      props.showAlert("Succesfully Logged in","success");
      navigate("/");
    }
    else{
      props.showAlert("Invalid Credentials","danger");
    }
  }

  function handleChange(event){
    const {name,value} = event.target;
    setFormData((prev)=>{
      return{
         ...prev,
         [name]:value
      }
    })
 }

  return (
    <div className='pt-5'>
    <div className='border border-dark text-center rounded' style={{maxWidth:"500px",margin : "100px auto", borderColor: "red"}}>
      <h4 className=" text-primary fw-bold text-center text-light p-3 rounded" style={{backgroundColor:"#00203FFF"}}>Login Page</h4>
      <form onSubmit={handleSubmit} className='mx-3'>
        <div className="mb-3 mt-4">
          <div>Enter Your Email</div>
          <input 
          type="email" 
          className="form-control"
          onChange={handleChange}
          value={formData.email}
          name="email" />
          </div>

        <div className="mb-4">
          <div> Enter Your Password</div>
          <input 
           type="password"
           className="form-control"
            id="exampleInputPassword1"
            onChange={handleChange}
            value={formData.password}
            name="password" 
            />
        </div>

        <button type="submit" className="btn mb-5 btn-dark" style={{backgroundColor:"#00203FFF"}}>Submit</button>
      </form>
    </div>
    </div>
  )
}
