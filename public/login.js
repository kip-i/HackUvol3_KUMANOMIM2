let db=firebase.firestore();
let userid="";
var userName="";


//新規登録処理
function createUser() {
  userName= document.getElementById('name').value;
  var mailAddress = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  if(userName==""){
    alert("ユーザ名を入力してください");
    return;
  }
  var weekArray=[];
  console.log(userName);
  if(userName==""){
    alert("ユーザ名を入力してください");
    return;
  }
  for(let i=0;i<7;i++){
    for(let j=0;j<144;j++){
      weekArray[i*144+j]=1;
    }
  }
  
  firebase.auth().createUserWithEmailAndPassword(mailAddress, password)
  .then(function(){  
    inputarea.classList.add('hide');
    info.textContent = "アカウント作成中です!";

    userid = firebase.auth().currentUser.uid;
    console.log(userid);
    console.log(userName,mailAddress,password);
    db.collection("account").doc(userid).set({
      name:userName,
      mailadd:mailAddress,
      pass:password,
      joinProject:[""],
      week:weekArray
    })
    .then(function(){
      console.log("登録成功!");
     
      for(let i=0;i<60;i++){   
        console.log(i); 
        db.collection("account").doc(userid).collection("myScheduleId").doc().set({
          date:-1,
          mySchedule:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        })
      }
      setTimeout(function(){
        window.location="mypage.html";
      },  1000*2);
      
    })
    .catch(function (error) { // 失敗した場合に実行される箇所
      console.error("Error adding document: ", error);
    });
  })
  .catch(function(error) {
    alert('登録できません（' + error.message + '）');
  });
}

var projectId="";
//ログイン処理
function login() {
  var userName= document.getElementById('name').value;
  var mailAddress = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  if(userName==""){
    alert("ユーザ名を入力してください");
    return;
  }
  
  firebase.auth().signInWithEmailAndPassword(mailAddress, password)
  .then(function(){
    userid = firebase.auth().currentUser.uid;
    let url=location.href;
    if(url.match(/project/)){
      let temp=url.split("project=",2);
      projectId=temp[1];
      window.location="project.html?project="+projectId;
    }
    else{
      loginDisplay();
    }
  })
  .catch(function(error) {
    alert('ログインできません（' + error.message + '）');
  });
}

//ログアウト処理
/*
logout.addEventListener('click', function() {
  firebase.auth().signOut();
});
*/  

//認証状態の確認
firebase.auth().onAuthStateChanged(function(user) {
  if(user) {
    userid = firebase.auth().currentUser.uid;
    //loginDisplay();
  }
  else {
  //  logoutDisplay();
  }
});

function loginDisplay() {
//  logout.classList.remove('hide');
  inputarea.classList.add('hide');
  info.textContent = "ログイン中です!";
  window.location="mypage.html";
}

/*  
function logoutDisplay() {
  logout.classList.add('hide');
  inputarea.classList.remove('hide');

  info.textContent = "";
}
*/

