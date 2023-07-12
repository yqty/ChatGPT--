import sys

# pyinstaller --noconsole error handling
# outfile = open("logfile.txt", "wt")
# sys.stderr = outfile
# sys.stdout = outfile

import eel
import openai
import os
import settings


if not os.path.exists("config"):
    os.makedirs("config")


# EEL应用程序的名称
app_name = "html"
# EEL应用程序的入口点
end_point = "index.html"
# EEL应用程序的窗口大小
size = (1000, 800)


# 使Python函数可以从EEL调用的装饰器
@eel.expose
def chat_gpt(question, language):
    # 设置OpenAI API密钥
    openai.api_key = get_api_key()
    # 如果需要代理，请设置
    # openai.proxy = {
    # "http":"http://10.10.10.1:80",
    # "https":"http://10.10.10.1:80"
    # }

    if openai.api_key is None:
        raise ValueError("OPENAI_API_KEY未在.env文件中设置。")

    question = (
        question + "\n" + settings.UML_PROMPT.replace("[selected_language]", language)
    )

    # 向GPT-3.5提出问题并接收响应
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            max_tokens=3024,
            stream=False,
            messages=[
                {"role": "user", "content": question},
            ],
        )
    except openai.error.AuthenticationError as error:
        error_messages = """发生错误：\n请检查API密钥是否正确。"""
        eel.send_alert(error_messages)()
        return ""
    except Exception as e:
        error_messages = str(e)
        eel.send_alert(error_messages)()
        return ""

    content = response["choices"][0]["message"]["content"]
    print("content=", content)
    if content[0:13] == "@startmindmap" and content[-11:] == "@endmindmap":
        content = content.replace(
            "@startmindmap", "@startmindmap\n" + f"{settings.STYLE_SETTING}" + "\n"
        )
        eel.append_textarea(content)()
    else:
        index = content.find("@startmindmap")
        if index != -1:
            substring = content[:index]
            error_messages = "无法创建思维导图。\n" + substring
        else:
            error_messages = "无法创建思维导图。\n" + content
        eel.send_alert(error_messages)()


@eel.expose
def get_api_key():
    api_key_path = os.path.join(os.getcwd(), "config", "api_key.txt")
    if os.path.exists(api_key_path):
        with open(api_key_path, "r") as f:
            return f.read()
    else:
        return ""


@eel.expose
def save_api_key(api_key):
    api_key_path = os.path.join(os.getcwd(), "config", "api_key.txt")
    with open(api_key_path, "w") as f:
        f.write(api_key)


eel.init("html")
eel.start("index.html", size=size)
