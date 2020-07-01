# 十二周总结

## 正则表达式 RegExp

- lastIndex (/g后才生效)

```Javascript
    var re = /(hi)?/g;
    console.log(re.exec("hi")); //["hi", "hi", index: 0, input: "hi", groups: undefined]
    console.log(re.lastIndex); // 2
```

- exec
- |
- () 捕获
- (?:) 非捕获
- []
- 小技巧
  - /[\s\S]/ 匹配所有字符 不过其实直接 /./就可以了
  - /\w/

## 字符串分析算法

- 字典树
  - 大量字符串的完整匹配模式
- KMP
  - 长字符串中找子串 O（M+N）
- wildCard 通配符算法
  - 长字符串中找子串升级版
- 正则
  - 字符串通用模式匹配
- 状态机
  - 通用的字符串分析
- LL LR
  - 字符串多层级结构分析
