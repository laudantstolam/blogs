---
tags:
  - notes
  - Windows
publish: true
title: x86_64 OS internal notes
subtitle: i luve OS :(
description: notes to  OST2 Arch 2001
featured_image:
created_date: 2026-02-27
---

> [!NOTE] Links
> course: https://apps.p.ost2.fyi/learning/course/course-v1:OpenSecurityTraining2+Arch2001_x86-64_OS_Internals+2021_v1/home
> Notebook LLM: https://notebooklm.google.com/notebook/32b19e1c-2976-4b2a-8832-e62356f63861



## CPUID
> cpuid is the way that software finds out what features the hardware are supported

Detecting HyperThreading support using the CPUID instruction:
1. Check if CPUID is supported (via the EFLAGS ID flag).
2. Call CPUID with EAX=1 (processor info and features).
3. Inspect bit 28 of EDX — if set, HyperThreading is available, and the logical processor count can be read.

## Processor Execution Modes

![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/20260227182635.png)


| Mode                 | Description                                                                 | Key Features                                                                 |
|----------------------|-----------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| **Legacy Mode**      | Traditional x86 modes (Real, Protected, Virtual 8086).                      | 32‑bit kernel & apps, segmentation, paging, privilege rings.                  |
| **IA‑32e Mode**      | 64‑bit “Long Mode” introduced with AMD64/Intel x86‑64.                      | 64‑bit registers, flat memory model, supports 64‑bit & 32‑bit apps (compat).  |
| **64‑Bit Mode**      | Sub‑mode of IA‑32e for full 64‑bit execution.                               | Requires 64‑bit OS & apps, expanded registers.                                |
| **Compatibility Mode** | Sub‑mode of IA‑32e for running legacy 32‑bit apps under a 64‑bit OS.       | Runs 32‑bit code seamlessly, but kernel remains 64‑bit.                       |

## MSR
> MSR was like a manual of how to set the hardware features ON/OFF, basically guiding hardware feature detection and activation

#### Commands
- RDMSR
	- Opcode: ``0F 32
	- ONLY in kernel mode
- ERMSR
	- Opcode: `0F 30`
	- ONLY in kernel mode

#### IA32_EFER
- run in bot 64 and 32 bits mode

- `SCE`
	- trigger of Syscall
- ``LME
	- Long Mode ON

## Privilege Rings & Segmentation
#### Segment Regisers in x86 CPU
- **CS** (Code Segment)
	- where instructions are fetched from
- DS (Data Segment)
- **SS** (Stack Segment)
	-  where the stack lives
- ES (Extra Segment)
- FS
- GS

| Register | 32-bit             | 64-bit Modern Use                        |
| -------- | ------------------ | ---------------------------------------- |
| FS       | Extra data segment | Thread-Local Storage (Linux)             |
| GS       | Extra data segment | TEB (Windows) / sometimes kernel per-CPU |



## Interrupt
> Interrrupts are anotherr way to transform control from one segment to another segment at a different privilege level


> [!tldr]+ Mainpoint 
> `_Arch2001_05_Interrupts_01_InterruptVsException.pdf`
> - Interrupts vs Exceptions (E = Error)
> - Faults (RIP at faulting instruction) vs Traps (RIP after) vs Aborts
> - State saving on stack (32-bit vs 64-bit)
> - INT n, INT3, INT1, INTO, UD2, IRETQ
> - Privilege transitions via interrupts
> - Need Tasks/TSS next to decide where to push state


![image.png|475](https://raw.githubusercontent.com/Ash0645/image_remote/main/20260227170958.png)


![image.png|400](https://raw.githubusercontent.com/Ash0645/image_remote/main/20260227163918.png)
 - 32-bit - SYSENTER/SYSEXIT
 - 64-bit - SYSCALL/SYSRET
	- SYSRET is a privileged instruction btw

![image.png|425](https://raw.githubusercontent.com/Ash0645/image_remote/main/20260227170026.png)
####  Interrupt 0x80 (Linux)
- **Purpose:** Traditionally used in Linux on x86 to invoke system calls.
- **Mechanism:** A user program places the system call number in the `EAX` register, sets up arguments in other registers, then executes `int 0x80`.
	- BTW INT is pairing with IRET, just like PUSH/POP
- **Behavior:** The CPU switches from user mode to kernel mode, jumping to the interrupt handler defined for vector `0x80`. The kernel then dispatches the requested system call.
- **Notes:**  
  - This was the *classic* way to make syscalls in Linux.  
  - Modern Linux prefers the `sysenter`/`syscall` instructions (faster, designed for system calls specifically).

#### Interrupt 0x2E (Windows)
- **Purpose:** Used in older versions of Windows (NT family) for system calls.
- **Mechanism:** Similar to Linux’s `int 0x80`, user-mode code would trigger `int 0x2E` to request a service from the kernel.
- **Behavior:** The interrupt handler in the Windows kernel would decode the system call number and arguments, then execute the corresponding kernel routine.
- **Notes:**  
  - This mechanism was replaced in later Windows versions by `sysenter` (on 32-bit) and `syscall` (on 64-bit).  
  - Modern Windows no longer uses `int 0x2E` for syscalls, but you may still see it referenced in reverse engineering or legacy documentation.

#### TL;DR
`0x2E` and `0x80` are **interrupt vector numbers**. They don’t inherently mean “system call” by themselves; instead, the OS configures those interrupt vectors to point to its syscall handler. The CPU doesn’t know they’re special — it just sees “software interrupt with vector X” and jumps to the corresponding handler. The OS decides what those handlers do.



