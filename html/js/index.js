function display_alert(message) {
  // 显示模态窗口
  let modal = document.getElementById("alert-modal");
  let alert_message = document.getElementById("alert-modal-message");
  alert_message.innerText = message;
  modal.style.display = "block";
  // 当模态窗口的关闭按钮被点击时关闭模态窗口
  let close = document.getElementsByClassName("alert-modal-close-btn")[0];
  close.onclick = function () {
    modal.style.display = "none";
  }
}

let editFlag = 0; // 定义为全局变量
eel.expose(append_textarea);
function append_textarea(message) {
  let responseArea = document.getElementById('editor');
  responseArea.value += message;
  responseArea.dispatchEvent(new Event('input')); // 触发input事件
}

eel.expose(send_alert);
function send_alert(error_messages) {
  //alert(error_messages);
  display_alert(error_messages)
  setTimeout(function () { overlay.style.display = "none"; }, 500); // 隐藏加载界面（延时处理）
}

async function chat_gpt() {
  let select = document.getElementById("language");
  let selectedLanguage = select.options[select.selectedIndex].text;

  let text_inquiry = document.getElementById("inquiry");
  text_inquiry = text_inquiry.value;
  if (text_inquiry === "") {
    // 显示模态窗口
    display_alert("输入表单为空。")
    return;
  }
  let responseArea = document.getElementById('editor');
  responseArea.value = ""; // 清空textarea的内容
  editFlag = 0; // 每次调用chat_gpt函数都初始化
  let overlay = document.getElementById("overlay");
  overlay.style.display = "block"; // 显示加载界面
  await eel.chat_gpt(text_inquiry, selectedLanguage)();
  setTimeout(function () { overlay.style.display = "none"; }, 3000); // 隐藏加载界面（延时处理）
  // 显示下载链接
  let mindmapArea = document.getElementById("mindmap");
  mindmapArea.style.display = "block";
}

function download_map() {
  // 获取图片URL
  var imgUrl = document.getElementById("view").src;

  // 使用fetch下载图片
  fetch(imgUrl)
    .then(response => response.blob())
    .then(blob => {
      // 创建一个新的a元素来触发下载
      var downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = "mindmap.html";

      // 创建一个新的HTML文档
      var htmlDoc = document.implementation.createHTMLDocument();
      // 获取当前日期时间
      let current_datetime = new Date();
      let formatted_date = current_datetime.getFullYear().toString() + (current_datetime.getMonth() + 1).toString().padStart(2, '0') + current_datetime.getDate().toString().padStart(2, '0') + current_datetime.getHours().toString().padStart(2, '0') + current_datetime.getMinutes().toString().padStart(2, '0') + current_datetime.getSeconds().toString().padStart(2, '0') + current_datetime.getMilliseconds().toString().padStart(3, '0');

      // 将自定义的HTML代码添加到新文档中
      htmlDoc.documentElement.innerHTML = `
          <style>
              .memo-container {
                  display: inline-flex;
                  align-items: center;
                  padding: 10px;
                  background-color: #F5F5F5;
                  border-radius: 5px;
                  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
              }
              
              #memo {
                  min-width: 200px;
                  min-height: 100px;
                  width: 100%;
                  height: 100%;
                  padding: 10px;
                  border: none;
                  border-radius: 3px;
                  margin-right: 10px;
                  font-size: 16px;
                  color: #555;
                  flex: 1;
                  resize: both;
              }
              
              button {
                  background-color: #226af0;
                  color: white;
                  border: none;
                  border-radius: 3px;
                  font-size: 12px;
                  font-weight: bold;
                  cursor: pointer;
                  transition: background-color 0.3s ease;
                  padding: 5px 6px;
                  margin-left: 15px;
                  outline: none;
              }
              
              button:hover {
                  background-color: #484ada;
              }
          </style>
              
          <div class="memo-container">
              <textarea id="${formatted_date}" placeholder="添加备忘录" style="width: 400px; height: 150px;"></textarea>
              <button type="button" onclick="saveMemo('${formatted_date}')">保存备忘录</button>
          </div>
          <hr>
          <script>
              // 保存备忘录的函数
              function saveMemo(memoId) {
                  // 从文本框获取备忘录内容
                  var memo = document.getElementById(memoId).value;
                
                  // 将备忘录保存到本地存储
                  localStorage.setItem(memoId, memo);
                
                  // 显示保存完成的提示信息
                  alert("备忘录已保存。");
              }
              
              // 加载备忘录的函数
              function loadMemo(memoId) {
                  // 从本地存储中加载备忘录
                  var memo = localStorage.getItem(memoId);

                  // 在文本框中显示备忘录
                  document.getElementById(memoId).value = memo;
              }
              
              // 页面加载时加载备忘录
              window.onload = function() {
                  loadMemo('${formatted_date}');
              }
          <\/script>
          `;

      // 将图片追加到新文档
      var img = document.createElement("img");
      img.src = imgUrl;
      htmlDoc.body.appendChild(img);

      // 将新文档追加到a元素并触发下载
      downloadLink.href = URL.createObjectURL(new Blob([htmlDoc.documentElement.outerHTML], { type: "text/html" }));

      // 触发下载
      downloadLink.click();
    });
}
