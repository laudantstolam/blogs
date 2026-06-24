---
title: from notes to skills
subtitle:
description:
publish: false
tags:
  - others
  - note-taking
featured_image:
created_date: 2026-06-05
---
### Karpathy method: 從每週記錄到obsidian重構開始的思考

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

但過一段時間發現或許有可以更好利用的方法，從上面大致分類的方法再去思考harness engineering的本質：**化經驗為skills**
不過從一個學習的角度來說，原先的`讀blog -> 做練習/寫筆記 -> 提煉成skills`
進階成 `讀skills -> 吸收理解 -> 生出更多洞見 -> 補充回skills` 好像更加理想
於是作為實驗 從skills draft開始，寫了一篇capstone工具利用方法(下一篇blog)作為嘗試

#### 學習流程memo


> [!NOTE] Step1. 生成draft skills
> - model: gemma4 31B free
> - agent: Opencode
> - skills: superpowers:writing-skills
> - prompt: `/superpowers:writing-skills  if i wanna write a skills abt capstone, what to do and some tips? search online and gimme a draft`

意外第一步就很順利，主要目標是掌握基本用法的大致和整個skills的大綱

> [!NOTE] Step2. 定義trigger / 為不同部分加上tag
> 了解用法後要定義合適的使用時機，a.k.a *trigger*，於是針對我平常使用的主要情景：CTF、vuln-researching 分別讓agent去做research看看大家怎麼用、有什麼特別的tips，再去重新檢視自己的理解

### 反蒸餾
再研究Trail of Bits的[skills內容](https://github.com/trailofbits/skills/)時，突然有個想法，既然已知skills是被蒸餾出來的產物，那麼反蒸餾回去把它當作一個toc進行展開與補充是不是就能快速掌握入門~中級的domain knowledge? 因此這個範例以fuzzing的技術作為學習範例來學習如何fuzzing ovo

**檢驗方法** 
以實際情境為例，讓ai先教我一下大概在幹嘛後選定一個目前想要測試的標的，測試看看不透過skills用最低限度的AI(ref web GPT)來進行實作看看結果跟用skills下去的區別，是否有可以更好的


**擴充與精實**
之後就是根據所知繼續擴充skills這樣的模式或是透過harness等方式繼續將skills變成一個跟著自己的domain knowledge擴張可以做到的東西