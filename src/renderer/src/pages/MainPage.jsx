import React, { useContext, useEffect, useState } from 'react'
import { json } from 'react-router-dom'
import { AddNewEntry } from '../components/AddNewEntry'
import './MainPage.css'

function Row(props) {
  const { isHeader, name, reps } = props

  return isHeader === true ? (
    <div className={'row-container'}>
      <div className={'grid-box'}>
        <p className={'col-header'}>{name}</p>
      </div>
      <div className={'grid-box'}>
        <p className={'col-header'}>{reps}</p>
      </div>
    </div>
  ) : (
    <div className={'row-container'}>
      <div className={'grid-box'}>
        <p>{name}</p>
      </div>
      <div className={'grid-box'}>
        <p>{reps}</p>
      </div>
    </div>
  )
}

// I want three columns
// HabitName | Category | Description  HowOften | How many times I've done it today
// Base Functionaltiy: HabitName | How Many Times I've Done Today | How Often
//
// Workflow:
// Render the current habits that I have
// - Probably makes sense to save it into a file (probably in JSON format)
//

export function MainPage() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const getInitialData = async () => {
      const query = `select * from habits`
      const results = await window.electronAPI.ipcRenderer.invoke('get-all', query)
      setData(results)
    }
    getInitialData()
  }, [])

  const handleRefresh = async () => {
    const query = `select * from habits`
    const results = await window.electronAPI.ipcRenderer.invoke('get-all', query)
    setData(results)
  }

  const handleReset = async () => {
    const query = `delete from habits`
    const results = await window.electronAPI.ipcRenderer.invoke('run-query', query)
    setData(results)
  }

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
            <Row isHeader={true} name={'Habit Name'} reps={'Reps'} />
          ) : (
            <></>
          )}
          {data && data.length > 0 ? (
            data.map((row, key) => {
              return <Row key={key} isHeader={false} name={row.habitName} reps={row.numReps} />
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
