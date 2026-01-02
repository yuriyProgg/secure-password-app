import { invoke } from '@tauri-apps/api/core'
import { useState, useEffect } from 'react'
import { sendSavedNotification } from '../utils/notify'
type Props = {
  id: number
  name: string
}

export const LabelPassword = ({ id, name }: Props) => {
  const [label, setLabel] = useState(name)
  const [isEdit, setIsEdit] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const updateLabel = async () => {
      await invoke('update_name', { id, name: label })
    }
    if (!isEdit && !isLoading) {
      updateLabel()
      sendSavedNotification()
    }
    setIsLoading(false)
  }, [isEdit])

  return (
    <div className='d-flex align-items-center gap-2 w-100'>
      <button className='btn btn-sm' onClick={() => setIsEdit(!isEdit)}>
        {isEdit ? (
          <i className='bi bi-floppy link-success'></i>
        ) : (
          <i className='bi bi-pen'></i>
        )}
      </button>
      <input
        type='text'
        className='form-control form-control-sm'
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        disabled={!isEdit}
      />
    </div>
  )
}
