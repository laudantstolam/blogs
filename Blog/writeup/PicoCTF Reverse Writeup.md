---
title: PicoCTF Reverse Writeup
description: revrevrevrev
publish: true
tags:
  - writeup
created_date: 2024-07-03
---
### Transformation
cat enc-->`灩捯䍔䙻ㄶ形楴獟楮獴㌴摟潦弸強㕤㐸㤸扽`
decode-->print(text.encode('utf-16-be'))
--> picoCTF{16_bits_inst34d_of_8_75d4898b}

### vault-door-training
cat

### Picker I
cat 得知呼叫win就會有flag經過轉換
```
for c in flag:
    str_flag += str(hex(ord(c))) + ' '
```
所以reverse it
```
str_flag = [0x70,0x69,0x63,0x6f,0x43,0x54,0x46,0x7b,0x34,0x5f,0x64,0x31,0x34,0x6d,0x30,0x6e,0x64,0x5f,0x31,0x6e,0x5f,0x37,0x68,0x33,0x5f,0x72,0x30,0x75,0x67,0x68,0x5f,0x36,0x65,0x30,0x34,0x34,0x34,0x30,0x64,0x7d]
for i in str_flag:
        print(chr(i), end = '')
```

### Picker II
cat 看到輸入win會是false
另外因為會自動幫忙加括號`()`
```
┌──(kali㉿kali)-[/media/sf_SHARED_FILE/pico_reverse]
└─$ nc saturn.picoctf.net 59984
==> print(open('flag.txt','r').read().strip())
picoCTF{f1l73r5_f41l_c0d3_r3f4c70r_m1gh7_5ucc33d_0b5f1131}
'NoneType' object is not callable
```

### Picker III*
輸入選項
1-列表  2-讀函數 3-寫入函數 4-隨機數字
因為他的CODE:
```
def getRandomNumber():
  print(4)  # Chosen by fair die roll.
            # Guaranteed to be random.
            # (See XKCD)

```
於是從3裡面把getRandomNumber函數的值變成win
這樣執行4就會是flag
```
0x70 0x69 0x63 0x6f 0x43 0x54 0x46 0x7b 0x37 0x68 0x31 0x35 0x5f 0x31 0x35 0x5f 0x77 0x68 0x34 0x37 0x5f 0x77 0x33 0x5f 0x67 0x33 0x37 0x5f 0x77 0x31 0x37 0x68 0x5f 0x75 0x35 0x33 0x72 0x35 0x5f 0x31 0x6e 0x5f 0x63 0x68 0x34 0x72 0x67 0x33 0x5f 0x61 0x31 0x38 0x36 0x66 0x39 0x61 0x63 0x7d

>>picoCTF{7h15_15_wh47_w3_g37_w17h_u53r5_1n_ch4rg3_a186f9ac}
```
### packer
先丟IDA看到它是一個UDX打包檔
`udx -d <file>` 解壓縮
在丟進去 main裡面看到檢查字串`7069636f4354467b5539585f556e5034636b314e365f42316e34526933535f31613561336633397d`
左轉cyberchef得到flag

### OTP

看main裡面有比較輸入值處理後要是`mngjlepdcbcmjmmjipmmegfkjbicaemoemkkpjgnhgomlknmoepmfbcoffikhplmadmganmlojndm fahbhaancamdhfdkiancdjf`
之後去跟flag進行XOR

flag: `18a07fbdbcd1af759895328ec4d82d2b411dc7876c34a0ab61eda8f2efa5bb0f198a3aa0ac47ff9a0cf3d913d3138678ce4b`

從code逆推

<未完待續>

### Easy as GDB

難死了MD

