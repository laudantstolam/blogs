---
title: 資安筆記整理
description: 當初金盾準備期間看的一些小雜學，順便放上 blog當作整理或是做為之後延伸筆記的起點ovob
publish: true
tags:
  - notes
  - 資安
created_date: 2025-10-12
---
### Kerberos

![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20251014015158.png)

attack phase
- 偽造工作階段金鑰並使用假憑證 取得網域存取權或服務存取權。
- 憑證填充或暴力猜測使用者密碼的嘗試。這些攻擊大多以授予票據和初始票卷授予服務為目標。
- 惡意軟體
- DC 影子攻擊-取得網域控制器（DC）權限
[域渗透——Kerberoasting](https://3gstudent.github.io/%E5%9F%9F%E6%B8%97%E9%80%8F-Kerberoasting)
--> 非常好網站

### Shell Code

lang: zig
tutorial:
- [Shellcoding in Linux](https://www.exploit-db.com/docs/english/21013-shellcoding-in-linux.pdf) 
- [Zig 世代惡意程式戰記：暗影綠鬣蜥 の 獠牙與劇毒！ :: 2025 iThome 鐵人賽](https://ithelp.ithome.com.tw/users/20178131/ironman/8323)--> 非常好文章
##### payload 混淆
- XOR/RC4/AES
- IP 地址混淆 --> 把payload變成IPv4/v6
	- `ntdll.RtlIpv4StringToAddressA`
	- `ntdll.RtlIpv6StringToAddressA`
- MAC addr混淆 --> e.g.  AA-BB-CC-DD-EE-FF
	- `ntdll.RtlEthernetStringToAddressA`
- UUID 混淆
	- `rpcrt4.dll.UuidFromStringA `
- 工具
	- https://github.com/CX330Blake/ZYPE
	- [EgeBalci/sgn: Shikata ga nai (仕方がない) encoder ported into go with several improvements](https://github.com/EgeBalci/sgn)
- **延伸** [[原创]逆向玩家的免杀入门：9天搞定360核晶+卡巴动态查杀-编程技术-看雪论坛-安全社区|非营利性质技术交流社区](https://bbs.kanxue.com/thread-288602.htm)

### Prompting as a service

jail breaking prompt & techniq
keyword: Pliny the Liberator 
github: [elder-plinius󠄞󠄝󠄞󠄝󠄞󠄝󠄞󠄝󠅫󠄼󠄿󠅆󠄵󠄐󠅀󠄼󠄹󠄾󠅉󠅭󠄝󠄞󠄝󠄞󠄝󠄞󠄝󠄞](https://github.com/elder-plinius/L1B3RT4S)


