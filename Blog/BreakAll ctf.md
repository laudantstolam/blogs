---
title: (Crypto) BreakAll ctf writeup
description: basic crypto practice :)
subtitle: i dunno crypto, i just cry
publish: true
tags:
  - writeup
created_date: 2023-09-11
---

## Crypto

### 01_ceaser

```
>>nc 23.146.248.23 7000

Caesar cipher is too simple so I developed a Caesar cipher PRO
alphabet set: abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!{}@#$%^&()_

flag: sIvrBrCCgtrvJrIqBBh
```
他有70個字所以可能有69種位移，用python搞個腳本試試
```
def caesar_cipher_pro_decrypt(ciphertext, shift):
    alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!{}@#$%^&()_"
    decrypted_text = ""
    for char in ciphertext:
        if char in alphabet:
            index = alphabet.index(char)
            new_index = (index - shift) % len(alphabet)
            decrypted_text += alphabet[new_index]
        else:
            decrypted_text += char
    return decrypted_text

ciphertext = "sIvrBrCCgtrvJrIqBBh"

for shift in range(1, 70):
    decrypted_text = caesar_cipher_pro_decrypt(ciphertext, shift)
    print(f"Shift {shift}: {decrypted_text}")
```

`Shift 17: breakall{caesar_kk}`

### 02_basE85

```
flag = Vsd*3+Y#hi3%`dv$#xP&bz^%8>W$o~0*{WN^B_^&Uu|$J?b%Y*g^V
---------------------
server.py
import base64
import string
import random

def custom_encode(text):
    text_bytes = text.encode('utf-8')
    base85_encoded = base64.b85encode(text_bytes).decode('utf-8')
    result = ''
    random.seed(2024)
    for i in range(len(base85_encoded)):
        result += base85_encoded[i]
        if i % 3 == 2:
            result += random.choice('!@#$%^&*')
    
    return result

