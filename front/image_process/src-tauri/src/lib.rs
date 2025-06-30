// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn process_image(file_path: String) -> Result<String, String> {
    // 这里可以添加图片处理逻辑
    // 目前只是返回文件路径
    Ok(format!("Processing image: {}", file_path))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, process_image])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
} 