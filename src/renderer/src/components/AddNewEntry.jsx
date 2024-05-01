import { React, useState, useContext } from 'react'
import "./AddNewEntry.css"

/*
 * AddNewEntry.jsx
 * This is a component that allows a user to add a new habit.
 * They add habits by pressing some initial button,
 * which then leads to a pop-up menu.
 */

/*
 * veryifySub()
 * This is a helper function that checks if the input is valid.
 */
function verifySub(name, reps) {
  if (typeof name !== 'string' || isNaN(reps) || reps <= 0) {
    return false
  }
  return true
}

/*
 * PopUpMenu()
 * This is going to be a container that holds a form for creating
 * a new entry. Whenever a new entry is created, it is just saved
 * locally.
 *
 * TODO: Handle Styling
 */
function PopUpMenu(props) {
  const { isOpen, onClose, setDataFn, children } = props

  const [formData, setFormData] = useState({
    habitName: '',
    numReps: 0
  })

  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    const numReps = parseInt(formData.numReps)

    if (!verifySub(formData.habitName, numReps)) {
      setErrorMessage('Invalid input. Please enter a valid habit name and number of reps.')
    } else {
      setErrorMessage('')
      const query = `INSERT INTO habits (habitName, numReps) VALUES (? , ?)`
      const query2 = `SELECT * from habits `
      const params = [formData.habitName, numReps]

      const resp = await window.electronAPI.ipcRenderer.invoke('run-query', query, params)
      const resp2 = await window.electronAPI.ipcRenderer.invoke('get-all', query2)
      setDataFn(resp2)

      console.log("successful submission");

      // console.log(JSON.stringify(resp));
      // console.log(resp2);

      setFormData({ habitName: '', numReps: 0 })
      onClose()
    }
  }

  const handleNameChange = (event) => {
    setFormData({ habitName: event.target.value, numReps: formData.numReps })
    console.log(event.target.value)
  }

  const handleRepChange = (event) => {
    setFormData({ habitName: formData.habitName, numReps: parseInt(event.target.value) })
    console.log(event.target.value)
  }
  const handleIncrement = () => {
    setFormData({ ...formData, numReps: formData.numReps + 1 });
  }

  const handleDecrement = () => {
    if (formData.numReps > 0) {
      setFormData({ ...formData, numReps: formData.numReps - 1 });
    }
  }

  const handleClose = () => { 
    onClose()
    setFormData({ habitName: '', numReps: 0 })
    setErrorMessage('')
  }



  if (!isOpen) {
    return <></>
  }

  return (
    <>
      <div className={'pop-up-menu-overlay'}>
        <div className={'pop-up-menu'}>
          <h2 className={'pop-up-menu-header'}>Create New Habit</h2>
          <div className={'pop-up-menu-content'}>
            <form className={'form-container'} onSubmit={handleSubmit}>
              <label>
                <input
                  className={'habit-input'}
                  placeholder={"What's your new habit?"}
                  type={'text'}
                  name={'name'}
                  onChange={handleNameChange}
                />
              </label>
              <div className={'reps-container'}> 
              <label>
                <div className={'second-header'}>How often is this habit?</div>
                <input
                  defaultValue={0}
                  className={'rep-input'}
                  type={'number'}
                  name={'reps'}
                  readOnly
                  value={formData.numReps}
                />
                <button className={'inc-button'} type="button" onClick={handleDecrement}>
                  -
                </button>
                <button className={'inc-button'} type="button" onClick={handleIncrement}>
                  +
                </button>
              </label>
              </div> 
              <div className={'error-message-container'}>{errorMessage && <p>{errorMessage}</p>}</div>
            </form>
              <div className={'button-container'}>
                <button className={'form-button'} type={'submit'} onClick={handleSubmit}>
                  Submit
                </button>
                <button className={'form-button'} onClick={handleClose}>
                  Close
                </button>
              </div>
          </div>
        </div>
      </div>
    </>
  )
}
/*
 * AddNewEntry
 * This is just going to be a button that just activates the PopUpMenu()
 * component.
 */
export function AddNewEntry(props) {
  const { setDataFn } = props

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen)
  }

  return (
    <>
      <PopUpMenu isOpen={isDialogOpen} onClose={toggleDialog} setDataFn={setDataFn} />
      <button className={'new-habit-button'} onClick={toggleDialog}>+</button>
    </>
  )
}
