---
title: from notes to skills
subtitle:
description:
publish: true
tags:
  - others
  - note-taking
featured_image:
created_date: 2026-06-05
---
### Karpathy method: 從每週記錄到obsidian重構開始的思考與嘗試

最近在休息期間對於blog多了很多想法，從重構obsidian結構到重構工作流程的過程中發現有更多想嘗試的blog記錄方式

首先是關於Karpathy提出的筆記方法，看完方法論和一些熱門的開源項目實踐(如 Openhuman.etc)目前我仍在觀望中還沒完全應用，但是共同的核心仍然是：**對於讀過的有用資訊保存與作為未來相似研究的起點**

目前的工作流程而言我會更加有意識地記錄下找資料過程中看過的文章／來源，結合平常看的RSS文章，分類成下面幾個類型

- **基礎工具** -> 不太熟的套件教學/工具的神奇用法
- **利用方法** -> explot / 利用方法 / 新的攻擊面
- **研究紀錄** -> 完整漏洞研究紀錄 / malware研究等等

而紀錄的內容通常包含下面內容：
```md
[LINK] 簡述 (#tags | 工具/利用方法/研究紀錄.etc)
- 針對文章的一些筆記(2-3行)、keynote
- [[類似技術文章的double link]]
```

### 從skills開始的工具學習法