在GDB裡面 因為main/start這些funciton都沒有被識別
所以先
```
gef➤  start
Stopped due to shared library event (no libraries added or removed)
[Thread debugging using libthread_db enabled]
Using host libthread_db library "/lib/x86_64-linux-gnu/libthread_db.so.1".
[*] PIC binary detected, retrieving text base address
[+] Breaking at entry-point: 0x56555580
[ Legend: Modified register | Code | Heap | Stack | String ]
──────────────────────────────────────────────────────────────────────────────────── registers ────
$eax   : 0xf7ffda20  →  0x56555000  →   jg 0x56555047
$ebx   : 0xf7ffcfec  →  0x00033f2c
$ecx   : 0xf7ffdd28  →  0x00000000
$edx   : 0xf7fcce40  →   call 0xf7fecba9
$esp   : 0xffffd050  →  0x00000001
$ebp   : 0x0       
$esi   : 0xffffd05c  →  0xffffd252  →  "SHELL=/bin/bash"
$edi   : 0x56555580  →   xor ebp, ebp
$eip   : 0x56555580  →   xor ebp, ebp
$eflags: [zero carry parity adjust SIGN trap INTERRUPT direction overflow resume virtualx86 identification]
$cs: 0x23 $ss: 0x2b $ds: 0x2b $es: 0x2b $fs: 0x00 $gs: 0x63 
──────────────────────────────────────────────────────────────────────────────────────── stack ────
0xffffd050│+0x0000: 0x00000001   ← $esp
0xffffd054│+0x0004: 0xffffd228  →  "/media/sf_SHARED_FILE/pico_reverse/brute2"
0xffffd058│+0x0008: 0x00000000
0xffffd05c│+0x000c: 0xffffd252  →  "SHELL=/bin/bash"
0xffffd060│+0x0010: 0xffffd262  →  "SESSION_MANAGER=local/kali:@/tmp/.ICE-unix/787,uni[...]"
0xffffd064│+0x0014: 0xffffd2ae  →  "WINDOWID=0"
0xffffd068│+0x0018: 0xffffd2b9  →  "QT_ACCESSIBILITY=1"
0xffffd06c│+0x001c: 0xffffd2cc  →  "COLORTERM=truecolor"
────────────────────────────────────────────────────────────────────────────────── code:x86:32 ────
   0x56555576 <__cxa_finalize@plt+0006> xchg   ax, ax
   0x56555578 <__gmon_start__@plt+0000> jmp    DWORD PTR [ebx+0x38]
   0x5655557e <__gmon_start__@plt+0006> xchg   ax, ax
●→ 0x56555580                  xor    ebp, ebp
   0x56555582                  pop    esi
   0x56555583                  mov    ecx, esp
   0x56555585                  and    esp, 0xfffffff0
   0x56555588                  push   eax
   0x56555589                  push   esp
────────────────────────────────────────────────────────────────────────────────────── threads ────
[#0] Id 1, Name: "brute2", stopped 0x56555580 in ?? (), reason: BREAKPOINT
──────────────────────────────────────────────────────────────────────────────────────── trace ────
[#0] 0x56555580 → xor ebp, ebp

```

從上面知道入口=0x56555580
然後開始找比較的地方在哪裡
用x/100i 0x56555580 開始看
x/100i 0x56555680 
x/100i 0x56555780...
x/100i 0x56555980

```
   0x56555989:  add    eax,ecx
   0x5655598b:  movzx  eax,BYTE PTR [eax]
bp 0x5655598e:  cmp    dl,al
   0x56555990:  je     0x5655599b
   0x56555992:  mov    DWORD PTR [ebp-0x18],0xffffffff
   0x56555999:  jmp    0x565559a7
   0x5655599b:  add    DWORD PTR [ebp-0x14],0x1
   0x5655599f:  mov    eax,DWORD PTR [ebp-0x14]
-->0x565559a2:  cmp    eax,DWORD PTR [ebp+0xc]
   0x565559a5:  jb     0x56555978
   0x565559a7:  mov    eax,DWORD PTR [ebp-0x18]
   0x565559aa:  mov    ebx,DWORD PTR [ebp-0x4]
   0x565559ad:  leave

```

