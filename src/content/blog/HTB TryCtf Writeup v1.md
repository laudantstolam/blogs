---
title: HTB TryCtf Writeup V1
description: just for fun and practice revrevrev
publish: true
tags:
  - writeup
created_date: 2025-07-11
---

### OverView

| <font color="#c0504d">total</font> | Reverse | Pwn | Web | Crypto | Misc/Forensic |
| :--------------------------------- | :------ | :-- | :-- | :----- | :------------ |
| 8                                  | 3       | 0   | 2   | 1      | 2             |

| challenge | difficulty | genere  |
|:--------- |:---------- | ------- |
| rev_01    | 💔         | Reverse |
| web_00    | 💔         | Web     |
|           | 💔         |         |

## REV
### FlagCasino

Basically just a flag checker

```c
int __cdecl main(int argc, const char **argv, const char **envp)
{
  char v4; // [rsp+Bh] [rbp-5h] BYREF
  unsigned int i; // [rsp+Ch] [rbp-4h]

  puts("[ ** WELCOME TO ROBO CASINO **]");
  puts(
    "     ,     ,\n"
    "    (\\____/)\n"
    "     (_oo_)\n"
    "       (O)\n"
    "     __||__    \\)\n"
    "  []/______\\[] /\n"
    "  / \\______/ \\/\n"
    " /    /__\\\n"
    "(\\   /____\\\n"
    "---------------------");
  puts("[*** PLEASE PLACE YOUR BETS ***]");
  for ( i = 0; i <= 28; ++i ) <-- check for 28 times
  {
    printf("> ");
    if ( (unsigned int)__isoc99_scanf(" %c", &v4) != 1 )
      exit(-1);
    srand(v4);
    if ( rand() != check[i] ) <-- compare with check[29]
    {
      puts("[ * INCORRECT * ]");
      puts("[ *** ACTIVATING SECURITY SYSTEM - PLEASE VACATE *** ]");
      exit(-2);
    }
```

The flow was basically:
- Check flag for 28 times
	- v4 = Input 1 word
	- use  `srand(v4)` to set seed
	- call rand()
	- check if `rand() = check[i]`

since we have `check`, we can mimic the rand input seed

PoC
```c
#include <stdio.h>
#include <stdlib.h>

unsigned int check[] = {
    0x244B28BE, 0x0AF77805, 0x110DFC17, 0x07AFC3A1, 0x6AFEC533,
    0x4ED659A2, 0x33C5D4B0, 0x286582B8, 0x43383720, 0x055A14FC,
    0x19195F9F, 0x43383720, 0x63149380, 0x615AB299, 0x6AFEC533,
    0x6C6FCFB8, 0x43383720, 0x0F3DA237, 0x6AFEC533, 0x615AB299,
    0x286582B8, 0x055A14FC, 0x3AE44994, 0x06D7DFE9, 0x4ED659A2,
    0x0CCD4ACD, 0x57D8ED64, 0x615AB299, 0x22E9BC2A
};

int main() {
    for (int i = 0; i < sizeof(check)/sizeof(check[0]); i++) {
        int found = 0;
        for (int c = 0x20; c <= 0x7E; c++) {  // printable ASCII
            srand(c);
            unsigned int r = rand();
            if (r == check[i]) {
                printf("%c", c);
                found = 1;
                break;
            }
        }
        if (!found) {
            printf("?");
        }
    }
    printf("\nDone.\n");
    return 0;
}
```

`flag=HTB{r4nd_1s_v3ry_pr3d1ct4bl3}`

### Slash

JUST OPEN UR IDA 

```c
int __cdecl main(int argc, const char **argv, const char **envp)
{
  unsigned int v3; // eax
  int v4; // eax
  int i; // [rsp+Ch] [rbp-4h]

  setvbuf(_bss_start, 0LL, 2, 0LL);
  v3 = time(0LL);
  srand(v3);
  puts("Diving into the stash - let's see what we can find.");
  for ( i = 0; i <= 4; ++i )
  {
    putchar(46);
    sleep(1u);
  }
  v4 = rand();
  printf("\nYou got: '%s'. Now run, before anyone tries to steal it!\n", (&gear)[(v4 % 0x7F8uLL) >> 3]);
  return 0;
}
```

```
.data:0x7060 gear            dq offset aEbonyCoreOfPer
.data:0x7060                 ; DATA XREF: main+B4↑o
.data:0x7060                 ; "Ebony, Core of Perdition"
.data:0x7068                 dq offset aPhantomdreamTr ; "Phantomdream, Trinket of the Corrupted"
.data:0x7070                 dq offset aEarthsongDawnO ; "Earthsong, Dawn of Visions"
.data:0x7078                 dq offset aTormentBeaconO ; "Torment, Beacon of Twilight's End"
```

the `main()` func is 
`currtime -> set rand() -> get gear[rand_index] -> return and print`
so then i search in the stack and found
`.data:0x7368   dq offset aHtbN33dl31nAL0 ; "HTB{n33dl3_1n_a_l00t_stack}"`
maybe string search is faster ;)

