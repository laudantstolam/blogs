---
title: blog 2.0 新章與近況
subtitle:
description:
publish: true
tags:
featured_image:
created_date: 2026-07-26
---
## Blog 改版

沉靜了許久後終於有一步步慢慢找回生產力的感覺，首先是從 blog 頁面的重構開始。
原先就設想這個 blog 會作為實驗性質的 playground 定期用來測試 agent workflow 和 skills 的整合等等，因此過程中經歷了許多次的重新設計，但近期隨著逐漸穩定的前端流程感覺是時候進行改版了

這次的風格採用了
- kepano 設計的 [flexoki theme](https://stephango.com/flexoki) 作為主色調
- 借鑑 tw93 的 [kami](https://github.com/tw93/Kami) 專案的排版靈感
- 加上本身使用 obsidian 使用的[border theme(Silver)](https://github.com/Akifyss/obsidian-border/)融合，試圖讓 blog 看起來更像自己平常在 ob 中習慣的操作介面
- callout 融合了[phycat](https://github.com/sumruler/obsidian-theme-phycat)的 callout 設計
- 字體的部分使用 `george font` 作為英文字體，`Iansui font` (芫荽) 作為中文字體
- 最後是參考了許多不同風格的 blog 設計完成了這次的改版

特別想提一下關於 callout 的改動，原先使用了[remark-callout](https://github.com/r4ai/remark-callout) 這個 npm package 作為 md2html 的渲染工具，後來看了 phycat 進行的改動(~~hover出現的emoji非常可愛 我大哭~~)，具體做法可以參考此 [commit](https://github.com/laudantstolam/blogs/commit/697fdbf4bcd0656ebdab78a5bbab657596872f07)

Demo：
> [!bug] 
> みんな 見て見て！！
> この虫、可愛くない?

前後對比：

| origional                                                                                        | phycat style                                                                                     | with floxoki style                                                                               | final result                                                                                     |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| ![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20260726162111.png)<br> | ![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20260726162232.png)<br> | ![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20260726162301.png)<br> | ![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20260726162330.png)<br> |


## 近況分享

另外近期也在思考加上更多生活化的內容，像是 tw93 的 weekly newsletter 一樣(但鑒於分享慾的極大起伏先暫訂季報吧)，總之近期看了一些有趣的東西，

#### AI
- [Omniroute](https://github.com/diegosouzapw/OmniRoute)：一款最全面的反向代理，可以透過更改 agent base url 到中介頁面自定義model。
- [I-have-adhd](https://github.com/ayghri/i-have-adhd)：一個讓 AI 快速 TL;DR 的 skills，gpt的話直接在 prompt 說 `我有 adhd` 即可。

#### 學習
- 上了一堂很有趣的晶片資安課，下一篇blog會來嘗試寫一下心得
- 近期接了一個有趣的活：同步口譯，練習了一些表達與同步翻譯的技巧，相當有趣的經驗

#### 心態調整

這半年經歷了許多起伏，也在許多回顧的過程中發現工作的產出穩定性由情緒為因素產生的波動相當明顯，而某天在 *Leila Hormozi* 的影片裡面似乎找到了指認

>If you want be consistent with things, then you actually have be built on bad days.

**關於計畫與進度，本身就應該涵蓋在你狀態最糟糕時也能產出的最小量**


> [!quote]- REF
>1. [link](https://www.bilibili.com/video/BV1suPYzcEr8)原片刪了qq 這是搬運的連結
>2. 還有這個關於自律的分享
>![](https://youtu.be/cXytK82N93Y)