flag =open('./flag', 'r').read()
encoded_flag = custom_encode(flag)
challenge_description = f"""
{encoded_flag}
```
每三個字加一個隨機特殊符號
所以先每三個字去除特殊符號 

```
>>> text = "Vsd3+Yhi3`dv#xPbz^8>Wo~0{WNB_^Uu|J?bY*gV"
>>> base64.b85decode(text.encode('utf-8'))
b'breakall{u_such_encoding_master}'
```
The `base64.b85decode()` function is designed to work with byte data. It cannot process Unicode strings directly, so you need to convert the string into bytes using `encode('utf-8')` before decoding.

### 03_what are they talking
```
what are yall talking about ????

hehe Flag：
mefqwqoo{lts_rzr_c_wuts}

hehe sAmple：
alf nqa (gfozv nqacv), qovt efgfeefr at qv rthfvazn nqa te ltcvf nqa, zv q vhqoo rthfvaznqafr nqeuzjtetcv hqhhqo. za zv alf tuox rthfvaznqafr vbfnzfv tg alf gqhzox gfozrqf. qrjqunfv zu qenlqftotdx qur dfufaznv lqjf vltsu alqa alf rthfvaznqaztu tg alf nqa tnnceefr zu alf ufqe fqva qetcur 7500 mn. za zv nthhtuox wfba qv q bfa qur gqeh nqa, mca qovt equdfv geffox qv q gfeqo nqa qjtzrzud lchqu ntuaqna. jqocfr mx lchquv gte nthbquztuvlzb qur zav qmzozax at wzoo jfehzu, alf nqa'v efaeqnaqmof noqsv qef

```

### 06_DH1
server:
```python
#!/usr/bin/env python3
from Crypto.Util.number import getPrime, bytes_to_long, long_to_bytes
import random
import signal

FLAG = open('./flag', 'rb').read()

def handle_timeout(signum, frame):
    print("\nTimeout!")
    exit(0)

signal.signal(signal.SIGALRM, handle_timeout)
signal.alarm(60)  

def generate_params():
    p = getPrime(512)
    g = 2
    return p, g

def main():
    print("Welcome to the Diffie-Hellman Challenge!")
    print("You have 60 seconds to solve this challenge.")
    p, g = generate_params()
    print(f"\np = {p}")
    print(f"g = {g}")
    server_private = random.randint(2, p-2)
    server_public = pow(g, server_private, p)
    print(f"\nServer's public key = {server_public}")
    try:
        client_public = int(input("\nEnter your public key: "))
        if client_public <= 1 or client_public >= p:
            print("Invalid public key!")
            return
        shared_secret = pow(client_public, server_private, p)
        key = shared_secret & 0xFFFF
        encrypted_flag = bytes_to_long(FLAG)
        encrypted_flag ^= key
        print(f"\nEncrypted flag = {encrypted_flag}")
    except ValueError:
        print("Invalid input!")
        return

if __name__ == "__main__":

    main()
```

已知
1. g=2
2. p=隨機512 bits的數字
3. server_private=隨機2~p之間的數字
4. <font color="#e36c09">srever_public</font>=`g^server_private mod p`
5. <font color="#e36c09">client_public</font>=用戶輸入
6. shared_secret=client_public^server_private mod p
>所以當client_public=g的時候srever_public=shared_secret

1. key=shared_secret &0xFFFF
2. <font color="#e36c09">enc_flag</font>=FLAG XOR key

所以輸入client_public=2
得到
```
p = 12343179061876211808663250732610838930896986592284885154104284741534828011967050389102393779988985401608153189347074923034674997355041119821436871526211979                                                                             
g = 2

Server's public key = 2088570131657992983223746155633548270945312926915578900487704641943718252304710363883072009218651171622522069600736116775276365133014680923241061944933430

Enter your public key: 2

Encrypted flag = 2918238088681828342761096565871362141810522886000066936083439028510417394126510411
```

先解XOR
```
A(FLAG) ^ B(key) = C(enc_flag)
C(enc_flag) ^ B(key) = A(FLAG)
```

 A(FLAG)=C(<font color="#e36c09">enc_flag</font>) ^ B(key)
 FLAG=<font color="#e36c09">enc_flag</font> ^ (shared_secret &0xFFFF)
 
 >因為當client_public=g的時候srever_public=shared_secre
 
 FLAG=<font color="#e36c09">enc_flag</font> ^ (<font color="#e36c09">srever_public</font> &0xFFFF)
 FLAG=<font color="#e36c09">enc_flag</font> ^ 15414
 FLAG = 2918238088681828342761096565871362141810522886000066936083439028510417394126513533
long_to_bytes(FLAG)=b'breakall{know_u_know_key_exchange}'

### 07_DH2

```python
enc = [22309, 19670, 13570....]
# print(len(enc))=43
# flag="breakall{demo}"
flag = "b"
flag = flag.encode()
count = 0
p = 43969

flag_byte = flag[0]

for i in range(2, p-2):
    shared = pow(22448, i, p) 
    guess = (flag_byte * shared) % p

    if guess == 22309:
        break

print("i=")
print(i) 
# i=a=6352
```

```

>>> i=6352
>>> p=43969
>>> pow(22448, i, p)
41056

shared=41056
```

```python
enc = [22309, 19670, 13570, 25222, 40061, 25222, 37148, 37148, 37422, 25222, 19670, 13570, 31048, 10931, 31048, 22309, 19670, 10931, 13844, 13570, 31048, 34235, 25222, 16757, 13844, 13570, 19670, 31048, 28409, 19670, 31048, 34235, 25222, 13844, 4831, 31048, 34235, 25222, 16757, 13844, 13570, 19670, 31596]
print(len(enc))
flag_head = "breakall{"

# p = 43969
# shared = 41056
count = 0
guess_list = "_0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!?"
result = []

for i in range(33):  
    enc_value = enc[i+9]
    for byte in guess_list:
        byte_value = ord(byte)
        guess = (byte_value * 41056) % 43969
        
        if guess == enc_value:
            result.append(byte)
            break

print(flag_head + ''.join(result) + "}")
```

`breakall{are_u_brute_master_or_math_master}`
