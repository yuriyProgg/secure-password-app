import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification'

export const sendInfoNotification = async (body: string) => {
  // Do you have permission to send a notification?
  let permissionGranted = await isPermissionGranted()

  // If not we need to request it
  if (!permissionGranted) {
    const permission = await requestPermission()
    permissionGranted = permission === 'granted'
  }

  // Once permission has been granted we can send the notification
  if (permissionGranted) {
    sendNotification({
      title: 'Информация',
      body,
    })
  }
}

export const sendSavedNotification = async () => {
  await sendInfoNotification('Пароль успешно сохранен!')
}

export const sendCopiedNotification = async () => {
  await sendInfoNotification('Пароль успешно скопирован!')
}

export const sendDeletedNotification = async () => {
  await sendInfoNotification('Пароль успешно удален!')
}
