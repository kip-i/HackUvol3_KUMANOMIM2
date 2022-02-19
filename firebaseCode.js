

/*firebaseの関数を書いたファイル*/

function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
//Date型の日付をintの形に変換
function transDateToInt(date){
    
    var dividDate=date.split("-",3);
    
    /*日時をyyyymmdd(y:年,m:月,d:日)の形に変換*/
    var intDate = parseInt(dividDate[0] * 10000) + parseInt(dividDate[1] * 100) + parseInt(dividDate[2]);
   
    return intDate;
}

/*プロジェクトを作成する関数.小塚*/
/*
*projectName            :String
*projectStartPeriod     :Date
*projectEndPeriod       :Date
*/
function createProject( projectName, projectStartPeriod, projectEndPeriod,projectId,url){

    /*日時をyyyymmdd(y:年,m:月,d:日)の形に変換*/
    var startTime = transDateToInt(projectStartPeriod);
    var endTime = transDateToInt(projectEndPeriod);
    
    //データベースにドキュメントを更新.決まっていいない値はnullか0
    db.collection("project").doc(projectId).set({
        URL: url,
        menberId:  [null],
        projectName: projectName,
        projectPeriod: [startTime,endTime],
        projectDecisionName: 0,
        projectMemberName: [null]
    })
}

/*my日程を保存する関数.小塚*/
function setMySchedule( uid, mySchedule){
    
    var today = new Date();     //今日の日付
    var scheduleDate;           //登録する日時をintの形で入れておく変数
    var scheduleId = [];        //ドキュメントのIDを入れておく配列
   
    //ドキュメントのIDをすべて取得
    db.collection("account").doc(uid).collection("myScheduleId").get()
    .then(
        (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                //var data = doc.data();
                scheduleId[i] = doc.id;
                i++;
            });
        }).catch((error) => {
        console.log("データ取得失敗(${error})");
    });
    
    var index = 0;  //配列は全部つながっているので分ける時に使用するインデックス

    //ループして全部更新
    for(i = 0;i < 60;i++,index = index + 144){
        scheduleDate = transDateToInt(today);   //日付の指定

        //データの保存
        db.collection("account").doc(uid).collection("mySchedule").doc(scheduleId[i]).set({
            date: scheduleDate,
            mySchedule: mySchedule.slice(index,index + 144)
        })

        today.setDate(today.getDate() + 1);     //日付を1日進める
    }
}

/*my日程を取得する関数.小塚*/
function getMySchedule(uid){

    var today = new Date();     //今日の日付を取得
    var finalDay = new Date();

    var stringDay;

    finalDay.setDate(finalDay.getDate + 59);    //登録可能な一番遠い日付を入れておく

    stringDay = today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate();

    var intToday = transDateToInt(stringDay);      //今日の日付をintの形に変換

    var pastDataId = [];     //過去の日付のドキュメントIDを入れる配列
    var defaultPeriod = [];  //初期状態の日程
    var i = 0;               //ループ用

    //初期状態の生成
    for(i = 0;i < 144;i++){
        defaultPeriod[i] = 1;
    }

    i = 0;  //iの初期化
    //過去の日付のデータ検索.ドキュメントIDを保存
    db.collection("account").doc(uid).collection("myScheduleId").where("date","<",intToday).get()
    .then(
        (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                //var data = doc.data();
                pastDataId[i] = doc.id;
                i++;
        });
    }).catch((error) => {
        console.log("データ取得失敗(${error})");
    });

    //過去のデータを更新
    for(i = 0;i < pastDataId.length;i++){

        //過去のデータのドキュメントを入力されていない日付のデータとして更新
        db.collection("account").doc(uid).collection("myScheduleId").doc(pastDataId[i]).set({
            date : transDateToInt(finalDay),
            mySchedule : defaultPeriod
        })

        finalDay.setDate(finalDay.getDate - 1);
    }

    var mySchedule = [];      //今日から順にデータを入れておく
    var data; 

    //日付で昇順にして日程を取得
    db.collection("account").doc(uid).collection("myScheduleId").orderBy("date").get()
    .then(
        (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                data = doc.data();

                //値渡しで日程をコピー
                for(var k = 0; k < 144;k++){
                    mySchedule[mySchedule.length + k] = data[k];
                }
        });
    }).catch((error) => {
        console.log("データ取得失敗(${error})");
    });

    return mySchedule;
}

/*firebaseの関数を書いたファイル*/ 
//let db = firebase.firestore(); // データベースに関する機能の取得

async function getProjectMembers(){
    let ID = getParam("project");
    var buff;
    db.collection("project").doc(ID).get()
    .then((query)=>{
        buff = query.data()["projectmenberName"];
    })
    .catch((error)=>{
        console.log("データの取得に失敗しました(${error})");
    });
    console.log(buff);
    return buff;//参加者の名前が入った配列を返す
}
async function getProjectPeriodStart(){
    let ID = getParam("project");
    var buff;
    var date;
    date=await db.collection("project").doc(ID).get()
    .then((doc)=>{
        buff = doc.data()["projectPeiriod"];
        let temp=parseInt(buff[0]);
        console.log(temp);
        return temp;   
    })
    console.log(date);
    var start=new Date(date/10000,(date%10000)/100,(date%100));
    console.log(start);
    return start;
}

async function getProjectPeriodFinish(){
    let ID = getParam("project");
    var buff;
    var date;
    date=await db.collection("project").doc(ID).get()
    .then((doc)=>{
        buff = doc.data()["projectPeiriod"];
        let temp=parseInt(buff[1]);   
        return temp;
    })
    let end=new Date(date/10000,(date%10000)/100,(date%100));
    console.log(end);
    return end;
}

function getProjectMemberSchedule(menberIndex){
    var data = [];

    db.collection("project").doc(ID).collection(projectMenberPeriod).where("menberIndex","==",menberIndex)
    .get()
    .then((querySnapshot) =>{
        querySnapshot.forEach((doc) => {
            data = doc.data()["projectSchedule"];
            //projectSchedule.push(data.projectSchedule);
        });
    }).catch((error) => {
        console.log("データの取得に失敗しました(${error})");
    })
    return data;
}



