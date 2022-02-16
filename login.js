  let db=firebase.firestore();
  let userid="";

  //DOM取得
  var inputarea = document.getElementById('input-area');
  var newuser = document.getElementById('newuser');
  var login = document.getElementById('login');
  var mypage = document.getElementById('mypage');
//  var logout = document.getElementById('logout');
  var info = document.getElementById('info');
  
  
  
  //新規登録処理
  newuser.addEventListener('click', function(e) {
    var name= document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .catch(function(error) {
      alert('登録できません（' + error.message + '）');
    });

    userid = firebase.auth().currentUser.uid;

    db.collection(userid).add({
      name:name,
      password:password
    })
    .catch(function (error) { // 失敗した場合に実行される箇所
      console.error("Error adding document: ", error);
    });
  });
  
  
  
  //ログイン処理
  login.addEventListener('click', function(e) {
    var name= document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    
    firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(function(error) {
      alert('ログインできません（' + error.message + '）');
    });

    userid = firebase.auth().currentUser.uid;

    db.collection(userid).add({
      name:name,
      password:password
    })
    .catch(function (error) { // 失敗した場合に実行される箇所
      console.error("Error adding document: ", error);
    });
  });
  
  
  
  //ログアウト処理
/*
  logout.addEventListener('click', function() {
    firebase.auth().signOut();
  });
*/  

mypage.addEventListener('click', function(e) {
  window.location="login.html";
});
  
  
  //認証状態の確認
  firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
      userid = firebase.auth().currentUser.uid;

      loginDisplay();
    }
    else {
    //  logoutDisplay();
    }
  });
  
  
  
  function loginDisplay() {
  //  logout.classList.remove('hide');
    inputarea.classList.add('hide');
    getUserName();
    info.textContent = "ログイン中です！";
    window.location="mypage.html";
  }
  
/*  
  function logoutDisplay() {
    logout.classList.add('hide');
    inputarea.classList.remove('hide');
  
    info.textContent = "";
  }
*/

function getUserName(){
  var userName=db.collection(userid).get().data();
  return userName;
}
