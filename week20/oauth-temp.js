// publish-tool 唤起浏览器
// 浏览器获取 code

https://github.com/login/oauth/authorize?client_id=Iv1.c0b7f36b0f0d8b03&redirect_uri=http%3A%2F%2Flocalhost%3A8081&scope=read%3Auser&state=123456

// code: bf47b416f46ef1d281fa
// state: 123456

// 获取 access_token
// publish-server 
{
  let code = "29b9e7e31d319574d9bb"
  let state = "123456"
  let client_secret = "d4baa2dab7e2eee0a879d2cd9cc4df0d69b38bbc"
  let client_id = "Iv1.c0b7f36b0f0d8b03"
  let redirect_uri = encodeURIComponent("http://localhost:8000")
  
  let params = `code=${code}&state=${state}&client_secret=${client_secret}&client_id=${client_id}&redirect_uri=${redirect_uri}`
  
  let xhr = new XMLHttpRequest();
  
  xhr.open("POST", `https://github.com/login/oauth/access_token?${params}`, true)
  xhr.send()
  xhr.addEventListener("readystatechange", function (event) {
    if (xhr.readyState === 4) {
      console.log(xhr.responseText);
    }
  })
}

// access_token: 72e8db334c8e50e3d6bfec4991f73cf1d0ffcf96
// api.github.com/user

// curl -H "Authorization: token OAUTH-TOKEN" https://api.github.com/user

// 利用 access_token 调取其他接口
// publish-server publish-tool
{

let xhr = new XMLHttpRequest();

xhr.open("GET", `https://api.github.com/user`, true)
xhr.setRequestHeader("Authorization", "token 72e8db334c8e50e3d6bfec4991f73cf1d0ffcf96")
xhr.send()
xhr.addEventListener("readystatechange", function (event) {
  if (xhr.readyState === 4) {
    console.log(xhr.responseText);
  }
})
}