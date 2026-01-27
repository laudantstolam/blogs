---
title: IDA Pro + UV 虛擬環境解決方法
subtitle:
description: chatgpt said my env is like trashbin QQ
publish: true
tags:
featured_image:
created_date: 2026-01-28
---

chatgpt: Yeah… that Python folder is giving "I've installed everything since 2019 and never cleaned once" energy 😅 
me: QQ

---

## Original Env

```bash
C:\Users\***>uv python list
cpython-3.13.5-windows-x86_64-none    C:\Python313\python.exe
cpython-3.13.5-windows-x86_64-none    C:\ProgramData\chocolatey\bin\python3.13.exe
cpython-3.12.3-windows-x86_64-none    AppData\Local\Programs\Python\Python312\python.exe
cpython-3.10.10-windows-x86_64-none   AppData\Local\Programs\Python\Python310\python.exe
cpython-3.9.13-windows-x86_64-none    AppData\Local\Programs\Python\Python39\python.exe
cpython-3.7.9-windows-x86_64-none     AppData\Local\Programs\Python\Python37\python.exe
```

總之目前裡面有:
- choco 安裝的 3.13
- 從官網下載的 3.7.9 / 3.9.13 / 3.10.10 / 3.12.3
- 另外安裝的全域路徑 3.13.5

emmm...真的超亂 QQ

### Making Backups

```bash
C:\Python313\python.exe -m pip freeze > %USERPROFILE%\pip_313.txt

C:\Users\<USER_NAME>\AppData\Local\Programs\Python\Python312\python.exe -m pip freeze > %USERPROFILE%\pip_312.txt

C:\Users\<USER_NAME>\AppData\Local\Programs\Python\Python310\python.exe -m pip freeze > %USERPROFILE%\pip_310.txt
```

### Clean env

系統管理員可以把上面的東西都刪掉，剩下的可以參考[這篇](https://blog.csdn.net/wudinaniya/article/details/108547066)把 Windows 註冊的 Python 依賴拿掉。

清理完成後應該會顯示：
```
python --> 'python' 不是內部或外部命令、可執行的程式或批次檔。
```

---

## UV Taking Over

安裝 uv：
```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### uv 語法導讀

參考文章：https://blog.miniasp.com/post/2025/10/20/uv-uvx-cheatsheet

---

## 來把 IDA 直接替換成 UV venv 吧

### 基礎知識

- `idapyswitch.exe` 在 IDA 資料夾下面，用來切換 IDA Python 版本
- `idapythonrc.py` 在 `ida\python\examples` 裡面，是開啟 IDA 時會讀取用來設定環境的文件

官方建議作法：https://community.hex-rays.com/t/using-a-virtualenv-for-idapython/261

### Step 1: 下載 Python 3.12

```bash
uv python install 3.12
```

> [!info] 為什麼選 3.12？
> IDA Pro 9.x 官方推薦使用 Python 3.12，相容性最佳。3.13 目前部分套件支援度還不完整。

### Step 2 (optional): 設定預設 Python 版本

把 3.12 版本設定為之後創建 venv / 跑程式用的預設版本：

```bash
uv python pin 3.12
```

這會在當前目錄建立 `.python-version` 文件，之後在該目錄執行 uv 指令會自動使用指定版本。

### Step 3 (optional): 指定 IDA 使用的 Python 版本

這邊預設應該會直接指定到 3.12，因為我還有裝別的東西所以為了確認有重新指定一次：

```bash
C:\Users\<USER_NAME>\Downloads\IDA Professional 9.1>idapyswitch.exe

Checking installs from "Astral Software Inc."
Checking "CPython 3.12.12 (64-bit)" (3.12.12)
Found: "C:\Users\<USER_NAME>\AppData\Roaming\uv\python\cpython-3.12.12-windows-x86_64-none" (version: 3.12.12 ('3.12.12150.1013'))
Checking "CPython 3.9.25 (64-bit)" (3.9.25)
Found: "C:\Users\<USER_NAME>\AppData\Roaming\uv\python\cpython-3.9.25-windows-x86_64-none" (version: 3.9.25 ('3.9.25150.1013'))
IDA previously used: "C:\Users\<USER_NAME>\AppData\Roaming\uv\python\cpython-3.12.12-windows-x86_64-none\python312.dll" (guessed version: 3.12.12 ('3.12.12150.1013')). Making this the preferred version.
The following Python installations were found:
    #0: 3.12.12 ('3.12.12150.1013') (C:\Users\<USER_NAME>\AppData\Roaming\uv\python\cpython-3.12.12-windows-x86_64-none\python3.dll)
    #1: 3.9.25 ('3.9.25150.1013') (C:\Users\<USER_NAME>\AppData\Roaming\uv\python\cpython-3.9.25-windows-x86_64-none\python3.dll)
Please pick a number between 0 and 1 (default: 0)
```

### Step 4: IDA 環境處理

建立虛擬環境與安裝相關依賴：

```bash
# 建立虛擬環境
uv venv ida_uv_env --python 3.12

# 啟動虛擬環境
ida_uv_env\Scripts\activate

# 安裝依賴套件
uv pip install shims anytree yara-python keystone-engine openai flare-capa
```

### Step 5: 設定 idapythonrc.py

原本在 `ida\python\examples` 裡面，要複製到以下路徑才能讓 IDA 在開啟時讀取：

```
C:\Users\<USER_NAME>\AppData\Roaming\Hex-Rays\IDA Pro\idapythonrc.py
```

內容如下：

```python
import sys
import os

# UV venv 路徑
UV_ENV_PATH = r"C:\Users\<USER_NAME>\Downloads\IDA Professional 9.1\ida_uv_env"

# 將 UV venv 的 site-packages 加入 sys.path
site_packages = os.path.join(UV_ENV_PATH, "Lib", "site-packages")
if os.path.isdir(site_packages):
    sys.path.insert(0, site_packages)
else:
    print(f"[idapythonrc] UV env site-packages not found: {site_packages}")

# Optional: 將 DLLs 加入 PATH（避免 YARA / Keystone 找不到 DLL）
# 注意：UV venv 預設不會有 DLLs 資料夾，這段通常不會執行
# 但如果你手動複製了 DLL 檔案進去，這段可以確保它們被正確載入
dlls_path = os.path.join(UV_ENV_PATH, "DLLs")
if os.path.isdir(dlls_path):
    os.environ["PATH"] = f"{dlls_path};" + os.environ["PATH"]

print("[idapythonrc] Initialization complete")
```

---

## IDA Plugin 安裝

### IDA Pro MCP

```bash
py -3.13 -m pip install https://github.com/mrexodia/ida-pro-mcp/archive/refs/heads/main.zip
```

```bash
uv run python -m ida_pro_mcp --install
```

![image.png|350](https://raw.githubusercontent.com/Ash0645/image_remote/main/20260128003522.png)

### FindCrypt / YARA 常見問題

- 記得安裝 `yara-python` 不是 `yara`
- `libyara` 引入位置錯誤就開 Everything 重新複製到對的地方

![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20260128002500.png)

- 如果引入過程出現一些 bug 就把 yara 砍掉重裝
  - 參考：https://blog.csdn.net/qq_34905587/article/details/115264740
