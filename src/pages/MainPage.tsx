import { invoke } from '@tauri-apps/api/core'
import { useState, useEffect } from 'react'
import { copyToClipboard } from '../utils'
import { sendCopiedNotification, sendSavedNotification } from '../utils/notify'

type DetailSettingsType = {
  lenght: number
  lower: boolean
  upper: boolean
  degits: boolean
  special: boolean
}

export const MainPage = () => {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [detailSettings, setDetailSettings] = useState<DetailSettingsType>({
    lenght: 12,
    lower: true,
    upper: true,
    degits: true,
    special: true,
  })

  const generateBasePassword = async () => {
    const password = await invoke('generate_base_password')
    setPassword(String(password))
  }
  const generateEditPassword = async () => {
    const password = await invoke('generate_edit_password', {
      length: detailSettings.lenght,
      lower: detailSettings.lower,
      upper: detailSettings.upper,
      degits: detailSettings.degits,
      special: detailSettings.special,
    })
    setPassword(String(password))
  }

  useEffect(() => {
    generateBasePassword()
  }, [])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await invoke('save_password', { name, password })
    console.log('submit')
  }
  return (
    <form onSubmit={onSubmit}>
      <h3 className='mt-5'>Генератор паролей</h3>
      <div className='form-floating mb-3'>
        <input
          type='text'
          className='form-control'
          id='floatingInput'
          placeholder='Название пароля'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor='floatingInput'>Название пароля</label>
      </div>
      <div className='form-floating'>
        <input
          type='text'
          className='form-control'
          id='floatingPassword'
          placeholder='Password'
          disabled
          value={password}
        />
        <label htmlFor='floatingPassword'>Пароль</label>
      </div>
      <div className='d-flex mt-3 mb-5 gap-3'>
        <button
          type='button'
          className='btn btn-primary d-flex align-items-center gap-1'
          onClick={isEdit ? generateEditPassword : generateBasePassword}
        >
          <i className='bi bi-dice-5'></i>
          Генерировать
        </button>
        <button
          type='button'
          className='btn btn-primary d-flex align-items-center gap-1'
          onClick={() => {
            copyToClipboard(password)
            sendCopiedNotification()
          }}
        >
          <i className='bi bi-clipboard-data'></i>
          Копировать
        </button>
        <button
          type='submit'
          className='btn btn-success d-flex align-items-center gap-1'
          onClick={() => sendSavedNotification()}
        >
          <i className='bi bi-floppy'></i>
          Сохранить
        </button>
      </div>

      <div className='form-check mb-4'>
        <input
          className='form-check-input'
          type='checkbox'
          id='checkDefault'
          value={String(isEdit)}
          onChange={(e) => setIsEdit(e.target.checked)}
        />
        <label className='form-check-label' htmlFor='checkDefault'>
          <b>Расширеные настройки</b>
        </label>
      </div>
      <div className='form-floating mb-3'>
        <input
          type='number'
          className='form-control'
          id='floatingInput'
          placeholder='Длина пароля'
          disabled={!isEdit}
          value={detailSettings.lenght}
          onChange={(e) =>
            setDetailSettings({
              ...detailSettings,
              lenght: Number(e.target.value),
            })
          }
        />
        <label htmlFor='floatingInput'>Длина пароля</label>
      </div>
      <div className='form-check'>
        <input
          className='form-check-input'
          type='checkbox'
          id='lower'
          disabled={!isEdit}
          checked={detailSettings.lower}
          onChange={(e) =>
            setDetailSettings({ ...detailSettings, lower: e.target.checked })
          }
        />
        <label className='form-check-label' htmlFor='lower'>
          Содержать строчные буквы
        </label>
      </div>
      <div className='form-check'>
        <input
          className='form-check-input'
          type='checkbox'
          id='upper'
          disabled={!isEdit}
          checked={detailSettings.upper}
          onChange={(e) =>
            setDetailSettings({ ...detailSettings, upper: e.target.checked })
          }
        />
        <label className='form-check-label' htmlFor='upper'>
          Содержать прописные буквы
        </label>
      </div>
      <div className='form-check'>
        <input
          className='form-check-input'
          type='checkbox'
          id='degits'
          disabled={!isEdit}
          checked={detailSettings.degits}
          onChange={(e) =>
            setDetailSettings({ ...detailSettings, degits: e.target.checked })
          }
        />
        <label className='form-check-label' htmlFor='degits'>
          Содержать цифры
        </label>
      </div>
      <div className='form-check'>
        <input
          className='form-check-input'
          type='checkbox'
          id='special'
          disabled={!isEdit}
          checked={detailSettings.special}
          onChange={(e) =>
            setDetailSettings({ ...detailSettings, special: e.target.checked })
          }
        />
        <label className='form-check-label' htmlFor='special'>
          Содержать специальные символы
        </label>
      </div>
    </form>
  )
}
