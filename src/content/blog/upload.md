---
title: 'Test777'
description: 'Tes777'
publish: true
created_date: 2024-12-31
tags:
  - test
---

### What is control?

```python
import random
```

![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/202307172136299.png)

### Methmatical Models of System

Systems(plants) are dynamical in nature and usually described by different equations

![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/202307172144782.png)


>[!Check] Laplace Transform
>consider a function $f(t)$, the Laplace transform of $f(t)$ is $$F(s)=\int_{0}^{\infty}f(t)dt=\mathscr{L}(f(t))$$ 
>and the inverse Laplace transform is  $$f(t)=\frac{1}{2\pi j}\int_{\sigma -jw}^{\sigma +jw} F(s)e^{st}ds$$
>拉式/反拉式互為反運算

![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/202307172157305.png)

>[!note] Example
>![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/202307172159258.png)


### <font color="#c0504d">Transfer function of linear system</font>
memo: SSR important

>[!Danger] Transfer function
>the ratio of the Laplace transform of the output variable to the input variable <u>with all initial consition assumed to be zero</u>
>系統輸入/輸出的拉式比值，並假設初始條件為零

以上面的m.c.k系統為例

$\Rightarrow Ms^2Y(s)+bsY(s)+kY(s)=R(s)$

==*transfer function:*==

$\dfrac{output}{input} = \dfrac{T(s)}{R(s)}= \dfrac{1}{Ms^2+bs+k}$

>[!Danger] Linear function
>$y=f(x)$ is a linear function if 
>
>$y_{1}=f(x_1)$ ,  $y_{2}=f(x_2)$ 
>
>$\Rightarrow f(a_1x_1+a_2x_2)=a_1x_1+a_2x_2$
>
>---
>結論:
>1. transfer function $\frac{Y(s)}{R(s)}=G(s)$ is a linear relation
>2. ==只有線性系統有transfer function!!==


![image.png](https://raw.githubusercontent.com/Ash0645/image_remote/main/202307172219100.png)

>Ex1 證明線性
>Ex2 舉例類線性

>[!tip] 作業
>2.4 2.5 2.7 2.15