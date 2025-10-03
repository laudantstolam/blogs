---
title: 2025AEGIS Writeup
description: i dunno pwn, i just pwp
publish: true
tags:
  - writeup
featured_image: https://raw.githubusercontent.com/Ash0645/image_remote/main/20250930101751.png
created_date: 2025-10-01
---
### OverView

這次神盾各領域都是2題 差一點點進決賽QQ (10-13名都同分 比時間QQ)
負責了misc的通靈部分跟rev的兩題 pwn解到漏洞利用了但是卡在最後一步
這是隊友的 crypto WP -> https://hackmd.io/@eeeeee/BkXJPDHhgg

| <font color="#c0504d">total</font> | Reverse | Pwn | Web | Crypto | Misc/Forensic |
| :--------------------------------- | :------ | :-- | :-- | :----- | :------------ |
| 2                                  | 2.5     | 0.5 | 0   | 0      | 0             |

| challenge | difficulty | genere  |
| :-------- | :--------- | ------- |
| gochal    | 💔         | Reverse |
| callback  | 💔         | Reverse |
| minielf   | 💔💔       | Reverse |
| n2        | 💔💔       | Pwn     |

## Reverse

### gochal

又是100分爛題嗚嗚
IDA翻翻找找看到有一個叫`main_checkFlag`的func 裡面再做簡單的`base64+XOR`字串處理
```c
  __int64 v35; // [rsp-8h] [rbp-70h]
  char v36; // [rsp+15h] [rbp-53h] BYREF
  char v37; // [rsp+35h] [rbp-33h] BYREF
  char n26; // [rsp+55h] [rbp-13h]
  __int16 n15403; // [rsp+56h] [rbp-12h]
  __int64 v40; // [rsp+58h] [rbp-10h]
  __int64 v41; // [rsp+60h] [rbp-8h]

  n26 = 0x1A; // XOR's num
  n15403 = 0x3C2B; // XOR's num
  v9 = encoding_base64__ptr_Encoding_DecodeString(
         runtime_bss,
         (unsigned int)"W257U3hHXURjfERORUlOdUBZRUJSRV9Uc1hjfUpRfwpB", //raw str
         44,
         a4,
         a5,
         a6,
         a7,
         a8,
         a9);
  if ( a4 )
    return 0;
  v14 = v9;
  v15 = runtime_slicebytetostring(
          (unsigned int)&v37,
          v9,
          (unsigned int)"W257U3hHXURjfERORUlOdUBZRUJSRV9Uc1hjfUpRfwpB",
          0,
          a5,
          v10,
          v11,
          v12,
          v13,
          v33);
  v40 = v14;
  v41 = v15;
  v20 = runtime_makeslice((unsigned int)&RTYPE_uint8, v14, v14, 0, a5, v16, v17, v18, v19, v34);
  v25 = v40;
  v26 = v41;
  
  // HERE, 
  for ( i = 0; v25 > i; ++i )
  {
    v29 = v20;
    LODWORD(a4) = v25;
    n3 = i - 3 * ((__int64)(i + ((unsigned __int128)(i * (__int128)(__int64)0xAAAAAAAAAAAAAAABLL) >> 64)) >> 1);
    if ( n3 >= 3 )
      runtime_panicIndex(n3, v29, 3, v25);
    v21 = (unsigned __int8)*(&n26 + n3);
    *(_BYTE *)(v29 + i) = v21 ^ *(_BYTE *)(v26 + i);
    v20 = v29;
  }
  v31 = v20;
  v32 = runtime_slicebytetostring((unsigned int)&v36, v20, v25, a4, v26, v21, v22, v23, v24, v35);
  if ( v31 == a2 )
    return runtime_memequal(a1, v32);
  else
    return 0;
}
```

```python
# Python code to decode the embedded Base64+XOR "flag" and provide a small check function.
import base64, sys

B64 = "W257U3hHXURjfERORUlOdUBZRUJSRV9Uc1hjfUpRfwpB"
data = base64.b64decode(B64)

# key derived from n26 = 0x1A, n15403 = 0x3C2B (little-endian -> 0x2B, 0x3C)
key = bytes([0x1A, 0x2B, 0x3C])

decoded = bytes([data[i] ^ key[i % len(key)] for i in range(len(data))])

FLAG = decoded.decode('utf-8')

print("Decoded:")
print(FLAG)
# print("\nHex of decoded bytes:")
# print(decoded.hex())

```

