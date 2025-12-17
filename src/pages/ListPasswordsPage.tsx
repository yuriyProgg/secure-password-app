'use client'
import { invoke } from '@tauri-apps/api/core'
import { useState, useEffect } from 'react'
import { Spoiler } from 'spoiled'
import { copyToClipboard } from '../utils'

type PasswordType = {
	id: number
	name: string
	password: string
}

export const ListPasswordsPage = () => {
	const [passwords, setPasswords] = useState<PasswordType[]>([])

	useEffect(() => {
		invoke<PasswordType[]>('list_passwords').then((passwords) => {
			console.log(passwords)
			setPasswords(passwords)
		})
	}, [])
	return (
		<div>
			<h3 className='mt-5 mb-3'>Список паролей</h3>
			<ul className='list-group list-group-flush'>
				{passwords.map((password) => (
					<li
						className='list-group-item d-flex justify-content-between align-items-center'
						key={password.id}
					>
						<div className='ms-2'>{password.name}</div>
						<button
							type='button'
							className='btn btn-success btn-sm'
							onClick={() => {
								copyToClipboard(password.password)
								alert('Пароль скопирован в буфер обмена')
							}}
						>
							Копировать
						</button>
						<button
							type='button'
							className='btn btn-danger btn-sm'
							onClick={() => invoke('delete_password', { id: password.id })}
						>
							Удалить
						</button>
						<Spoiler>
							{invoke('get_password', { id: password.id }).then((r) =>
								String(r),
							)}
						</Spoiler>
					</li>
				))}
			</ul>
		</div>
	)
}
