import React, { useContext, useEffect, useState } from 'react'
import { json } from 'react-router-dom'
import { AddNewEntry } from '../components/AddNewEntry'
import './MainPage.css'
import useRowButtonHandlers from '../hooks/useRowButtonHandlers'
import useMainPageHooks from '../hooks/useMainPageHooks'

/* 
 * Row()
 * This is a component that represents a row in the table.
 * 
 * It contains the following data: 
 * - isHeader: a boolean that determines if the row is a header or not1.
 * - name: the name of the habit.
 * - reps: the number of reps the user is supposed to do.
 * - currReps: the number of reps the user has done today.
 * - entry: the id of the habit.
 */
function Row(props) {
  const { isHeader, name, reps, currReps, entry, setData } = props

  const { handleIncrement } = useRowButtonHandlers(props)

  const [deleteToggle, setDeleteToggle] = useState(false); 

  const showDelete = async ()  => {  
    setDeleteToggle(!deleteToggle) 
  }

  return isHeader === true ? (
    <div className={'row-container'}>
      <div className={'grid-box'}>
        <p className={'col-header'}>{name}</p>
      </div>
      <div className={'grid-box'}>
        <p className={'col-header'}>{reps}</p>
      </div>
      <div className={'grid-box'}>
        <p className={'col-header'}>{currReps}</p>
      </div>
    </div>
  ) : (
    <div className={'row-container'} onClick={showDelete}>
      {/*showDelete === true ? (<button className='main-inc-button'>-</button>) : (<></>)*/}
      <div className={'grid-box'}>
        {/*<p className={'col-body'}>{entry}</p>*/}
        <p className={'col-body'}>{name}</p>
      </div>
      <div className={'grid-box'}>
        <p className={'col-body'}>{reps}</p>
      </div>
      <div className={'grid-box'}>
        <p className={'col-body'}>{currReps}</p>
        <button className='main-inc-button' onClick={handleIncrement}>+</button>
      </div>
    </div>
  )
} 

/* 
 * MainPage()
 * This is the main page of the application. It will display all of the user's habits. 
 */ 
export function MainPage() {
  const initialData = null; 

  const { data, setData, handleRefresh, handleReset } = useMainPageHooks(initialData)

  useEffect(() => {
    const getInitialData = async () => {
      const query = `select * from habits`
      const results = await window.electronAPI.ipcRenderer.invoke('get-all', query)
      setData(results)
    }
    getInitialData()
  }, [])

  return (
    <>
      <span className={'page-container'}>
        <div className="text">
          <p className={'header'}>
            Welcome Back to <span className="react">Reps</span>!
          </p>
        </div>
        <div className={'grid-container'}>
          {data && data.length > 0 ? (
            <Row isHeader={true} name={'Habit Name'} reps={'Reps'} currReps={'Reps Today'} />
          ) : (
            <></>
          )}
          {data && data.length > 0 ? (
            data.map((row, key) => {
              return <Row key={key} 
                        isHeader={false} 
                        name={row.habitName} 
                        reps={row.numReps} 
                        currReps={row.currReps}
                        entry={row.id}
                        setData={setData}
                        />
            })
          ) : (
            <p>
              No habits available. Make a new one using the <strong>Add</strong> button.
            </p>
          )}
        </div>
        {/* <button className={'form-button'} onClick={handleRefresh}>
          Refresh
        </button> */}
        <div className={'main-menu-button-container'}>
          <button className={'form-button'} onClick={handleReset}>
            Reset
          </button>
        </div>
        <AddNewEntry setDataFn={setData} />
      </span>
    </>
  )
}
