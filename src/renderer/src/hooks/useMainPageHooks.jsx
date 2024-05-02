/* 
 * useMainPageHooks.jsx
 * This is a file for defining all of the handlers 
 * utilized in the main page of the application. (not including rows)
 */
import { useState } from 'react'

/* 
 * useMainPageHooks()
 */
export default function useMainPageHooks(initialData) {
  const [ data, setData ] = useState(initialData)

    /*
     * handleRefresh()
     */ 
    const handleRefresh = async () => { 
        const query = `select * from habits`
        const results = await window.electronAPI.ipcRenderer.invoke('get-all', query)
        setData(results)    
    } 

    /* 
     * handleReset()
     */ 
    const handleReset = async () => { 
        const query = `delete from habits`
        const results = await window.electronAPI.ipcRenderer.invoke('run-query', query)
        setData(results)    
    }

  return {
    data, 
    setData, 
    handleRefresh,
    handleReset
  }
}

