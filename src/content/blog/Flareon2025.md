---
title: Flare-on 2025 Writeup
subtitle:
description: 我好菜不會逆向QQ
publish: true
tags:
  - writeup
  - reverse
featured_image:
created_date: 2025-10-26
---

| <font color="#c0504d">total</font> | Reverse | Pwn | Web | Crypto | Misc/Forensic |
| :--------------------------------- | :------ | :-- | :-- | :----- | :------------ |
|                                    | V       |     |     |        |               |

| challenge | difficulty | genere        | GPT-able |
| :-------- | :--------- | ------------- | -------- |
| 01        | 💔         | pygame        | V        |
| 02        | 💔         | python opcode | V        |
| 03        | 💔         | pdf misc      | V        |
| 04        | 💔         | header repair | 0.5+通靈   |
| 05(進度70%) | 💔💔💔     | dbg and abs   | 0.2?     |
| 06        | tbc        |               |          |
| 07        | tbc        |               |          |
| 08        | tbc        |               |          |


上課上到一半被autong抓來打flare-on
這是google secure team每年會出的CTF題目 體感每一題都是可以延伸然後學到一些實用知識的酷題目
今年第一次打 感覺很有趣 學到很多不一樣的rev技巧

![image.png|300](https://raw.githubusercontent.com/Ash0645/image_remote/main/20251025123338.png)
:D

## Reverse
### 01

是一個酷酷Pygame, 往下鑽會鑽到flag的概念w
>[!quote]+ challenge
>![image.png|300](https://raw.githubusercontent.com/Ash0645/image_remote/main/20251025124037.png)
>
>```python
>def GenerateFlagText(sum):
>    key = sum >> 8
>    encoded = "\xd0\xc7\xdf\xdb\xd4\xd0\xd4\xdc\xe3\xdb\xd1\xcd\x9f\xb5\xa7\xa7\xa0\xac\xa3\xb4\x88\xaf\xa6\xaa\xbe\xa8\xe3\xa0\xbe\xff\xb1\xbc\xb9"
>    plaintext = []
>    for i in range(0, len(encoded)):
>        plaintext.append(chr(ord(encoded[i]) ^ (key+i)))
>    return ''.join(plaintext)
>
>```
>
>有個驗證flag的func，傳入的東西是每次鑽到熊的時候的x值 (`Loc`)
>```python
>if player.hitBear():
>                player.drill.retract()
>                bear_sum *= player.x
>                bear_mode = True
>
>if bear_mode:
>	screen.blit(bearimage, (player.rect.x, screen_height - tile_size))
>	if current_level == len(LevelNames) - 1 and not victory_mode:
>		victory_mode = True
>		flag_text = GenerateFlagText(bear_sum)
>		print("Your Flag: " + flag_text)
>```
>熊會出現在`X=len(LevelNames[current_level])`的地方
>`LevelNames`分別是 `['California','Ohio','Death Valley','Mexico','The Grand Canyon']`

>[!slove]+ solution
>所以就把length乘過去丟到`GenerateFlag`就好
>```python
>## copy paste from src code
>def GenerateFlagText(sum_value):
>    key = sum_value >> 8
>    encoded = "\xd0\xc7\xdf\xdb\xd4\xd0\xd4\xdc\xe3\xdb\xd1\xcd\x9f\xb5\xa7\xa7\xa0\xac\xa3\xb4\x88\xaf\xa6\xaa\xbe\xa8\xe3\xa0\xbe\xff\xb1\xbc\xb9"
>    plaintext = []
>    for i in range(len(encoded)):
>        plaintext.append(chr(ord(encoded[i]) ^ (key + i)))
>    return "".join(plaintext)
>
>bear_sum = 1
>
>for name in ["California", "Ohio", "Death Valley", "Mexico", "The Grand Canyon"]:
>    bear_sum *= len(name)
>
>print(GenerateFlagText(bear_sum))
>```

### 02

pyc 相關解壓縮
>[!quote]+ challenge
>
>`encrypted_sequencer_data` -> zlib解壓 -> marshel執行
>(`marshal`是python用來讀寫`pyc`的工具，將 `.py` → `.pyc`、或還原成可執行物件)
>```python
>import zlib
>import marshal
>
># These are my encrypted instructions for the Sequencer.
>encrypted_sequencer_data = b'x\....'
>
>print(f"Booting up {f"Project Chimera"} from Dr. Khem's journal...")
># Activate the Genetic Sequencer. From here, the process is automated.
>sequencer_code = zlib.decompress(encrypted_sequencer_data)
>
>### (EXTRACT sequencer_code)
>### print(sequencer_code)
>
>exec(marshal.loads(sequencer_code))
>```
>
>然後 `sequencer_code`的結構如下
>```
>(HEADER)
>b"\xe3\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x05\x00\x00\x00...
>
>(BYTE CODE)
>c$|e+O>7&-6`m!Rzak~llE|2<;!(^*VQn#qEH||......
>
>(LOAD_CONST)
>--- Calibrating Genetic Sequencer ---....
>
>(METADATA)
>```
>那一大坨裡面有一些小線索(`LOAD_CONST`的內容)
>```pyc
>--- Calibrating Genetic Sequencer ---
>z\x1fDecoding catalyst DNA strand...
>z\x1eSynthesizing Catalyst Serum...)
>\x0f\xda\x06base64
>\xda\x04zlib
>\xda\x07marshal
>\xda\x05types
>\xda\x17encoded_catalyst_strand
>\xda\x05print
>\xda\tb85decode
>\xda\x13compressed_catalyst
>\xda\ndecompress
>\xda\x17marshalled_genetic_code
>\xda\x05loads
>\xda\x14catalyst_code_object
>\xda\x0cFunctionType
>\xda\x07globals
>\xda\x1bcatalyst_injection_function\xa9\x00\xf3\x00\x00\x00\x00\xfa\x13<genetic_sequencer>\xda\x08<module>
>```
>
>邏輯看起來是`base64`-> `zlib`->`marshal`->`encoded_catalyst_strand()` -> `base85` -> `zlib` -> `marshal`
>((補充一下`types.FunctionType`是用來將 code object 包裝成 callable 函數))

>[!slove]+ solution
>逆推回去，先是第一層base85跟zlib的
>
>```python
>import base64
>import zlib
>import marshal
>
>encoded = "c$|e+O>7....Hooz%"
>decoded = base64.b85decode(encoded)
>decompressed = zlib.decompress(decoded)
>code = marshal.loads(decompressed)
># print(decompressed) --> 基本上這個丟到GPT就可以三秒解完了
>dis.dis(code)
>```
>
>這邊執行下去會噴錯: `IndexError: tuple index out of range`, 問了一下GPT說是py 3.13反組譯舊版本時候的格式錯誤 用`3.12`就可了
>
>看了一下組譯出的東西
>```python
> 16           6 LOAD_CONST               1 (b'm\x1b@I\x1dAoe@\x07ZF[BL\rN\n\x0cS')
>              8 STORE_FAST               0 (LEAD_RESEARCHER_SIGNATURE)
>
> 17          10 LOAD_CONST               2 (b'r2b-\r\x9e\xf2\x1fp\x185\x82\xcf\xfc\x90\x14\xf1O\xad#]\xf3\xe2\xc0L\xd0\xc1e\x0c\xea\xec\xae\x11b\xa7\x8c\xaa!\xa1\x9d\xc2\x90')
>             12 STORE_FAST               1 (ENCRYPTED_CHIMERA_FORMULA)
>```
>
>上面的東西會用來呼叫`usersignerture`進行XOR後驗證
>
>```python
> 25         126 LOAD_GLOBAL              9 (NULL + bytes)
>            136 LOAD_CONST               5 (<code object <genexpr> at 0x000002A0BC7A4830, file "<catalyst_core>", line 25>)
>            138 MAKE_FUNCTION            0
>            140 LOAD_GLOBAL             11 (NULL + enumerate)
>            150 LOAD_FAST                2 (current_user)
>            152 CALL                     1
>            160 GET_ITER
>            162 CALL                     0
>            170 CALL                     1
>            178 STORE_FAST               3 (user_signature)
>```
>
>```python
>20 LOAD_FAST                2 (c)
>22 LOAD_FAST                1 (i)
>24 LOAD_CONST               0 (42)
>26 BINARY_OP                0 (+)
>30 BINARY_OP               12 (^)
>```
>
>對應python`user_signature = bytes(c ^ (i + 42) for i, c in enumerate(current_user))`
>
>最後對 `current_user` 進行ARC4加密
>```python
> 37         354 LOAD_GLOBAL             21 (NULL + ARC4)
>            364 LOAD_FAST                2 (current_user)
>            366 CALL                     1
>            374 STORE_FAST               5 (arc4_decipher)
>```
>
>sol:
>`user --XOR--> signature` 所以 `signature --XOR--> user `
>```python
>from arc4 import ARC4
>
>LEAD_RESEARCHER_SIGNATURE = b"m\x1b@I\x1dAoe@\x07ZF[BL\rN\n\x0cS"
>ENCRYPTED_CHIMERA_FORMULA = b"r2b-\r\x9e\xf2\x1fp\x185\x82\xcf\xfc\x90\x14\xf1O\xad#]\xf3\xe2\xc0L\xd0\xc1e\x0c\xea\xec\xae\x11b\xa7\x8c\xaa!\xa1\x9d\xc2\x90"
>
>## XOR current user
>username = bytes(c ^ (i + 42) for i, c in enumerate(LEAD_RESEARCHER_SIGNATURE))
>print(username)
>print(ARC4(username).decrypt(ENCRYPTED_CHIMERA_FORMULA))
>```

>[!note]+ 延伸
>在寫WP的時候多看了一下python的opcode結構(就是marshal出來的pyc檔案)
>參考了這篇文章: [利用OpCode绕过Python沙箱 - 先知社区](https://www.buaq.net/go-9664.html)
>
>可以用`dis.dis()`來解構pyc
>以這題為例，用`dis.dis(marshal.loads(b"..."))`會拿到
>```
>  0           BINARY_OP                0 (+)
>              POP_JUMP_IF_TRUE         1 (to L1)
>              LOAD_FROM_DICT_OR_GLOBALS 0 (base64)
>
>  3   L1:     POP_JUMP_IF_TRUE         0 (to L2)
>      L2:     STORE_ATTR               1 (zlib)
>              LOAD_FROM_DICT_OR_GLOBALS 2 (marshal)
>
>  5           POP_JUMP_IF_TRUE         0 (to L3)
>      L3:     STORE_ATTR               3 (types)
>              RAISE_VARARGS            5
>              POP_JUMP_IF_TRUE         3 (to L4)
> ...
> ```
> 然後可以去做進一步的分析

### 03

pdf misc
>[!quote]+ challenge
>拿到一個pdf 去看了一下string
>
>```
>%PDF-2.0
>%SNDHNRO0
>RE~^
>% Hey there! Welcome to this source...
>% Tested under the following browsers:
>% Chrome, Safari, PDFjs (Firefox)
>1       0       obj     <<
>% N0t_a_flag_but_just_a_line_comment
>/Pages  2       0       R/Type/Catalog/Extensions       <</ADBE <</BaseVersion/1.7/ExtensionLevel       8>>>>>>endobj
>% 2 0 obj
>% <<>>
>% endobj
>3 0 obj
>  /Contents 4 0 R
>  /Parent 2 0 R
>  /Resources 6 0 R
>  /Type /Page
>  /MediaBox [0 0 612 130] 
>endobj
>2 0 obj
>  /Count 1
>  /Kids [
>    3 0 R
>  /Type /Pages
>endobj
>% 2 0 obj
>% <<>>
>% endobj
>4 0 obj
><</Length 320/Filter /FlateDecode>>stream
>...
>```
>`/Pages  2 0 R` 這些地方看起來像是pdf pages 的壓縮

>[!note]+ notes
> 邏輯是
> 1. 先解pdf壓縮的東西
> 2. 然後看strings 看到一串ffd8ffe00... 轉換成jpeg 
> 3. 然後發現好像哪裡不對 是一坨東西而且exiftool說他是`1*37`的圖片
> 4. 就把相素提取出來換成ASCII
>
>
>```bash
>┌──(kali㉿kali)-[/media/sf_SHARED_FILE/flareon/03]
>└─$ qpdf --qdf --object-streams=disable pretty_devilish_file.pdf step1.pdf
>```
>
>再次strings
>```
>%PDF-2.0
>%QDF-1.0
>%% Original object ID: 1 0
>1 0 obj
><SNIP>
>2 0 obj
><SNIP>
>3 0 obj
><SNIP>
>4 0 obj
><SINP>
>ffd8ffe000104a46494600010100000100010000ffdb00430001010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101ffc0000b080001002501011100ffc40017000100030000000000000000000000000006040708ffc400241000000209050100000000000000000000000702050608353776b6b7030436747577ffda0008010100003f00c54d3401dcbbfb9c38db8a7dd265a2159e9d945a086407383aabd52e5034c274e57179ef3bcdfca50f0af80aff00e986c64568c7ffd9
><SNIP>
>(Flare-On!)'
>endstream
><SNIP>
>%%EOF
>```
>在第四個地方看到了ffd8...ffd9 一看就是JPEG
>後面用exiftool 觀察
>```
>Encoding Process                : Baseline DCT, Huffman coding
>Image Size                      : 37x1
>```
>
>看一下pixels裡面的東西 感覺很ascii 於是就通靈出來了(
>```python
>from PIL import Image
>
>img = Image.open('extracted.jpg')
>pixels = list(img.getdata())
>
>### print(pixels)
>## [80, 117, 122, 122, 108, 49, 110, 103, 45, 68, 51, 118, 105, 108, 105, 115, 104, 45, 70, 48, 114, 109, 97, 116, 64, 102, 108, 97, 114, 101, 45, 111, 110, 46, 99, 111, 109]
>
>ascii_str = ''.join(chr(p) for p in pixels)
>print(ascii_str)
>```
>

又是屬於通靈仔的勝利(
到這邊差不多過了30分鐘 然後後面開始一直通靈失敗QQ
### 04

這題其實很水(
其實好像五分鐘就做完了但是一直差最後一部所以跑去逆向twinbasic的東西花了一天🤡

>[!quote]+ challenge
>#### 修復檔案
>xxd 先看下發現他是 開頭是`15 5A`的EXE 所以要改成標準的header `4d 5a`
>`printf '\x4D' | dd of=UnholyDragon-150.exe bs=1 seek=0 count=1 conv=notrunc`
>這樣就正常了
>#### 調查結構(這邊可以跳過 純純小丑過程)
>然後開DIE看到
>`(Heur)Packer: Compressed or packed data[High entropy + Section 1 (".data") compressed]`
>然後因為執行下去會出現151.exe ~ 154.exe 所以懷疑了一下是多層嵌套的exe
>
>用這邊來看MZ或是PE 的檔案結構
>MZ開頭是4D5A -> `grep -aobP $'\x4d\x5a' UnholyDragon-150.exe`
>PE開頭是450045 -> `grep -aobP $'\x50\x45\x00\x00' UnholyDragon-150.exe`
>
>看到了很多感覺是壓縮進去的東西
>後面直接去逆向觀察發現他是一個twinBasic的東西(提取的ICON也長一樣)
>
>(( 但好像這樣就可以看到了 真的是小丑:(
>```xml
>┌──(kali㉿kali)-[/media/sf_SHARED_FILE/flareon/04/origional]
>└─$ tail -c 2000 ../UnholyDragon-150.exe | strings
><?xml version="1.0" encoding="UTF-8" standalone="yes"?>
><assembly xmlns="urn:schemas-microsoft-com:asm.v1" manifestVersion="1.0">
>   <assemblyIdentity
>      type="win32"
>      processorArchitecture="*"
>      name="My_twinBASIC_Application"
>      version="1.0.0.0"
>   />
></assembly>
>```
>裡面逆進去是一些自解壓的邏輯和經過混淆的很多func
>(下略N小時的逆向時間)

>[!note]+ solution
>**TL;DR autong提示說玩一玩就有flag了**
>想說在唬爛吧 然後他叫我看看檔案名稱
>
>終於動念去把`UnholyDragon-150.exe`->`UnholyDragon.exe`
>就跑出了1-154 差點把虛擬機搞沒
>其中126-148都有在執行
>但是150一樣開頭壞掉
>(到這邊我還想說還是應該再逆一下嗎) (下略N小時逆向妙妙屋)
>
>但其實一樣修一下開頭重新執行就有了flag了
>但是中間學到了一些解壓縮的方法跟twinbasic語法 蠻好玩的 耶

### 05

>[!quote]+ challenge
>>I'm not here to tell you how to do your job or anything, given that you are a top notch computer scientist who has solved four challenges already, but NTFS is in the filename. Maybe, I don't know, run it in windows on an NTFS file system?
>
>strings 看到一些有趣的東西
>```
>D:\a\_work\1\s\binaries\amd64ret\inc\optional
>D:\a\_work\1\s\src\vctools\crt\vcruntime\src\eh\std_type_info.cpp
>D:\a\_work\1\s\src\vctools\crt\vcruntime\src\internal\per_thread_data.cpp
>minkernel\crts\ucrt\src\appcrt\misc\dbgrpt.cpp
>minkernel\crts\ucrt\src\appcrt\stdio\_file.cpp
>https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ
>C:\\Users\\flare\\Desktop\\challenge\\main.pdb
>```
>
>又是瑞克搖 ==
>但最後那個感覺是要修pdb
>然後題目提示是跟ntfs相關的東西
>
>#### NTFS stream
>然後另外去找了一下ntfs相關的背景知識還有之前AIS3馬師講到的再stream裡面藏東西的evade方法筆記
>```
>Get-Item -Path .\ntfsm.exe -Stream *                                               15:59:45
>
>PSPath        : Microsoft.PowerShell.Core\FileSystem::C:\flareon\05\ntfsm.exe::$DATA
>PSParentPath  : Microsoft.PowerShell.Core\FileSystem::C:\flareon\05
>PSChildName   : ntfsm.exe::$DATA
>FileName      : C:\flareon\05\ntfsm.exe
>Stream        : :$DATA
>Length        : 20151296
>
>PSPath        : Microsoft.PowerShell.Core\FileSystem::C:\flareon\05\ntfsm.exe:input
>PSParentPath  : Microsoft.PowerShell.Core\FileSystem::C:\flareon\05
>PSChildName   : ntfsm.exe:input
>Stream        : input
>Length        : 16
>
>PSPath        : Microsoft.PowerShell.Core\FileSystem::C:\flareon\05\ntfsm.exe:positi
>                on
>PSParentPath  : Microsoft.PowerShell.Core\FileSystem::C:\flareon\05
>PSChildName   : ntfsm.exe:position
>Stream        : position
>Length        : 8
>
>PSPath        : Microsoft.PowerShell.Core\FileSystem::C:\flareon\05\ntfsm.exe:state
>PSParentPath  : Microsoft.PowerShell.Core\FileSystem::C:\flareon\05
>PSChildName   : ntfsm.exe:state
>Stream        : state
>Length        : 8
>
>PSPath        : Microsoft.PowerShell.Core\FileSystem::C:\flareon\05\ntfsm.exe:transi
>                tions
>PSParentPath  : Microsoft.PowerShell.Core\FileSystem::C:\flareon\05
>PSChildName   : ntfsm.exe:transitions
>Stream        : transitions
>Length        : 8
>```
>跟前面靜態逆出來的幾個關鍵參數有對上

>[!note]+ solution
>### 靜態分析主要函數
>看到string裡面有個`input 16 characters`的檢查，順藤摸瓜找到主要的比較函式
>- `sub_14000c0b0`: 裡面依序設定了4個map: `state, input, position, transitions`
>- 逐字元讀取並設定`state`
>- 參考`jump table` (0x000140ca3b) 讀取出要比較的目標
>	- **中間卡在這邊不知道怎麼去定位到具體的比較目標以及選項之間的樹狀關係**
>- table會根據state進入不同的分支然後進行對應的字元比較並寫入新的state
>-  把state寫入 NTFS ADS (sub_140FF1190)
>- 執行shellcode 跑 create subprocess
>	-  沒搞好會登出電腦重開機QQ
>- 如果一連串都是對的會去跑flag的func`sub_14000b2a0`(但是首先還是需要知道那個16bits
>```mermaid
>flowchart TD
>    A[用戶執行程式] --> B[讀取 NTFS ADS]
>    B --> C{第一次執行？}
>    C -->|是| D[初始化]
>    D --> E[exit]
>
>    C -->|否| F{position < 16？}
>    
>    F -->|Yes| G[繼續處理]
>    G --> H[跳轉表查找]
>    H --> I[state → 查表 → 代碼地址]
>    I --> J[跳轉到該地址]
>    J --> K[執行狀態處理代碼]
>    K --> L{字元匹配？}
>
>    L -->|Yes| M[新狀態，transitions++]
>    L -->|No| N[ShellExecuteA → 進程爆炸]
>
>    M --> O[position++]
>    O --> P[更新 ADS]
>    P --> Q[exit 0]
>
>    F -->|No| R[檢查完成]
>    R --> S{transitions == 16？}
>    S -->|Yes| T["correct!" → exit 0]
>    S -->|No| U["wrong!" → exit 1]
>```
>
>>[!example]+ 舉第一個字元比較的例子
>>舉個例子第一個字的比較會是case 0
>>`jumptable 000000014000CA5A ` 然後進去比較J/U/i三個不同的分支 
>>```c
>>.text:0000000140860241 loc_140860241:                          ; CODE XREF: sub_14000C0B0+9AA↑j
>>.text:0000000140860241 rdtsc                                   ; jumptable 000000014000CA5A case 0
>>.text:0000000140860243 shl     rdx, 20h
>>.text:0000000140860247 or      rax, rdx
>>.text:000000014086024A mov     [rsp+59398h+var_680], rax
>>.text:0000000140860252
>>
>>.text:0000000140860252 loc_140860252:                          ; CODE XREF: sub_14000C0B0+8541CF↓j
>>.text:0000000140860252 rdtsc
>>.text:0000000140860254 shl     rdx, 20h
>>.text:0000000140860258 or      rax, rdx
>>.text:000000014086025B mov     [rsp+59398h+var_678], rax
>>.text:0000000140860263 mov     rax, [rsp+59398h+var_680]
>>.text:000000014086026B mov     rcx, [rsp+59398h+var_678]
>>.text:0000000140860273 sub     rcx, rax
>>.text:0000000140860276 mov     rax, rcx
>>.text:0000000140860279 cmp     rax, 12AD1659h
>>.text:000000014086027F jl      short loc_140860252
>>.text:0000000140860281 movzx   eax, [rsp+59398h+var_59368]
>>.text:0000000140860286 mov     [rsp+59398h+var_1D80C], al
>>.text:000000014086028D cmp     [rsp+59398h+var_1D80C], 4Ah ; 'J'
>>.text:0000000140860295 jz      short loc_1408602CE
>>.text:0000000140860297 cmp     [rsp+59398h+var_1D80C], 55h ; 'U'
>>.text:000000014086029F jz      short loc_1408602EF
>>.text:00000001408602A1 cmp     [rsp+59398h+var_1D80C], 69h ; 'i'
>>.text:00000001408602A9 jz      short loc_1408602AD
>>.text:00000001408602AB jmp     short loc_140860310
>>```
>>那三個分支會設定不同的狀態然後最後都會跑到`140860310`
>>```python
>>.text:0000000140860310 loc_140860310:                          ; CODE XREF: sub_14000C0B0+8541FB↑j
>>.text:0000000140860310 mov     [rsp+59398h+nShowCmd], 5        ; nShowCmd
>>.text:0000000140860318 mov     [rsp+59398h+lpDirectory], 0     ; lpDirectory
>>.text:0000000140860321 lea     r9, aCMsgHelloThere_3024        ; " /c msg * Hello there, Hacker"
>>.text:0000000140860328 lea     r8, aCmdExe_3024                ; "cmd.exe"
>>.text:000000014086032F lea     rdx, aOpen_6196                 ; "open"
>>.text:0000000140860336 xor     ecx, ecx                        ; hwnd
>>.text:0000000140860338 call    cs:ShellExecuteA
>>.text:000000014086033E nop
>>.text:000000014086033F
>>.text:000000014086033F loc_14086033F:                          ; CODE XREF: sub_14000C0B0+85421C↑j
>>.text:000000014086033F                                         ; sub_14000C0B0+85423D↑j ...
>>.text:000000014086033F jmp     loc_140C685EE
>>```
>---
>**於是我們有個想法**
>**1. 拿到跳轉表**
>**2. 建立樹狀結構**
>**3. 用DFS或是其他方法找到正確的路徑**
>
>##### 釐清與逆向PART1. 跳轉表
>done, tbc
>##### 釐清與逆向PART2. 生成FNS (func裡面的字串比較)
>done, tbc
>##### 釐清與逆向PART3.開搞DFS
>這邊做到一半 好累 之後再看看有沒有辦法自己搓出來
>
 