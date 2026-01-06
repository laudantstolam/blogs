---
title: Windows Kernel 101
subtitle:
description: w/ Holyhigh , Angelboy
publish: true
tags:
  - notes
  - 資安
  - Windows
featured_image:
created_date: 2025-12-21
---
>[!quote]+ 環境設定
>**VM-win11 25H2**
>
>- 開debug mode
>- 設定`bcdedit /dbgsettings net hostip:<Host_IP> port:50000 key:1.2.3.4`
>![image.png|250](https://raw.githubusercontent.com/Ash0645/image_remote/main/20251221104913.png)
>- Load Driver
>	- `sc create vulnD type=kernel binPath= "VulDriver.sys"`
>	- `sc [start/stop/delete] vulnD`
>**HOST**
>- WINDBG 設定
>- kernel attach 設定VM IP跟 上面設定的port/key
>

>[!tldr]+ 
>![](https://raw.githubusercontent.com/Ash0645/image_remote/main/NotebookLM%20Mind%20Map%20(1).png)


# WinBasic & Windbg Basic

#### process in windbg
- eprocess
`!process`

#### threads in windbg
- etheads
- kthreads
- irplist
### 權限相關背景知識
#### Integrity Level
一般都是medium-low
可以手動調整 `icacls ImageFile /setintegritylevel Low` (只能設定成比自己低的)
![image.png|500](https://raw.githubusercontent.com/Ash0645/image_remote/main/20251221113916.png)

####  DACL
![image.png|225](https://raw.githubusercontent.com/Ash0645/image_remote/main/20251221114238.png)

#### SID 監控
- tool: PsGetSid.exe
#### Privillages
- super previllage
#### Token
- 調整: AdjustTokenPrivileges
- 要改至少需要是high level
- `!token [address of _TOKEN]`
	- 查看該 token 的資訊
- `dt _token [address of _TOKEN]`
#### Access check
- `!object [address of object]`
- `dt _OBJECT_HEADER [address of object header]`
- `!sd [address of SD] & -10`

### 記憶體相關背景知識
#### Pages
- 已經commit/release 出去的Instruction
- Use page table tot turn VA to PA
**Demand Paging** -> thread 要access才alloc

####  TLP
因為每次都要很久所以搞了一個Page Label

#### Page Table
 ### PTE
##### LAB0 - 手動解析虛擬位址 → 物理位址

 ```
 @!PEX
 ```


```bash
1: kd> lm m nt Browse full module list start end module name fffff805`76a00000 fffff805`774b6000 nt (pdb symbols) C:\ProgramData\Dbg\sym\ntkrnlmp.pdb\E0093F3AEF15D58168B753C9488A40431\ntkrnlmp.pdb Unable to enumerate kernel-mode unloaded modules, HRESULT 0x80004005 

1: kd> r cr3 cr3=00000000001ad002 

1: kd> ? 00000000001ad002 & 0xFFFFFFFFFFFFF000 Evaluate expression: 1757184 = 00000000`001ad000 

1: kd> ? (fffff805`76a00000 >> 30) & 0x1FF Evaluate expression: 511 = 00000000`000001ff 

1: kd> ? (fffff805`76a00000 >> 39) & 0x1FF Evaluate expression: 127 = 00000000`0000007f 

1: kd> ? (fffff805`76a00000 >> 21) & 0x1FF Evaluate expression: 2 = 00000000`00000002 

1: kd> ? (fffff805`76a00000 >> 12) & 0x1FF Evaluate expression: 424 = 00000000`000001a8 

1: kd> ? (fffff805`76a00000) & 0xFFF Evaluate expression: 0 = 00000000`00000000

1: kd> dq /p @@(0x1ad000 + 127*8)
00000000`001ad3f8  00000000`00000000 00000000`00000000
00000000`001ad408  00000000`00000000 00000000`00000000
00000000`001ad418  00000000`00000000 00000000`00000000
00000000`001ad428  00000000`00000000 00000000`00000000
00000000`001ad438  00000000`00000000 00000000`00000000
00000000`001ad448  00000000`00000000 00000000`00000000
00000000`001ad458  00000000`00000000 00000000`00000000
00000000`001ad468  00000000`00000000 00000000`00000000
```

# Windows Driver & Vuln Hunting

#### Win Driver
- WDM (Windows Driver Model) 🌟
- KMDF (Kernel-Mode Driver Framework)
- Win32k/GDI: 一堆洞
- Mini-Filter : 專門拿來hook (馬師他超愛

##### TOOL
- Winobj
	- device/objects
#### IRP Close v.s. Cleanup

```c
 DriverObject->MajorFunction[IRP_MJ_CLOSE] = VulClose ; 
 // release file obj
 DriverObject->MajorFunction[IRP_MJ_CLEANUP] = VulCleanUp; 
 // 關掉最後一個handler 
```

不太一樣 close 會刪掉reference count, clean up 不會(聽說這邊曾經有洞)
(gpt 小整理)
1. **Cleanup (****IRP_MJ_CLEANUP****)**：
	-  **觸發時機**：當 User Mode 應用程式對裝置的 **Handle 數目降為 0** 時觸發（例如應用程式呼叫 `CloseHandle` 或崩潰關閉）
	- **目的**：取消該 Handle 尚未完成的 I/O 請求，清理與該 Handle 相關的 Context（如教材 中清理 `FileObject` 相關資料）。此時 Kernel 裡的 File Object 還沒被銷毀，只是 User 已經不握有 Handle 了。

2. **Close (****IRP_MJ_CLOSE****)**：
    - **觸發時機**：當該 File Object 的 **Reference Count (參照計數) 降為 0** 時觸發。這通常發生在 Cleanup 之後。
    -  目的：真正銷毀 File Object。這代表系統中再也沒有任何元件（包含 User Application 或其他 Kernel Driver）指涉到這個物件了。

**總結：** 寫 Driver 時要先寫 `DriverEntry` 初始所有入口，記得在 `Unload` 把建出來的東西（Device/SymLink）刪掉。而在處理關閉請求時，通常會在 `Cleanup` 階段釋放跟 User Handle 綁定的資源，`Close` 則是物件生命週期的最後終結。

#### IO在系統裡面怎麼處理的

User data handling
- buffer IO
- direct IO
- neither nor

#### 選擇適合的存取方法

API: `IRP_MJ_*`

| READ/WRITE                 | DEVICE_CONTROL/INTERNAL_DEVICE_CONTROL           |
| -------------------------- | ------------------------------------------------ |
| DEVICE_OBJECT 中的Flags 欄位決定 | IOCTL code 裡面的method項目                           |
|                            | `CTL_CODE(DeviceType, Function, Method, Access)` |
|                            | 這邊的Access是在NTCreateFile的時候指定的---^                |
##### 細說Access

一般來說會給到最大 --> MAXIMUM_ALLOWED
- 嘗試用 `CreateFile(..., MAXIMUM_ALLOWED, ...)` 打開驅動裝置。
- 如果失敗，就改用最低限度的權限 (`FILE_READ_ATTRIBUTES | SYNCHRONIZE`)。
- 雖然這樣不能做讀寫，但仍然可以發送 `FILE_ANY_ACCESS` 的 IOCTL，跟驅動互動。

### LAB1 - Emunerating Services

>[!check]+ LAB1
>
>嘗試利用DeviceIoControl與driver(VulDriver.sys) 互動
>• 發送特定的IOCTL_VUL_TEST並讀出結果(HelloWorld) 
>• 練習斷點，並觀察IRP內容
>
>---
>```c
>#include <windows.h>
>#include <winternl.h>
>#include <stdio.h>
>
>#define DIRECTORY_QUERY 0x0001
>#define OBJ_CASE_INSENSITIVE 0x00000040L
>#define FILE_NON_DIRECTORY_FILE 0x00000040
>#define FILE_SYNCHRONOUS_IO_NONALERT 0x00000020
>
>#pragma comment(lib, "ntdll.lib")
>
>typedef struct _OBJECT_DIRECTORY_INFORMATION {
>    UNICODE_STRING Name;
>    UNICODE_STRING TypeName;
>} OBJECT_DIRECTORY_INFORMATION, * POBJECT_DIRECTORY_INFORMATION;
>
>typedef NTSTATUS(NTAPI* PNtOpenDirectoryObject)(PHANDLE, ACCESS_MASK, POBJECT_ATTRIBUTES);
>typedef NTSTATUS(NTAPI* PNtQueryDirectoryObject)(HANDLE, PVOID, ULONG, BOOLEAN, BOOLEAN, PULONG, PULONG);
>typedef NTSTATUS(NTAPI* PNtOpenFile)(PHANDLE, ACCESS_MASK, POBJECT_ATTRIBUTES, PIO_STATUS_BLOCK, ULONG, ULONG);
>
>void ListAndTestDevices() {
>    HMODULE hNtdll = GetModuleHandleA("ntdll.dll");
>    PNtOpenDirectoryObject NtOpenDirectoryObject = (PNtOpenDirectoryObject)GetProcAddress(hNtdll, "NtOpenDirectoryObject");
>    PNtQueryDirectoryObject NtQueryDirectoryObject = (PNtQueryDirectoryObject)GetProcAddress(hNtdll, "NtQueryDirectoryObject");
>    PNtOpenFile NtOpenFile = (PNtOpenFile)GetProcAddress(hNtdll, "NtOpenFile");
>
>    HANDLE hDir;
>    OBJECT_ATTRIBUTES attr;
>    UNICODE_STRING dirName;
>    RtlInitUnicodeString(&dirName, L"\\Device");
>    InitializeObjectAttributes(&attr, &dirName, OBJ_CASE_INSENSITIVE, NULL, NULL);
>
>    NTSTATUS status = NtOpenDirectoryObject(&hDir, DIRECTORY_QUERY, &attr);
>    if (status != 0) {
>        printf("Failed to open \\Device. Status: 0x%08X\n", status);
>        return;
>    }
>
>    // Use a larger buffer to ensure we catch the first batch of entries
>    BYTE buffer[8192];
>    ULONG context = 0, returnLength = 0;
>
>    printf("%-35s | %-15s | %-15s\n", "Device Name", "Type", "Status (Hex)");
>    printf("-------------------------------------------------------------------------------------\n");
>
>    // Query the directory. If status is STATUS_NO_MORE_ENTRIES (0x80000006), the loop ends.
>    while ((status = NtQueryDirectoryObject(hDir, buffer, sizeof(buffer), FALSE, FALSE, &context, &returnLength)) >= 0) {
>        POBJECT_DIRECTORY_INFORMATION info = (POBJECT_DIRECTORY_INFORMATION)buffer;
>
>        while (info->Name.Buffer != NULL && info->Name.Length > 0) {
>
>            // Build full path safely
>            WCHAR fullPath[512] = { 0 };
>            wcscpy_s(fullPath, 512, L"\\Device\\");
>            wcsncat_s(fullPath, 512, info->Name.Buffer, info->Name.Length / sizeof(WCHAR));
>
>            UNICODE_STRING uDevName;
>            RtlInitUnicodeString(&uDevName, fullPath);
>
>            OBJECT_ATTRIBUTES devAttr;
>            InitializeObjectAttributes(&devAttr, &uDevName, OBJ_CASE_INSENSITIVE, NULL, NULL);
>
>            HANDLE hDevice = NULL;
>            IO_STATUS_BLOCK ioStatus;
>
>            NTSTATUS openStatus = NtOpenFile(
>                &hDevice,
>                GENERIC_READ | SYNCHRONIZE,
>                &devAttr,
>                &ioStatus,
>                FILE_SHARE_READ | FILE_SHARE_WRITE,
>                FILE_NON_DIRECTORY_FILE | FILE_SYNCHRONOUS_IO_NONALERT
>            );
>
>            printf("%-35wZ | %-15wZ | ", &info->Name, &info->TypeName);
>
>            if (openStatus == 0) {
>                printf("[ SUCCESS ] 0x%08X\n", openStatus);
>                CloseHandle(hDevice);
>            }
>            else {
>                printf("[  FAIL   ] 0x%08X\n", openStatus);
>            }
>
>            info++; // Advance pointer
>        }
>
>        // If the buffer was exactly full, there might be more, but usually context handles this.
>        if (status == 0x80000006) break;
>    }
>
>    CloseHandle(hDir);
>}
>
>int main() {
>    ListAndTestDevices();
>    printf("\nDone. Press any key...");
>    getchar();
>    return 0;
>}
>```

### IOCTL

![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20251226202252.png)


### LAB2

嘗試利用DeviceIoControl與driver(VulDriver.sys) 互動 
• 發送特定的IOCTL_VUL_TEST並讀出結果(HelloWorld) 
• 練習斷點，並觀察IRP內容

觀察driver code的設定

```c
NTSTATUS status;
UNICODE_STRING devName = RTL_CONSTANT_STRING(L"\\Device\\Vul");
UNICODE_STRING symName = RTL_CONSTANT_STRING(L"\\??\\Vul");
```

```c
case IOCTL_VUL_TEST:
{
	// 檢查 input buffer 至少 4 bytes
    if (irpSp->Parameters.DeviceIoControl.InputBufferLength < 4) {
        status = STATUS_BUFFER_TOO_SMALL;
        break;
    }
    magic = *(ULONG*)Irp->AssociatedIrp.SystemBuffer;
    if (magic != 0x13371337) { // 這邊的buffer size要特別看一下
        status = STATUS_INVALID_PARAMETER;
        break;
    }
    const wchar_t* msg = L"HelloWorld";
    ULONG bytes = (ULONG)((wcslen(msg) + 1) * sizeof(wchar_t));

	// 檢查 output buffer
    if (irpSp->Parameters.DeviceIoControl.OutputBufferLength < 0x1337) {
        status = STATUS_BUFFER_TOO_SMALL;
        break;
    }
    RtlCopyMemory(Irp->AssociatedIrp.SystemBuffer, msg, bytes);
    info = bytes;     
    status = STATUS_SUCCESS;
    break;
}
```

主要注意的就是buffer跟magic的值
```c
#include <windows.h>
#include <stdio.h>

#define FILE_DEVICE_VUL 0x8000
#define IOCTL_VUL_TEST CTL_CODE(FILE_DEVICE_VUL, 0x800, METHOD_BUFFERED, FILE_ANY_ACCESS)

int main()
{
    HANDLE hDevice = CreateFileW(
        L"\\\\.\\Vul",
        GENERIC_READ | GENERIC_WRITE,
        0,
        NULL,
        OPEN_EXISTING,
        FILE_ATTRIBUTE_NORMAL,
        NULL
    );

    ULONG magic = 0x13371337;
    wchar_t outBuf[0x2000] = { 0 }; // >= 0x1337 (4919) bytes
    DWORD bytesReturned = 0;

    printf("[DEBUG] Sending IOCTL_VUL_TEST with magic 0x%X...\n", magic);
    BOOL ok = DeviceIoControl(
        hDevice,
        IOCTL_VUL_TEST,
        &magic,
        sizeof(magic),
        outBuf,
        sizeof(outBuf),
        &bytesReturned,
        NULL
    );

    if (!ok)
    {
        DWORD err = GetLastError();
        printf("[DEBUG] DeviceIoControl failed: %lu\n", err);
    }
    else
    {
        wprintf(L"[DEBUG] Returned %lu bytes: %s\n", bytesReturned, outBuf);
    }

    CloseHandle(hDevice);
    getchar();
    return 0;
}

```

```c
0: kd> !drvobj VulDriver 7

DriverEntry:   fffff8020f986000	
DriverStartIo: 00000000	
DriverUnload:  fffff8020f981ad0	
AddDevice:     00000000	

Dispatch routines:
[0e] IRP_MJ_DEVICE_CONTROL              fffff8020f981370	+0xfffff8020f981370
[12] IRP_MJ_CLEANUP                     fffff8020f9811f0	+0xfffff8020f9811f0
```

```
.text:0000000140001370 VulDeviceControl 
```

### LAB 3-5

練習開啟Special Pool (ntoskrnl.exe)
• 請嘗試觸發VulDriver中IOCTL_VUL_ALLOC Integer overflow 漏洞
• 請嘗試觸發VulDriver中IOCTL_VUL_GET_GLOBAL OOB的漏洞
• 請嘗試觸發VulDriver中IOCTL_VUL_GET_THREADIDUAF 漏洞

#### LAB3 Integer overflow
漏洞位置


```c
case IOCTL_VUL_ALLOC:
{
    pdata = (struct PrivateData*)irpSp->FileObject->FsContext;
    if (irpSp->Parameters.DeviceIoControl.InputBufferLength < 4) {
        status = STATUS_BUFFER_TOO_SMALL;
        break;
    }

    size = *(ULONG*)Irp->AssociatedIrp.SystemBuffer;
    ULONG allocate_size = size + 0x80;
    pdata->Buffer = ExAllocatePool2(POOL_FLAG_NON_PAGED, allocate_size, 'Vul2');
    
    if (!pdata->Buffer) {
        status = STATUS_INSUFFICIENT_RESOURCES;
        info = 0;
        break;
    }
    pdata->BufferSize = size;

    status = STATUS_SUCCESS;
    info = 0;
    break;
}
```

![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20251228035505.png)

```c
0: kd> bp fffff806`4aea1513
0: kd> bp fffff806`4aea153A
0: kd> bp nt!ExAllocatePool2
0: kd> bp fffff806`4aea15F0
0: kd> bp nt!KeBugCheckEx
0: kd> bl
     0 e Disable Clear  fffff806`4aea1370     0001 (0001) VulDriver+0x1370
     1 e Disable Clear  fffff806`4aea1513     0001 (0001) VulDriver+0x1513
     2 e Disable Clear  fffff806`4aea153a     0001 (0001) VulDriver+0x153a
     3 e Disable Clear  fffff806`b4b680f0     0001 (0001) nt!ExAllocatePool2
     4 e Disable Clear  fffff806`4aea15f0     0001 (0001) VulDriver+0x15f0
     5 e Disable Clear  fffff806`b44fb310     0001 (0001) nt!KeBugCheckEx
```

[Exploring malicious Windows drivers (Part 2): the I/O system, IRPs, stack locations, IOCTLs and more](https://blog.talosintelligence.com/exploring-malicious-windows-drivers-part-2/)

[【第 07 話】逆向分析 WDM 驅動程式 - iT 邦幫忙::一起幫忙解決難題，拯救 IT 人的一天](https://ithelp.ithome.com.tw/articles/10323858)