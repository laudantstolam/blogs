---
title: Louisa Auto Wifi connector
slug: louisapro
description: Auto WiFi reconnecting tool for chained coffee brands
publish: true
tags:
  - project
---

### Intro
平常在不同的路*莎總需要清除網路設定再重新連線有點麻煩，所以搞了一個可以輸入店名或地址後自動設定wifi密碼的小工具

### Interface
![](https://raw.githubusercontent.com/Ash0645/image_remote/main/20250122125138.png)

### 製作過程
爬了一下露*莎的網頁門市資料然後抓出東西變成csv(`query/01_csv_dump.py`)
門市名稱,電話,經緯度座標,地址,營業時間,開始時間,結束時間
有些經緯度沒有抓到就用google geography API抓(`query/02_fill_lating.py`)
最後用tkinter包起來

#### Some Notes
好玩 又是一個成功的密碼小偷了