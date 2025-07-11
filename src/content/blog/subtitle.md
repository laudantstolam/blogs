---
title: Pomodoro & Music player with pygame
slug: subtitle
publish: true
featured_image: https://raw.githubusercontent.com/Ash0645/image_remote/main/202306212151683.png
tags:
  - project
---
# Subtitle

### Project Overview
just a normal focusing project which support Pomodoro/Music Playing/Todo List


### Getting Started
- download ignored file at https://mega.nz/folder/bV1QkQjB#3PBPy0pJ4uM6dR33BIUoXw
- install modules at ./requriments.py
- START FOCUSING

---
## Subtitle-整合型多功能工作平台


```
目錄
- 壹、摘要  
- 貳、開發過程與專案架構
- 參、程式內容說明
- 肆、成果展現
- 伍、結論與未來展望
- 陸、參考資料
```
---

### 壹、摘要

本專案是一個基於Python程式語言並採用物件導向設計的整合式多功能平台。考量到 在工作狀態中常常需要在多個分頁間切換，並因為集中力被打斷而降低工作效率，我們開發了一個沉浸式工作環境。該環境結合了番茄鐘、待辦清單和音樂搜尋撥放器等功能，旨在建立一個能夠完全專注於工作狀態且不容易受到干擾的沉浸式工作環境。

### 貳、開發過程與專案架構

#### 一、開發過程：

![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/202403032303251.png)
(圖一)

設計開發流程圖 根據上圖一所示，我們在將概念轉化為實際程式內容的過程中，採取了嚴謹的邏輯。

首先，我們使用平面設計軟體確定了各元件的位置，並以使用者操作的直覺度為基準進行 設計。接著，我們建立了程式的框架、背景和FPS頻率等基礎設定。完成框架後，我們利 用GitHub的分支（branch）功能進行工作分配，同時建立了專案中的三大功能：音樂撥 放、番茄鐘計時器和代辦清單。最後，我們進行了整合與程式整體優化的工作，包括使用 物件導向的概念，如多形和繼承等方法，來簡化和管理程式碼中的重複指令與功能，完成 後再將整個程式的原始碼公開在GitHub[主分支](https://github.com/Lyz-0723/Subtitle)(main）上。

#### 二、程式架構：

在進行專題開發時，為了確保日後的維護和擴展性，我們根據畫面中不同的部件功 能，將其分別建立為獨立的檔案(components/(function name).py)再進行開發。這如此便可 以更清晰地追蹤和管理每個部件的程式碼，並且可以在需要時獨立地進行修改和擴展。此 種模組化的開發方式有助於提高團隊的協作效率，同時也使程式碼更易讀和維護。


### 參、程式內容說明

#### 一、 主程式內容

在main程式中，我們引入了各個部件並定義了在視窗上需要顯示的排版內容以及
user event  觸發時的副程式呼叫，透過while()迴圈建構出畫面基礎架構。

#### 二、 模組化程式內容

在開發過程中，我們將經常使用到的button按鈕功能以及text文字功能進行定義與應用，在開始發前引入便可以少下許多重複工作，如下圖二所示：

![](https://raw.githubusercontent.com/Ash0645/image_remote/main/202403032306099.png)
(圖二、模組化程式內容)

#### 三、 功能部件內容：

針對程式中的幾個功能型元件及功能，我們以不同檔案進行引用與管理

1. 音樂可視化 音樂可視化的原理是利用python的librosa套件針對輸入音頻進行傅立葉轉換後再將 資料放入pygame中繪製相對的動態矩形進行實踐。 (註：詳細程式註解請參components/Audio.py)

2. 音樂搜尋 使用者按下搜尋按鈕後會出現一個輸入框，貼上youtube影音平台的連結後會利用 yt\_dlp套件中的爬蟲應用進行資料獲取並存入本地端的資料夾內。 (註：詳細程式註解請參components/getaudio.py)

3. 音樂撥放 音樂的撥放上我們新增了撥放/暫停的toggle按鈕、重播、切割、音量和進度拖曳 滑條的功能。
   (註：詳細程式註解請參components/Player.py)
   
4. 番茄鐘計時器及模式設定 番茄鐘工作法是利用間歇性的集中時間來達成時間切分與效率化辦公，我們因此 設定了三個模式：工作(laboring，25分鐘)、短期休息(short break，5分鐘)、中場休 息(long break，15分鐘)，使用者可自行切換模式來進行時間調配，並在每個番茄鐘歸零時紀錄目前為止各個模式累積的番茄鐘數量。 (註：詳細程式註解請參components/Timer.py)

5. 代辦清單 具備增減修改功能的代辦清單是利用同樣尺寸的”card”堆積而成，上方放置輸入格 輸入代辦事項，完成後按下刪除即可移除，平時則是會存在本地的local storage 中。在程式的實踐中比較特別的是利用繼承的方式來定義每一張”card的狀態。此 方法也有應用在歌單一覽的介面中。 (註：詳細程式註解請參components/CardView.py)

  

### 肆、成果展示

專題製作完成後，我們針對結果進行測試與微調，實際結果如下圖三中所示。在畫面 左側是代辦清單以及其相關編輯、增減功能，下方顯示的骷髏頭則對應到laboring(工作時 間)、short break(短時間休息)、long break(長時間休息)三個模式中所花費的番茄鐘數量， 而三種模式透過點擊對應的文字區域便可切換。最後下方則是可以在撥放音樂的同時欣賞 的可視化頻譜圖。
 ![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/202403032307459.png)
(圖三、程式運行畫面)

除了主視圖之外，我們還利用pygame內建的半透明矩形功能，實現了模擬彈出視窗 的效果。這一功能被應用於歌曲搜尋、歌單一覽等效果上，如下圖所示：
![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/202403032310466.png)
(圖四、歌曲搜尋畫面截圖)
![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/202403032310865.png)
(圖五、歌單一覽畫面截圖)

### 伍、結論及未來展望

總結而言，本次在製作學期專題的過程中除了更加靈活地運用python這門語言，也透 過物件導向的方式重新構築了對程式的掌握度，在專題的實踐與開發的過程中，雖然也有遇到難以解決的錯誤與困難，但也在每一次解決問題的同時也更提升了自我的能力。

本專題的目標是創建一個完全沉浸式的工作環境開發程式，就成果而言，我們完成了最初預期的小目標。未來，我們將在Github上持續更新和改進功能，例如音訊優化、代辦事項和計時功能的連接等。同時，我們還計劃將專案轉換為可執行文件，以便任何使用者可以下載和使用。

  

### 陸、參考資料

一、BaralTech, (January, 25, 2023), Pomodoro Timer in Python and PyGame  取自https://www.youtube.com/watch?v=6oJMd6FWUB8&t=729s&pp=ygUVcG9tb2Rvcm8gdGltZXIgc HlnYW1lKeras. Callbacks API. Keras. 
https://keras.io/api/callbacks/