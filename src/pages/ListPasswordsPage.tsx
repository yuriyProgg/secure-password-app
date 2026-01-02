import { invoke } from '@tauri-apps/api/core'
import { useState, useEffect } from 'react'
import { Spoiler } from 'spoiled'
import { copyToClipboard } from '../utils'
import { LabelPassword } from '../components/LabelPassword'
import {
	sendCopiedNotification,
	sendDeletedNotification,
} from '../utils/notify'

type PasswordType = {
	id: number
	name: string
	password: string
}

export const ListPasswordsPage = () => {
	const [passwords, setPasswords] = useState<PasswordType[]>([])

	useEffect(() => {
		const fetchData = async () => {
			const data = await invoke<PasswordType[]>('list_passwords')
			setPasswords(data)
		}
		fetchData()
	}, [])

	return (
		<div>
			<h3 className='my-4 text-center'>Список паролей</h3>
			<ul className='list-group list-group-flush gap-3'>
				{passwords.map((password) => (
					<li key={password.id} className='list-group-item'>
						<div className='d-flex align-items-center gap-2 mb-2'>
							<LabelPassword id={password.id} name={password.name} />

							<button
								className='btn btn-success btn-sm ms-auto'
								onClick={() => {
									copyToClipboard(password.password)
									sendCopiedNotification()
								}}
							>
								<i className='bi bi-clipboard-data'></i>
							</button>

							<button
								className='btn btn-danger btn-sm'
								onClick={async () => {
									await invoke('delete_password', { id: password.id })
									// Обновляем список после удаления
									setPasswords((prev) =>
										prev.filter((p) => p.id !== password.id),
									)
									await sendDeletedNotification()
								}}
							>
								<i className='bi bi-trash'></i>
							</button>
						</div>
						<div className='w-100 d-flex align-items-center gap-3'>
							<i
								className='bi bi-key-fill pb-3'
								style={{ rotate: '45deg' }}
							></i>
							<div className='w-100 overflow-auto pb-3'>
								<Spoiler revealOn='click'>{password.password}</Spoiler>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}
