---
title: Obsidian推坑指南 (1/3)
description: ""
publish: true
created_date: 2025-11-09
tags:
  - others
---
## 前言

開始用Obsidian來做為主要筆記軟體也有兩三年了，一直很喜歡在裡面鼓搗一些套件跟功能，也在工作跟學習筆記之間慢慢找到了適合自己的OB工作流程，加上最近看到了一些不錯的專案所以想來寫點東西向全世界推廣這個程式。 

[Download - Obsidian](https://obsidian.md/download) -> 支援Mac/Win/linux 的免費筆記軟體

這篇入門介紹主要想包含我目前真實的使用場景和一些覺得很棒的小功能，詳細套件的介紹可能會在出一篇followup ;)))

那麼首先，讓我用最近換上的美麗布景來開始推坑:

| 深色主題                                                                                         | 淺色主題                                                                                             |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| ![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20250630233542.png) | ![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20260112043432.png)<br> |

我的開啟畫面大致是像上面那樣，最左側是不同功能的快捷鍵，然後是檔案目錄跟搜尋，中間是筆記的工作區跟預設的開啟畫面，右邊是git跟文字大綱(輪流切換)和日曆
  
很喜歡OB的一個地方就是自由度，只要你想，每一個方塊(?)都是可以自由變換大小跟排列的，甚至可以自己寫CSS把整個頁面爆改成其他風格，或是簡單一點--套一個好看的模板

e.g.`(設定->外觀->管理)`
![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20250630235439.png)

有了一個美麗的工作區後就是著手專注在筆記的生產上，每個人的工作流程不太一樣，這邊會舉我目前的使用習慣給大家參考康康

