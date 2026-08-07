import { useForm, ValidationError } from "@formspree/react"
import { useState } from "react"
import "./Contact.css"

export default function Contact() {

  const [formState, handleSubmit] = useForm("mqaynrbd");
  const [enteredProperties, setEnteredProperties] = useState({name: false, email: false, message: false});

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedProperty = {};
    updatedProperty[name] = value.length > 0;

    const updatedProperties = { ...enteredProperties, ...updatedProperty };
    console.log(updatedProperties);
    setEnteredProperties(updatedProperties);
  }

  return (
    <div id="container">
      <section className="text-section">
        <h1>Contact</h1>
        <p>Feel free to reach out to me using this form!</p>
        <p style={{fontSize: '1rem', color: "#dddddd"}}>
          Whether it’s a collaboration, a project idea, or a technical 
          discussion - I’m always open to meaningful conversations.
        </p>
      </section>
      <form action={handleSubmit}>
        <div className="input-group">
          <input 
            onChangeCapture={handleChange}
            className={enteredProperties.name && "text-entered"}
            type="text" 
            autoComplete="additional-name" 
            id="name" 
            name="name" 
            required />
          <label htmlFor="name">Name</label>
        </div>

        <div className="form-error">
          <ValidationError
            prefix="Name"
            field="name"
            errors={formState.errors}/>
        </div>
        
        <div className="input-group">
          <input 
            onChangeCapture={handleChange}
            className={enteredProperties.email && "text-entered"}
            type="email" 
            autoComplete="email" 
            id="email" 
            name="email" 
            required />
          <label htmlFor="email">Email</label>
        </div>

        <div className="form-error">
          <ValidationError
            prefix="Email"
            field="email"
            errors={formState.errors}/>
        </div>

        <div className="input-group">
          <textarea 
            className={enteredProperties.message && "text-entered"}
            onChangeCapture={handleChange}
            id="message"
            name="message" 
            required
            rows={10}
            ></textarea>
          <label htmlFor="message">Message</label>
        </div>

        <div className="form-error">
          <ValidationError 
            prefix="Message" 
            field="message"
            errors={formState.errors}/>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>

    
  )
}