![image.png|550](https://raw.githubusercontent.com/Ash0645/image_remote/main/20241103220914.png)
從ghidra通靈來的9a2那邊再比較flag_len長度

```
gef➤  x/wx $ebp + 0xc
0xffffcf54:     0x0000001e

0x000001e = 30
```
所以可知flag長度是30
格式就會是 `picoCTF{AAAAAAAAAAAAAAAAAAAAA}`

然後終於可以開始爆破
因為它會每個字元逐一比較 所以在 `0x5655598e:  cmp    dl,al`
設定breakpoint進行爆破 只要檢查到是true就會進行下一個的測試
字元有`A-z+0-9+"_"` 所以是55
所以最多測試55x21=165次一定可以找到

```python
import gdb


```


---
一些小轉換在 Bit-O-Asm 系列
```python
print(int(hex_value, 11))=17
str(0x11)=17
```


---
### Shop
nc連線過去
第一個選項沒有邊界檢查所以可以用`-88`之類的數字進行購買然後coin就會增加，可以進一步買到FLAG，這題目感覺有自動化解法 可以再研究一下
`Flag is:  [112 105 99 111 67 84 70 123 98 52 100 95 98 114 111 103 114 97 109 109 101 114 95 98 56 100 55 50 55 49 102 125]`

```python
num = [112, 105, 99, 111, 67, 84, 70, 123, 98, 52, 100, 95, 98, 114, 111, 103, 114, 97, 109, 109, 101, 114, 95, 98, 56, 100, 55, 50, 55, 49, 102, 125] 

print("".join(chr(n) for n in num))
```
from decimal: `picoCTF{b4d_brogrammer_b8d7271f}`

---
### Virtural Machine

有2個內容一樣的xml、dae跟一個flag格式
`39722847074734820757600524178581224432297292490103995908738058203639164185`

red-input, blue-output

她媽的是一個模型檔案
紅色40齒
藍色是8

---
### Vaultdoor3
cat -> jU5t_a_sna_3lpm18gb41_u_4_mfr340

```python
for (i=0; i<8; i++) {
    buffer[i] = password.charAt(i);
}
### 前面7個字一樣:jU5t_a_
for (; i<16; i++) {
    buffer[i] = password.charAt(23-i);
}
## i從15到8。
## 倒敘瑱入sna_3lpm >> 相反

for (; i<32; i+=2) {
    buffer[i] = password.charAt(46-i);
}
## 16開始每次+2
## 填入 password 的 (46-i) 的字
for (i=31; i>=17; i-=2) {
    buffer[i] = password.charAt(i);
}
## 從31開始，每次減2，直接複製 password[i]。
String s = new String(buffer);
return s.equals("jU5t_a_sna_3lpm18gb41_u_4_mfr340");
## 最後比對結果是不是跟這個一樣

```

只能說chatgpt能力進化了
```python
target = "jU5t_a_sna_3lpm18gb41_u_4_mfr340"
password = [''] * 32

# 第一段：直接 copy 第 0~7 位
for i in range(8):
    password[i] = target[i]

# 第二段：8~15位，逆著來
for i in range(8, 16):
    password[23 - i] = target[i]

# 第三段：16~30，偶數位置
for i in range(16, 32, 2):
    password[46 - i] = target[i]

# 第四段：17~31，奇數位置
for i in range(31, 16, -2):
    password[i] = target[i]

# 把密碼組回來
final_password = ''.join(password)
print("picoCTF{" + final_password + "}")

>>picoCTF{jU5t_a_s1mpl3_an4gr4m_4_u_1fb380}
```

### Vaultdoor5

base64 decode -> url decode
--> `c0nv3rt1ng_fr0m_ba5e_64_e3152bf4`
6 真的很六
有夠白癡

### Vaultdoor6
XOR反推回去