>[!quote]+ 我的OB設定參考
>- 安裝套件: Style Settings + CodeBlock Customizer
>- 主題: Border的Sunset theme : https://github.com/Akifyss/obsidian-border/blob/main/presets/Sunset.json
>- 安裝步驟: 裡面的CSS直接去styles中import
>- ![](https://raw.githubusercontent.com/Ash0645/image_remote/main/%E9%8C%84%E8%A3%BD_2025_11_09_16_29_35_810.gif)
>- 明亮主題也好看，這邊可以客製化 `callout` 樣式跟 codeblock的樣子
>   ![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20260112043015.png)


### Obsidian 內建功能介紹

#### Obsidian語法
Obsidian 的使用格式是Markdown再加上自己的一點原生語法，基本上不會太難入門(吧)
平常有在使用HackMD或是Notion的轉換過來不會太難
![image.png|475](https://raw.githubusercontent.com/Ash0645/image_remote/main/20250701004002.png)
![image.png|475](https://raw.githubusercontent.com/Ash0645/image_remote/main/20251109165551.png)

REF: [【Obsidian 使用教學】筆記篇](https://medium.com/pm%E7%9A%84%E7%94%9F%E7%94%A2%E5%8A%9B%E5%B7%A5%E5%85%B7%E7%AE%B1/obsidian-%E4%BD%BF%E7%94%A8%E6%95%99%E5%AD%B8-%E7%AD%86%E8%A8%98%E7%AF%87-09-%E5%8F%AA%E9%9C%80%E8%A6%81%E5%AD%B8%E6%9C%83%E9%80%99-3-%E5%80%8B%E8%AA%9E%E6%B3%95%E5%B0%B1%E8%83%BD%E4%B8%8A%E6%89%8B-markdown-d3961e28bff)

相信這些功能應該也能涵蓋到基本的日常使用
另外本身我也很喜歡ob對latex的支援(有些套件可以快速生產出複雜的公式而不用手打)
比如:
$$\Rightarrow y(t)=A|T(jw)|sin(wt+\angle {T(jw)}$$

#### Callouts

另一個我覺得很有用的東西是我首頁"七月計畫"那邊的螢光格
可以自己定義不同的icon跟圖標，甚至可以折疊-->很適合拿來做問題跟答案的筆記模板

| 暗黑主題                                                                                             | 明亮主題                                                                                         |
| ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| ![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20260112044156.png)<br> | ![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20260112044053.png) |

### 其他使用範例
#### 跨裝置同步

<font color="#e36c09">套件: git</font>

Obsidian本身是一個不用連網路就能離線編輯的軟體，而在不同設備之間如果要進行進度同步的話有幾個不同的方法
1. 購買premium
2. 使用git來進行同步 -> 大推
ref: [使用 Obsidian Git自動備份筆記到 Github](https://ithelp.ithome.com.tw/articles/10280373)

#### 剪貼簿自動上傳圖雲

<font color="#e36c09">套件: image auto upload</font>

另外圖片的上傳不像是Hackmd會自動幫忙變成一個link
比如: `https://hackmd.io/_uploads/r1B3vL7Qgl.png`

ob裡面螢幕截圖貼上的東西預設會變成一張圖片存在根目錄
但我不喜歡一堆圖片要管理所以設定了`picgo+image-auto-upload`
![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20250701011435.png)
搞了一個repo拿來放這些圖片，picgo設定好就可以自動上傳
這樣截圖的東西貼進來就會是一個圖片的連結 耶呼
之後要分享圖片也可以直接傳連結出去，非常方便
ref: [寫 Markdown 的好夥伴！PicGo 支援快速上傳圖片到預設圖床，並且返回 Markdown 圖片超連結](https://medium.com/pm%E7%9A%84%E7%94%9F%E7%94%A2%E5%8A%9B%E5%B7%A5%E5%85%B7%E7%AE%B1/%E5%AF%AB-markdown-%E7%9A%84%E5%A5%BD%E5%A4%A5%E4%BC%B4-picgo-%E6%94%AF%E6%8F%B4%E5%BF%AB%E9%80%9F%E4%B8%8A%E5%82%B3%E5%9C%96%E7%89%87%E5%88%B0%E9%A0%90%E8%A8%AD%E5%9C%96%E5%BA%8A-%E4%B8%A6%E4%B8%94%E8%BF%94%E5%9B%9E-markdown-%E5%9C%96%E7%89%87%E6%A0%BC%E5%BC%8F-7b83ad56ddb7)

>[!quote]+ 我自己經常使用的圖片相關套件
>![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20251109163350.png)
>- Image auto upload -> 自動上傳picgo
>- Image Toolkit -> 點擊放大/旋轉
>- Mousewheel Image zoom -> 滾輪放大縮小，也可以用`![image | 200](link)` 的方式來設定大小 (一般圖片顯示是`![image](link)`)

#### 輸出PDF

<font color="#e36c09">套件: editing toolbar + better export pdf</font>

自從安裝了`Better-Export-PDF`，距離美好MD生活又近了一步
可以自定義壓縮尺寸/邊界還有預覽，在尺寸跟渲染的處理上都很棒，甚至保留了OB主題的樣式(超愛)
我在筆記的右上角加入了一個快捷鍵(利用`editing toolbar`建立)，平常需要的話就可以馬上輸出
![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20250704022712.png)

#### (隱藏用法) 快速簡報展示

<font color="#e36c09">套件: Advanced slides</font>

在作筆記的時候如果想快速跟人用大字報講解
或是DDL剩下十分鐘但是需要快速DEMO一些概念
可以使用預設的`slides preview`功能+`Advanced slides`套件 (特別好用)
![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20250704024606.png)
甚至可以輸出成PDF/或是發佈到指定的PORT((((真的是喪心病狂但蒸褲ovo
ref: https://youtu.be/wNj79ryJETU

#### 心智圖

<font color="#e36c09">套件: Mind Map</font>

![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20250704030528.png)
太神了 真的只能說太神了
自動渲染的心智圖怎麼輸(BTW 這邊提到的東西全部都能輸出成為PDF 真的贏爛)

#### 關聯圖
這個我比較少用 但看起來挺像那麼回事的
![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20250704031007.png)

### Obsidian Excalidraw

這個已經是另一個可以另外拉出去說的主題了
族繁不及備載，有興趣可以先去看這個影片再慢慢摸索
https://www.youtube.com/watch?v=P_Q6avJGoWI&pp=ygUTZXhjYWxpZHJhdyBvYnNpZGlhbg%3D%3D

包括但不限於: 手寫字/流程圖/網頁媒體即時預覽/關係圖建立/PDF標註與筆記 以上所有功能的整合

showcase一下之前材料力學的醜醜筆記
![image.png|400](https://raw.githubusercontent.com/Ash0645/image_remote/main/20251109165214.png)
