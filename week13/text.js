// /**
//  * @param {string} num1
//  * @param {string} num2
//  * @return {string}
//  */
// var addStrings = function(num1, num2) {
//     let c3 = 0;
//     // 用num1存结果，所以要确保num1是比较长的
//     if(num1.length < num2.length){
//         let t = num1;
//         num1 = num2;
//         num2 = t;
//     }


//     let len1 = num1.length - 1,
//         len2 = num2.length - 1;
//     while(len2 >= 0){
//         console.log(num1)
//         let c1 = + num1[len1],
//             c2 = + num2[len2];
//         let sum = c1 + c2 + c3 + "";
//         if(sum.length > 1){
//             num1[len1] = sum[1];
//             c3 = +sum[0];
//         }else{
//             num1[len1] = sum[0];
//             c3 = 0;
//         }
//         len1--;
//         len2--;
//     }
//     console.log(num1)
//     while(c3 != 0){
//         let c1 = + num1[len1];
//         let sum = c1 + c3 + "";
//         if(sum.length > 1){
//             num1[len1] = sum[1];
//             c3 = +sum[0];
//         }else{
//             num1[len1] = sum[0];
//             c3 = 0;
//         }
//         len1--;
//     }
//     console.log(num1)
//     return num1;
// };
// console.log("1012345","56765847840")

// console.log(addStrings("1012345","56765847840"))




// var compressString = function(S) {
//     let result = "",
//         temp = null,
//         count = 0;
//     for(c of S){
//         console.log("c in S:"+c)
//         if(c === temp){
//             count++;
//         }else if(temp !== null){
//             result = result+temp+count;
//             console.log(result)
//             temp = c
//             count = 1;
//             console.log("temp:"+temp)
//         }else{
//             temp = c
//             count = 1;
//             console.log("temp:"+temp)
//         }
//     }
//     return result.length > S.length ? S : result;
// };
// console.log(compressString("aabcccccaa"))

// var compress = function (chars) {
//     let p = 0,
//         temp = null,
//         count = 0;
//     for (c of chars) {
//         if (c === temp) {
//             count++;
//         } else if (temp !== null) {
//             chars[p] = temp;
//             if (count > 1) {
//                 temp = count + "";
//                 let i = 0;
//                 while (temp.length > i) {
//                     p += 1;
//                     chars[p] = temp[i];
//                     i++;
//                 }
//             }
//             p += 1;
//             temp = c
//             count = 1;
//         } else {
//             temp = c
//             count = 1;
//         }
//     }
//     chars[p] = temp;
//     if (count > 1) {
//         temp = count + "";
//         let i = 0;
//         while (temp.length > i) {
//             p += 1;
//             chars[p] = temp[i];
//             i++;
//         }
//     }
//     p += 1;
//     temp = c
//     count = 1;
//     // return chars.slice(0, p);
//     while (chars[p]) {
//         chars.pop()
//     }
//     return chars.length;
// };
// chars = ["a", "a", "b", "b", "c", "c", "c"]
// console.log(chars)
// console.log(compress(chars))
// console.log(chars)
// chars = ["a", "b", "c"]
// console.log(chars)
// console.log(compress(chars))
// console.log(chars)

/**
 * @param {string} s
 * @param {number} n
 * @return {string}
 */
var reverseLeftWords = function(s, n) {
    let t = s.slice(0,n)
    let r = s.slice(n)+t
    return r
};
s = "abcdefg", k = 2
console.log(s,k)
console.log(reverseLeftWords(s,k))
s = "lrloseumgh", k = 6
console.log(s,k)
console.log(reverseLeftWords(s,k))