>`AEGIS{Go_for_broke_in_this_game!}`

### callback

這題繞了有點久 原本已經提出shell code 後面被自己+windbg繞了進去在看動態解密 其實靜態就可解了QQ
一打開IDA就看到牠缺了pdb
在看strings的時候看到有讀`flag.txt` -> 找到`sub_1400011C0()`

>[!note]+ source code
>```c
>  v21[0] = 0;
>  v21[2] = 0;
>  n15 = 15;
>  sub_1400016D0(v21);
>  memset(Buffer, 0, sizeof(Buffer));
>  v24 = 0;
>  v25 = 0;
>  v26 = 0;
>  if ( fopen_s(&Stream, "flag.txt", "r") || !Stream ) //readfile
>  {
>    MessageBoxW(0, aCanTFindOrOpen, L"ERROR", 0x10u);
>    PostQuitMessage(0);
>    if ( n15 < 0x10 )
>      return 0;
>    v11 = (void *)v21[0];
>    if ( n15 + 1 < 0x1000 )
>      goto LABEL_8;
>    v11 = *(void **)(v21[0] - 8LL);
>    if ( (unsigned __int64)(v21[0] - (_QWORD)v11 - 8LL) <= 0x1F )
>      goto LABEL_8;
>    goto LABEL_24;
>  }
>  fread(Buffer, 1u, 0x2Cu, Stream);
>  v26 = 0;
>  fclose(Stream);
>  *(_OWORD *)WideCharStr = 0;
>  v28 = 0;
>  v29 = 0;
>  v30 = 0;
>  v31 = 0;
>  v32 = 0;
>  v33 = 0;
>  MultiByteToWideChar(0, 0, (LPCCH)Buffer, -1, WideCharStr, 45);
>  lpAddress_1 = (__int64 (__fastcall *)(_OWORD *))VirtualAlloc(0, 0x272u, 0x1000u, 0x40u);
>  lpAddress = lpAddress_1;
>  if ( !lpAddress_1 )
>  {
>    v10 = sub_140001840(std::cerr);
>    std::ostream::operator<<(v10, sub_140001A00);
>    goto LABEL_5;
>  }
>  lpAddress_2 = (__int64 (__fastcall *)(_QWORD))lpAddress_1;
>  v14 = &unk_140005040;
>  n4 = 4;
>  do
>  {
>    *(_OWORD *)lpAddress_2 = *v14;
>    *((_OWORD *)lpAddress_2 + 1) = v14[1];
>    *((_OWORD *)lpAddress_2 + 2) = v14[2];
>    *((_OWORD *)lpAddress_2 + 3) = v14[3];
>    *((_OWORD *)lpAddress_2 + 4) = v14[4];
>    *((_OWORD *)lpAddress_2 + 5) = v14[5];
>    *((_OWORD *)lpAddress_2 + 6) = v14[6];
>    lpAddress_2 = (__int64 (__fastcall *)(_QWORD))((char *)lpAddress_2 + 128);
>    *((_OWORD *)lpAddress_2 - 1) = v14[7];
>    v14 += 8;
>    --n4;
>  }
>  while ( n4 );
>  *(_OWORD *)lpAddress_2 = *v14;
>  *((_OWORD *)lpAddress_2 + 1) = v14[1];
>  *((_OWORD *)lpAddress_2 + 2) = v14[2];
>  *((_OWORD *)lpAddress_2 + 3) = v14[3];
>  *((_OWORD *)lpAddress_2 + 4) = v14[4];
>  *((_OWORD *)lpAddress_2 + 5) = v14[5];
>  *((_OWORD *)lpAddress_2 + 6) = v14[6];
>  *((_WORD *)lpAddress_2 + 56) = *((_WORD *)v14 + 56);
>  if ( Msg == 1140 )
>  {
>    v16 = lpAddress(Buffer);
>    OK_right_ = L"OK right!!";
>    if ( v16 != 1 )
>      OK_right_ = L"Sorry......Keep it up";
>    MessageBoxW(hWnd, OK_right_, L"<< MSG >>", 0);
>    VirtualFree(lpAddress, 0, 0x8000u);
>    PostQuitMessage(0);
>LABEL_5:
>    if ( n15 < 0x10 )
>      return 0;
>    v11 = (void *)v21[0];
>    if ( n15 + 1 < 0x1000 || (v11 = *(void **)(v21[0] - 8LL), (unsigned __int64)(v21[0] - (_QWORD)v11 - 8LL) <= 0x1F) )
>    {
>LABEL_8:
>      j_j_free(v11);
>      return 0;
>    }
>LABEL_24:
>    invalid_parameter_noinfo_noreturn();
>  }
>  VirtualFree(lpAddress, 0, 0x8000u);
>  v18 = DefWindowProcW(hWnd, Msg, wParam, lParam);
>  if ( n15 >= 0x10 )
>  {
>    v19 = (void *)v21[0];
>    if ( n15 + 1 >= 0x1000 )
>    {
>      v19 = *(void **)(v21[0] - 8LL);
>      if ( (unsigned __int64)(v21[0] - (_QWORD)v19 - 8LL) > 0x1F )
>        goto LABEL_24;
>    }
>    j_j_free(v19);
>  }
>  return v18;
>}
>```

