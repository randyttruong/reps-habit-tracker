import { useState } from 'react' 

/* 
 * useFormHooks.jsx
 * This is a custom hook that is used to handle form data.
 */ 
export default function useFormHooks(initialFormData, onClose) {  
    const [ formData, setFormData ] = useState(initialFormData);  
    const [ errorMessage, setErrorMessage ] = useState('');

    const handleNameChange = (event) => { 
        setFormData({ habitName: event.target.value, numReps: formData.numReps });
    } 

    const handleIncrement = () => { 
        setFormData({ habitName: formData.habitName, numReps: formData.numReps + 1 });
    } 

    const handleDecrement = () => {  
        setFormData({ habitName: formData.habitName, numReps: formData.numReps - 1 });
    }

    const handleClose = () => {  
        onClose();
        setFormData(initialFormData);
        setErrorMessage('');
    } 

    return { 
        formData, 
        setFormData, 
        errorMessage, 
        setErrorMessage, 
        handleNameChange, 
        handleIncrement, 
        handleDecrement, 
        handleClose 
    };
}