但過一段時間發現或許有可以更好利用的方法，從上面大致分類的方法再去思考harness engineering的本質：**化經驗為可以重複利用的skills**
不過從一個學習的角度來說，原先的`讀blog -> 做練習/寫筆記 -> 提煉成skills`
進階成 `讀skills -> 吸收理解 -> 生出更多洞見 -> 補充回skills` 好像更加理想
於是作為實驗 從skills draft開始，寫了一篇capstone工具利用方法作為嘗試，最後也附上了成果的`skills.md`可以去裝來玩玩看(?
~~但我相信一定有類似的harness流程只是想研究一下方法論的可行性~~

#### 流程memo


> [!NOTE] Step1. 生成draft skills
> - model: gemma4 31B free
> - agent: Opencode
> - skills: superpowers:writing-skills
> - prompt: `/superpowers:writing-skills  if i wanna write a skills abt capstone, what to do and some tips? search online and gimme a draft`

意外第一步就很順利，主要目標是掌握基本用法的大致和整個skills的大綱
還提到了一些額外的延伸與整合

| overview                                                                                         | extend usage                                                                                 |
| ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| ![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20260709204734.png)<br> | ![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20260709204540.png) |

> [!NOTE] Step2. 進階蒸餾(?)
> 了解用法後要定義合適的使用時機還有常見的坑，於是針對我平常使用的主要情景：CTF、vuln-researching 分別讓agent去做research看看大家怎麼用、有什麼特別的tips，再去重新檢視自己的理解
>
> - prompt: `for ctf and bug hunting field of approach, gimme some detail techniq i could so also use with capstone or in what kinda situation i could use them`
> - model: Openrouter Free Model (這邊與模型本身能力較無關，只要web search mcp之類的有裝好基本上都差不多)
> 
> 註: 這邊有參考了[ctf-skills](https://github.com/ljagiello/ctf-skills)的寫法，在範例的地方用了幾個ctf的writeup參考，意外的可以涵蓋許多edge-cases，但也要適量加入(?)

挺有趣的是後面讓LLM回顧自己如何進行上述步驟，他的歸納如下:

> 模仿人類學習路徑：
> - 1. **基本用法** / 基礎概念擷取 (函數簽名、參數類型)
> - 2. **實例應用** / 實戰模式解析 (何時使用、常見陷阱)
> - 3. 跨技術比對 (相似工具的差異與選擇標準)

其實通常到這邊之後就可以讓AI開始給一些overview 101 的tutorial，很適合用來warpup一個階段的學習成果

> [!NOTE] (Optioanl / Customizable) 添加自己的應用範例 
> 之前再用AI逆向的時候有幾次使用capstone提取特徵或是做一些特殊類型的檔案特徵提取有奇效，因此把一些之前AI生過的腳本丟進去給他看看有什麼"技巧/insights"是可以擴充到skills裡面的
> 
> 我自己的理解，這部分的重點是: **把自己實際用過/看到過/進階一點的case 丟給他去學**
> - prompt: `<scripts> for those script, explain how it wrote capstone, any tips, and why write like this, anything could enrich into our skills`
> 

這邊可能要注意一下結果不要overfittting 讓LLM集中在skills的建立畢竟要強調靈活
不過在他拆解的過程也可以讓他多解釋一下寫法的tips ~~對於人類腦內的token有活絡的奇效~~
這部份個人也重複了許多輪才更加理解許多技巧跟概念

> [!NOTE] Step 3. Build the Skills
> - skills: skillify
> - prompt: `/skillify conclude what we learnt in this session and wrote a skills.md file for me`
> - module: `Gemma4 31B (free)`，(再用Opus/Sonnet去重複驗證內容)
> - 這邊稍微注意一下context window跟驗證輸出會比較好，後面也有把輸出丟claude檢查一下正確性

> [!important] Output
> https://github.com/laudantstolam/skills-archive

產出:
```
.agents/
└─skills/
   └─capstone-re/                     ← 專屬於 Capstone 逆向工程的技能資料夾
      ├─SKILL.md                         ← 完整的英文技術手冊
      ├─SKILL.zh-TW.md                   ← 繁體中文翻譯版（方便中文讀者查閱）
      ├─README.md                         ← 快速入門概覽（概述文件結構、使用方式）
      ├─CHEAT_SHEET.md                    ← 概念+程式碼片段的速查卡（最常用）
```

解釋:
```
📂 訊息流向（為什麼這樣組）
1. 使用者第一次進入この資料夾 → 看到 README.md → 快速能了解「這裡有什麼」以及「要怎麼用”。  
2. 想立刻寫程式 → 打開 CHEAT_SHEET.md → 直接拿到最常用的程式碼片段。  
3. 想深入了解 → 打開 SKILL.md（或 .zh-TW.md） → 讀完整的解釋與範例。若要更廣泛的背景，打開 capstone-re-guide.md。
   
📂 文件之間的關係類似「書籍」的結構：  
- README → 導讀（導入）  
- CHEAT_SHEET → 立即使用的技巧  
- SKILL.md → 完整教科書 (技術細節)  
- capstone-re-guide.md → 補充說明與背景（可選閱讀）
```

引用近期大家在聊Fable時經常提及的一張圖表(ref: [李元魁/倉鼠好文解讀](https://circleghost.substack.com/p/fable))
![|600](https://substackcdn.com/image/fetch/$s_!8xyS!,w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff83c9174-0ac7-4732-96ef-a67bc5247d08_2048x1536.png)

可以先去拜讀一下這篇文章對於模型能力的解讀與定位分析，而本次實驗中我認為也可以進一步去思考關於此方法論的整合

|       | 定位                                              | 實驗中的具體案例                         |
| ----- | ----------------------------------------------- | -------------------------------- |
| 已知的已知 | Step1 生成 draft:把你講得出的目標變成draft檔                 | 一個capstone的skills draft          |
| 已知的未知 | Step2 讓 agent 去找具體案例-從大概知道best practice 到細節的補充  | 工具的具體用法與ref(見`cheatsheet.md`)    |
| 未知的已知 | Tactical knowledge, LLM拆解工作流程後變成得可以復用的skills的主軸 | 常見的rev pattern/具體模式選擇等等基礎知識      |
| 未知的未知 | 從step2. 延伸，一些沒有意識到的部分(**個人認為可以是edge case的重點**)  | writeup對應到的edge-cases把沒意識到的坑凸顯出來 |

#### 心得
這次的實驗成果而言架構與內容總體而言相當完整，也意外的不太消耗~~要錢的~~token，而自己也在過程中主要的學習也是利用這AI協作的方式達到一種: ***藉由寫 skills 把「未知的已知」搬進「已知的已知」的感覺***，似乎對工具的理解被顯性化了，也加大了這套流程的可擴充性，不過成熟度而言依然還有可以更加自動化或是變成更加流程化的可能，以及過程中對於**複查**的判斷都花費了許多額外的時間

但是以學習的角度而言，和AI以這樣的方式一起學習一個自己不太理解的東西，個人覺得加快了很多的流程與自學時的完整性，並且用更加接近"人類學習模式"的方法，擺脫了AI一次性吐出過多過雜亂的東西無法吸收的缺點。~~蒸好，今天也學會了capstone 嘻嘻~~

### (下一步的) 反蒸餾

在研究Trail of Bits的[skills內容](https://github.com/trailofbits/skills/)時，突然有個想法，既然已知skills是被蒸餾出來的產物，那麼反蒸餾回去把它**當作一個toc進行展開與補充**是不是就能快速掌握入門~中級的domain knowledge? 因此下一篇範例以fuzzing的技術作為學習範例來學習如何fuzzing ovo

**檢驗方法** 
以實際情境為例，讓ai先教我一下大概在幹嘛後選定一個目前想要測試的標的，測試看看不透過skills用最低限度的AI(ref web GPT)來進行實作看看結果跟用skills下去的區別，是否有可以更好的


**擴充與精實**
之後就是根據所知繼續擴充skills這樣的模式或是透過harness等方式繼續將skills變成一個跟著自己的domain knowledge擴張可以做到的東西