```c
lpAddress_1 = ( (__int64 (__fastcall *)(_OWORD *)) 
                VirtualAlloc(0, 0x272u, 0x1000u, 0x40u) );
lpAddress = lpAddress_1;
```

這裡用 VirtualAlloc 搞了一塊可讀可寫的記憶體 後面宣告成func ptr來執行(`__int64 (__fastcall *)(_OWORD *)`) 推測之後會被當成函數呼叫


>[!tip]+ references
>
>看到 virtualAlloc 基本都很sus
>
>```c
>LPVOID VirtualAlloc(
>  [in, optional] LPVOID lpAddress,
>  [in]           SIZE_T dwSize, --> 0x272
>  [in]           DWORD  flAllocationType,
>  [in]           DWORD  flProtect --> 0x40, PAGE_EXECUTE_READWRITE
>);
>```
>
>其中
>`0x40`, **PAGE_EXECUTE_READWRITE**, 啟用對已認可頁面區域的執行、唯讀或讀取/寫入存取權。  

之後把`&unk_140005040`的東西塞進去那塊記憶體去執行
但是那堆東西看進去是一段被放在data的`shellcode`，開頭的東西是`55 48 8B EC` 對應了 `push rbp; mov rbp, rsp`

```c
.data:0000000140005040 unk_140005040   db  55h ; U             ; DATA XREF: sub_1400011C0+1A0↑o
.data:0000000140005041                 db  48h ; H
.data:0000000140005042                 db  8Bh
.data:0000000140005043                 db 0ECh
.data:0000000140005044                 db  48h ; H
.data:0000000140005045                 db  81h
```

於是IDA一通操作 `c`轉換成code, 之後按`p`轉換成func就又能分析了
看到裡面做了幾個位移轉換再進行字串比較

**Step 1.**
兩個字互換的swap `e.g. ABCD -> BADC`
**Step 2.**
四個字組成一組 `e.g. ABCD --> v2 = 0x41424344`
**Step 3.**
整個乘二，跟 `0x94E590u` XOR，再加20
**Step 4.**
進行比較

