

chrome.runtime.onMessage.addListener(function(respone, sender, sendRespone) {
  // if(respone.action == "login"){
  //   // $.ajax({
  //   //   type: "POST",
  //   //   url: 'http://localhost/v0v1/authen/login',
  //   //   data: {
  //   //     'email': respone.username,
  //   //     'password':respone.password
  //   //   },
  //   //   success: function(data){
  //   //
  //   //     if(data.success == true){
  //   //       console.log(data);
  //   //       alert(data);
  //   //       // localStorage.setItem('token',data.token);
  //   //       // $("#collectmemainwrapper").addClass('show');
  //   //       // isLogin();
  //   //     }
  //   //   }
  //   // });
  //
  //   setTimeout(function(){  sendResponse("hello"); }, 3000);
  // }
});
chrome.browserAction.onClicked.addListener(function (tab) { //Fired when User Clicks ICON
    // alert('hi');
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {action: "show"}, function(response) {});
    });
});
