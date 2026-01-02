#[cfg(target_os = "windows")]
use windows::{
    // Добавляем BOOL в импорты
    Win32::Foundation::{BOOL, ERROR_SUCCESS, HWND},
    Win32::Graphics::Gdi::HBITMAP,
    Win32::Security::Credentials::{
        CREDUI_INFOW, CREDUIWIN_ENUMERATE_CURRENT_USER, CREDUIWIN_GENERIC,
        CredUIPromptForWindowsCredentialsW,
    },
    core::PCWSTR,
};

#[cfg(target_os = "windows")]
#[tauri::command]
pub async fn authenticate() -> Result<bool, String> {
    unsafe {
        let msg_text: Vec<u16> = "Подтвердите свою личность\0".encode_utf16().collect();
        let caption_text: Vec<u16> = "Аутентификация\0".encode_utf16().collect();

        let ui_info = CREDUI_INFOW {
            cbSize: std::mem::size_of::<CREDUI_INFOW>() as u32,
            hwndParent: HWND(0),
            pszMessageText: PCWSTR::from_raw(msg_text.as_ptr()),
            pszCaptionText: PCWSTR::from_raw(caption_text.as_ptr()),
            hbmBanner: HBITMAP(0),
        };

        let mut auth_package: u32 = 0;
        let mut credential_buffer: *mut std::ffi::c_void = std::ptr::null_mut();
        let mut credential_buffer_size: u32 = 0;

        // ИСПРАВЛЕНИЕ 1: Используем структуру BOOL вместо i32
        let mut save = BOOL(0);

        let flags = CREDUIWIN_GENERIC | CREDUIWIN_ENUMERATE_CURRENT_USER;

        // Вызываем функцию
        let result = CredUIPromptForWindowsCredentialsW(
            Some(&ui_info),
            0,
            &mut auth_package,
            None,
            0,
            &mut credential_buffer,
            &mut credential_buffer_size,
            Some(&mut save),
            flags,
        );

        if result == ERROR_SUCCESS.0 {
            Ok(true)
        } else {
            // result — это просто число (код ошибки), выводим его напрямую
            Err(format!("Аутентификация не пройдена (код: {})", result))
        }
    }
}

// Linux версия остается без изменений, она корректна
#[cfg(target_os = "linux")]
#[tauri::command]
pub async fn authenticate() -> Result<bool, String> {
    use std::process::Command;
    // ... ваш код для Linux ...
    let script = r#"#!/bin/bash
    echo "Аутентификация"
    pkexec --disable-internal-agent --user root true 2>&1
    exit $?
    "#;

    let output = Command::new("bash")
        .arg("-c")
        .arg(script)
        .output()
        .map_err(|e| e.to_string())?;

    Ok(output.status.success())
}
