window.addEventListener('DOMContentLoaded', function () {
    let md = document.getElementById('editor');

    // 指示当前正在编辑的标志
    let editFlag = 0;

    // 获取PlantUML的URL
    let getURL = (sauce) => {
        return "http://www.plantuml.com/plantuml/svg/" + plantumlEncoder.encode(sauce);
    };
    // 检测到有更新事件发生
    let editDetection = (e) => {
        if (editFlag) clearTimeout(editFlag);
        editFlag = 0;
    };
    // 检测到undo, redo事件
    let undoRedoDetection = (e) => {
        if (e.ctrlKey && ['z', 'y'].includes(e.key)) {
            editDetection(e);
            applyingUpdate(e);
        }
    };
    // 应用更新
    let applyingUpdate = (e) => {
        // 允许Backspace和Delete键的输入(字符键+Enter键在keypress事件中获取)
        if (!editFlag || editFlag >= 1 && editFlag <= 4294967295 || e.keyCode == 46 || e.keyCode == 8) {
            editFlag = setTimeout(() => {
                document.getElementById('view').src = getURL(document.getElementById('editor').value);
            }, 1000);
        }
    };
    md.addEventListener('input', applyingUpdate); // 捕捉input事件并执行applyingUpdate函数
    md.addEventListener('keypress', editDetection);
    md.addEventListener('paste', editDetection);
    md.addEventListener('cut', editDetection);
    md.addEventListener('keydown', undoRedoDetection);
    md.addEventListener('keyup', applyingUpdate);
});