```c
__int64 __fastcall sub_140005040(__int64 a1)
{
  memset(v8, 0, sizeof(v8));
  v9 = 0;
  memset(v10, 0, sizeof(v10));
  v11 = 0;
  for ( n42 = 0; n42 <= 42; n42 += 2 ) // swap in pairs
  {
    *((_BYTE *)v8 + n42) = *(_BYTE *)(n42 + 1LL + a1); // v8[i] = a1+1
    *((_BYTE *)v8 + n42 + 1) = *(_BYTE *)(n42 + a1); // v8[i+1] = a1
  }
  
  for ( n43 = 0; n43 <= 43; n43 += 4 )
  {
    v2 = 0;
    for ( n3 = 0; n3 <= 3; ++n3 ) // group in 4
      v2 = (v2 << 8) | *((unsigned __int8 *)v8 + n43 + n3);
      
    for ( n3_1 = 3; n3_1 >= 0; --n3_1 ) // x2 -> XOR -> +20
      *((_BYTE *)v10 + 3 - n3_1 + n43) = (((2 * v2) ^ 0x94E590u) + 20) >> (8 * n3_1);
  }
  
  v12[0] = 0x6E6732F63277168ALL;
  v12[1] = 0x426306DC420BFEF2LL;
  v12[2] = 0x5A5BFCC65C8956D8LL;
  v12[3] = 0x62397CD2602358EALL;
  v12[4] = 0x42230CD8142F2AE6LL;
  n1847588040 = 1847588040;
  v14 = 0;
  for ( n43_1 = 0; n43_1 <= 43; ++n43_1 )
  {
    if ( *((_BYTE *)v10 + n43_1) != *((_BYTE *)v12 + n43_1) )
      return 0;
  }
  return 1;
}
```

所以逆推就是
- 從 `v12` 每 4 byte → 合成整數 R
- 還原 `v2 = ((R - 20) ^ 0x94E590) // 2`
- 再拆成 4 byte，組合起來得到 `v8`
- 最後把 pair-swap 還原 → 得到輸入 flag

```python
def invert_transform(v12_bytes: bytes) -> bytes:
    rev_str = bytearray()
    for i in range(0, len(v12_bytes), 4):
        R = int.from_bytes(v12_bytes[i:i+4], "big")
        v2 = ((R - 20) ^ 0x94E590) // 2
        rev_str.extend(v2.to_bytes(4, "big"))

    # word swap
    recovered = bytearray(len(rev_str))
    for i in range(0, len(rev_str), 2):
        recovered[i] = rev_str[i + 1]
        recovered[i + 1] = rev_str[i]

    return bytes(recovered)


if __name__ == "__main__":
    v12_parts = [
        0x6E6732F63277168A,
        0x426306DC420BFEF2,
        0x5A5BFCC65C8956D8,
        0x62397CD2602358EA,
        0x42230CD8142F2AE6,
    ]
    n1847588040 = 0x6E1FF4C8

    v12 = b"".join(p.to_bytes(8, "little") for p in v12_parts)
    v12 += n1847588040.to_bytes(4, "little")

    flag = invert_transform(v12)
    print("flag:", flag)
```

>`AEGIS{eA5y_wIn_Call64ck_function_sHeLl_c0de}`

