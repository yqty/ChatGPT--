function display_alert(message, title) {
    // 显示模态窗口
    let modal = document.getElementById("alert-modal");
    let alert_message = document.getElementById("alert-modal-message");
    let alert_title = document.getElementById("alert-modal-title");
    alert_title.innerText = title;
    alert_message.innerText = message;
    modal.style.display = "block";
    // 当模态窗口的关闭按钮被点击时关闭模态窗口
    let close = document.getElementsByClassName("alert-modal-close-btn")[0];
    close.onclick = function () {
        modal.style.display = "none";
    }
}

async function loadApiKey() {
    const api_key = await eel.get_api_key()();
    document.getElementById("usernameValidate").value = api_key;
}
loadApiKey();

async function saveApiKey() {
    const api_key = document.getElementById("usernameValidate").value;
    if (api_key.trim() === "") {
        //alert("API键未输入。");
        display_alert("API键未输入。", "警告消息")
        return;
    }
    await eel.save_api_key(api_key)();
    display_alert("API键已保存。", "完成消息");
}
eel.expose(append_alert);
function append_alert(message) {
    //document.getElementById("usernameValidate").value = message;


}
