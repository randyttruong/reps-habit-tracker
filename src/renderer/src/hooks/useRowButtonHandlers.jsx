/*
 * useRowButtonHandlers.jsx
 * This is a file for defining
 */

import { useState } from 'react';

/*
 * useRowButtonHandlers()
 * This is a custom hook that is used to handle the button clicks for each row.
 * It contains the following data:
 * - isHeader: a boolean that determines if the row is a header or not.
 * - name: the name of the habit.
 * - reps: the number of reps the user is supposed to do.
 * - currReps: the number of reps the user has done today.
 * - entry: the id of the habit.
 * - setData: a function that updates the data state in the parent component.
 *  - Data simply just contains all of the contents of the SQLite database.
 */
export default function useRowButtonHandlers(props) {
  const { isHeader, name, reps, currReps, entry, setData } = props

  const [formVars, setFormVars] = useState(
    {
      "habitName": name,
      "reps": reps,
    }
  )

  /*
   * handleIncrement()
   * This function is called when the user clicks the increment button.
   * Expected Behavior: Increment the number of reps that the user has done in that session.
   */
  const handleIncrement = async () => {
    const incQuery = `update habits set currReps = currReps + 1 where id = ${entry}`
    const results1 = await window.electronAPI.ipcRenderer.invoke('run-query', incQuery)
    const query = `select * from habits`
    const results = await window.electronAPI.ipcRenderer.invoke('get-all', query)
    setData(results)
  }

  /*
   * TODO: Add a decrement button on the main page.
   * TODO: Make sure that the decrement button on the main page is visible whenever
   * the user has "completed" their habit for the day (in case they made a mistake).
   *
   * handleDecrement()
   * This function is called whenever the user clicks the decrement button.
   * It simply reduces the number of reps that the user has done in that session.
   *
   */
  const handleDecrement = async () => {
    const decQuery = `update habits set currReps = currReps - 1 where id = ${entry}`
    const results1 = await window.electronAPI.ipcRenderer.invoke('run-query', decQuery)
    const query = `select * from habits`
    const results = await window.electronAPI.ipcRenderer.invoke('get-all', query)
    setData(results)

  }

  /*
   * handleDelete()
   * This function is called whenever the user clicks the delete button.
   * This just deletes the habit entry from the database.
   */
  const handleDelete = async () => {
    const delQuery = `delete from habits where id = ${entry}`
    const results1 = window.electronAPI.ipcRenderer.invoke('run-query', delQuery)
    const refreshQuery = `select * from habits`
    const results = window.electronAPI.ipcRenderer.invoke('get-all', refreshQuery)
    setData(refreshQuery)
  }

  /*
   * TODO: handleEdit()
   * This is a hook that enables users to edit the metadata of the
   * habit that they're examining.
   *
   * That is, the user is able to just edit the name of the habit, the
   * category of the habit, as well as the number of reps that they're
   * supposed to do for that habit per day.
   *
   * This handler is executed whenever the submit button is pressed.
   * Should accept three arguments, which represent state for the
   * current row.
   */
  const handleEdit = async () => {
    const query = `update habits set habitName = ?, numReps = ? where id = ?`
    const params = [formVars.habitName, formVars.reps, entry];

    const results = await window.electronAPI.ipcRenderer.invoke('run-query', query, params);

    const refreshQuery = `select * from habits`;
    const results2 = await window.electronAPI.ipcRenderer.invoke('get-all', refreshQuery);
  }

  return { handleIncrement, handleDecrement, handleDelete, formVars, setFormVars }
}