### minielf
:(((( 真的很bad

## Pwn
### n2
從零開始pwn就從aegis開始🤡
這次是一個UAF的漏洞 前面跟 minielf 掙扎太久最後直接 vibe pwn
跟gpt一通操作到了可以注入但是會跑無限迴圈
後面重新分析了一下

首先它是一個heap的UAF 在找資料的時候有看這篇 感覺方向很接近 而且也都是菜單題--> [[CTF]PWN--堆--UAF漏洞_pwn uaf-CSDN博客](https://blog.csdn.net/2301_79880752/article/details/136566776)

總之思路的部分是: free large chunk -> leak libc -> 寫入 one_gadget -> 觸發 -> 拿到 interactive shell


>[!quote]+ source code
>主選單
>
>```c
> switch ( p_n4 )
>    {
>      case 3:
>        show_note();
>        break;
>      case 1:
>        add_note();
>        break;
>      case 2:
>        backup_and_delete_note();
>        break;
>```
>
>主要的 UAF 在 `backup_and _delete_note` 只有 free mem 沒有 free ptr, 所以指針還是指向記憶體
>```c
>unsigned __int64 backup_and_delete_note(void)
>{
>    *(_QWORD *)&p_size[1] = *(_QWORD *)std::vector<Note *>::operator[](&notes, p_size[0]);
>    if ( *(_DWORD *)(*(_QWORD *)&p_size[1] + 16LL) <= 0x200u )
>    {
>      v5 = std::operator<<<std::char_traits<char>>(&std::cout, "Backing up note ");
>      v6 = std::ostream::operator<<(v5, p_size[0]);
>      v7 = std::operator<<<std::char_traits<char>>(v6, "...");
>      std::ostream::operator<<(v7, &std::endl<char,std::char_traits<char>>);
>      v8 = std::operator<<<std::char_traits<char>>(&std::cout, "Backup successful.");
>      std::ostream::operator<<(v8, &std::endl<char,std::char_traits<char>>);
>      // free content & struct
>      free(*(void **)(*(_QWORD *)&p_size[1] + 8LL));
>      free(*(void **)&p_size[1]);
>      // clear to null
>      *(_QWORD *)std::vector<Note *>::operator[](&notes, p_size[0]) = 0;
>      v9 = std::operator<<<std::char_traits<char>>(&std::cout, "Note ");
>      v10 = std::ostream::operator<<(v9, p_size[0]);
>      v4 = std::operator<<<std::char_traits<char>>(v10, " deleted successfully.");
>    }
>    else
>    {
>      v3 = std::operator<<<std::char_traits<char>>(&std::cout, "Backup failed: Note content is too large to backup.");
>      std::ostream::operator<<(v3, &std::endl<char,std::char_traits<char>>);
>      // free content & note struct
>      free(*(void **)(*(_QWORD *)&p_size[1] + 8LL));
>      free(*(void **)&p_size[1]);
>      // HERE DIDNT CLEAR TO NULL
>      v4 = std::operator<<<std::char_traits<char>>(&std::cout, "Deletion aborted. Please try again later.");
>    }
>    std::ostream::operator<<(v4, &std::endl<char,std::char_traits<char>>);
>  }
>  return v13 - __readfsqword(0x28u);
>}
>```
>
>然後在`show_note`只有驗證是否null指標 所以一樣可以存取到
>
>```c
>unsigned __int64 show_note(void)
>{
>
>  *(_QWORD *)&p_size[1] = __readfsqword(0x28u);
>  std::operator<<<std::char_traits<char>>(&std::cout, "Enter note index to show: ");
>  std::istream::operator>>(&std::cin, p_size);
>  v0 = p_size[0];
>  // only checking null ptr
>  if ( v0 >= std::vector<Note *>::size(&notes) || !*(_QWORD *)std::vector<Note *>::operator[](&notes, p_size[0]) )
>  {
>    v2 = std::operator<<<std::char_traits<char>>(&std::cout, "Invalid index or note already deleted.");
>  }
>  else
>  {
>    v3 = (void (***)(void))std::vector<Note *>::operator[](&notes, p_size[0]);
>    (**v3)();
>    v4 = std::operator<<<std::char_traits<char>>(&std::cout, "Content: ");
>    v5 = std::vector<Note *>::operator[](&notes, p_size[0]);
>    v2 = std::operator<<<std::char_traits<char>>(v4, *(_QWORD *)(*(_QWORD *)v5 + 8LL));
>  }
>  // reading the content which already been released
>  std::ostream::operator<<(v2, &std::endl<char,std::char_traits<char>>);
>  return *(_QWORD *)&p_size[1] - __readfsqword(0x28u);
>}
>```

##### Background Check

```bash
┌──(kali㉿kali)-[/media/sf_SHARED_FILE/AEGIS26/pwn/n2]
└─$ ldd n2 
        linux-vdso.so.1 (0x00007f8996902000)
        libstdc++.so.6 => /lib/x86_64-linux-gnu/libstdc++.so.6 (0x00007f8996600000)
        libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007f899640a000)
        libm.so.6 => /lib/x86_64-linux-gnu/libm.so.6 (0x00007f899631a000)
        /lib64/ld-linux-x86-64.so.2 (0x00007f8996904000)
        libgcc_s.so.1 => /lib/x86_64-linux-gnu/libgcc_s.so.1 (0x00007f89968b5000)

┌──(kali㉿kali)-[/media/sf_SHARED_FILE/AEGIS26/pwn/n2]
└─$ gdb-pwndbg n2                

pwndbg> checksec
File:     /media/sf_SHARED_FILE/AEGIS26/pwn/n2/n2
Arch:     amd64
RELRO:      Partial RELRO
Stack:      Canary found
NX:         NX enabled
PIE:        No PIE (0x400000)
SHSTK:      Enabled
IBT:        Enabled
Stripped:   No
```

(先這樣 exploit晚點寫QQ)