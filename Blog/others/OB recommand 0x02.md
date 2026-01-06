---
title: Obsidian推坑指南 (2/3)
subtitle:
description: 從平替到全自動化備份與部屬網頁
publish: true
tags:
  - "#others"
featured_image:
created_date: 2026-01-06
---

> [!important] 終於完成了!!! OB補全計畫
> 
> 很高興宣布，從git版控到blog自動化部屬，一鍵執行的完全體已經完成了
> 

#### 套件列表
- Commander --> 建立快捷鍵的按鈕
- git --> 內文版本控制
## Obsidian Git -- 平替之路的起點

![[OB recommand 0x01#跨裝置同步]]

前一篇有提到obsidian的git套件，但擁有了版控，加上需求逐漸增加，想要做到更多整合性的功能跟方法，就開始一連串自動化不歸路

#### 需求整理
- 想要透過雲端檔案跟朋友一鍵分享即時的筆記內容
- 在不同裝置查看特定的筆記 (尤其是開始利用OB去做時間管理和進度規劃後
- 想把寫得不錯的筆記變成一個blog
- 誤刪筆記的時候想要有git的備份功能


>[!tldr]+ 付費版選項
>- Obsidian Publish (付費) : 發布成網頁
>- Obsidian Sync (付費) : 內建雲端備份功能
>- Obsidian Plugin: share-note
 
 但我是免費仔，所以喜歡做死自己開發 :(

## Obsidian Blogger
事情的開始，是從某天我在尋找替代Obsidian Publish 的東西，偶然翻到有個youtuber vibe出來的東西(快去幫他按愛心)，直接把筆記庫換成這個repo，透過git自動上傳+部屬成astro靜態網頁，完全就是我需要的東西(!!!)

- https://github.com/Beingpax/Obsidian-Blogger
- DEMO: https://youtu.be/OBx3v_tHprw?t=896

但是也遇到了幾個問題
- 我的Ob裡面原有的架構不想變動
- 要架在github pages需要是公開的repo (不!! 誰都別偷看我的抽象筆記)
- Ob會因為node module變得肥大
- 前端需求整合(我想要把個人網站跟blog做在一起)

因此就開始一步步重新開發
### 爆改模板

#### 架構重整

這邊用到的是 git 的 [subdirectory功能](https://www.geeksforgeeks.org/git/how-to-clone-only-a-subdirectory-of-a-git-repository/)，在github會有一個小箭頭在上面

![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20260106224521.png)

- 私人的是我原先的obsidian庫，每30分鐘會自動備份
- 公開的git是手動觸發更新+部屬github pages的

![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20260106215741.png)

#### 前端顯示
因為這個專案是從markdown轉成astro網頁的，對於表格/大小標題/內文的html/css渲染都需要重新定義格式。作者簡單vibe出了幾項，我也手動加上了幾個蠻重要的東西
- [x] Mermaid 圖表
- [x] 各級標題文字
- [x] highlight
- [ ] [Latex支援](https://github.com/laudantstolam/blogs/commit/12a9d1599f000a96d4af0845bc40cbabc9231ea9)
- [ ] [Callout 支援](https://github.com/laudantstolam/blogs/commit/8deaf231bb4a0c98641b62bd1d8a9c9e24bfc96c)
- [ ] 表格顯示支援
- [ ] TOC支援
- [ ] code block支援
- [ ] 微調各種字體/配重/間距
- [ ] tag分類整理/切換顯示
- [ ] 新增Project頁面把專案的blog另外拉出來展示 [LINK](https://laudantstolam.github.io/blogs/projects)
- [ ] 合併個人網站簡介

#### 自動化部屬

**obsidian blogger的轉換邏輯如下**
1. 檢查md文件裡面的publish屬性值，決定是否進行處理 (`sync-obsidian.js`)
2. 透過`astro`引擎跟`npm module`進行轉換 (`astro.config.mjs`)
	1. 透過載入`remark`/`rehype` 的 node plugins來輔助像是mermaid/latex的轉換支援
	2. 參考: [解鎖 Markdown 的超能力：remark/rehype 插件系統](https://bntw.dev/zh/blog/markdown-plugin)
	3. 定義不同的語法對應的轉換邏輯
	4. 轉換後會把每一個md檔案渲染成獨立的html

```
Obsidian 的 .md 文件
    ↓
[sync-obsidian.js] 複製到 src/content/blog/
    ↓
[astro.config.mjs] Markdown 轉換
    ├─ remarkPlugins (AST 轉換)
    └─ rehypePlugins (HTML 生成)
    ↓
[content.config.ts] Schema 驗證
    ↓
[BlogPost.astro] 套用佈局和樣式
    ↓
最終 HTML 頁面
```

3. 定義`github action`把完成的astro blog打包部屬到雲端
#### 展示

| 原先                                                                                               | 客製化後                                                                                             |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| ![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20260106230309.png)<br> | ![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20260106230238.png)<br> |
| ![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20260106230439.png)<br> | ![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20260106230739.png)<br> |
| x                                                                                                | ![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20260106231435.png)<br> |
| ![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20260106231046.png)<br> | ![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20260106231132.png)<br> |

基本的大架構都是照抄，還有一些細節樣式還沒修改完，之後想拿來試試看一些前端的vibe技巧

## 從筆記庫到網頁一鍵部屬

為了方便管理，我一般會把要發布的文章集中在一個資料夾裡面，再讓Obsidian Blogger讀取後手動部屬，但這樣還是要拆好幾個步驟跟程式...**還要更自動化!!!!**

### 自動化的最後一哩路

完成了blogger的自動部屬，似乎就可以將一切都整合在OB裡面完成了
這邊的作法是`shell command` + `commander`插件

首先透過`shell command`建立一個執行自動化部屬的執行指令
(這邊可以針對command進行詳細設定，這邊預設是不會彈出cmd視窗出來的)
![image.png|525](https://raw.githubusercontent.com/Ash0645/image_remote/main/20260106201613.png)

接著利用`commander` 建立按鈕
![image.png|525](https://raw.githubusercontent.com/Ash0645/image_remote/main/20260106202614.png)

成功建立快捷鍵了，自此一鍵部屬大成功!!!!!
![image.png|450](https://raw.githubusercontent.com/Ash0645/image_remote/main/20260106203003.png)

同時我也可以用Obsidian 1.7.0版本更新的base功能去做篩選跟排序(可以用表格/列表/圖標來顯示跟統整)
![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20260107004240.png)


這不是超讚的嗎!!! 一下子就可以看到各種屬性和發布狀態，也可以追蹤要發布的筆記直接一鍵發布

先預告 下一篇會是base跟tasknote的工作流程介紹