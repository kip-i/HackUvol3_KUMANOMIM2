

/*firebaseの関数を書いたファイル*/

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
        projectPeiriod: [startTime,endTime],
        projectDecisionName: 0,
        projectmenberName: [null]
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

function getProjectMembers(){
    let ID;
    
    ID = getParam("project");
    db.collection("project").doc(ID).data()["projectMemberName"];
    /*.then((query)=>{
        var buff = [];
        query.forEach((doc)=>{
            var data = doc.data();
            buff.push([data.projectMemberName]);
        });
    })
    .catch((error)=>{
        console.log("データの取得に失敗しました(${error})");
    });
    */
    return buff;//参加者の名前が入った配列を返す
}

function getProjectperiodStart(){
    let ID;
    ID = getParam("project");
    //start = new Date();
    var docRef=db.collction("project").doc(ID);
    //docRef.get().then((doc)=>{
        var buff = doc.data()["projectPeriod[0]"];
        //buff.push([doc.projectPeriod[0]]);
    //})

    let start=new Date(buff[0]/10000,(buff[0]%10000)/100,(buff[0]%100));
    return start;
}

function getProjectPeriodFinish(){
    let ID;
    
    ID = getParam("project");
    //end = new date();

    var docRef = db.collection("project").doc(ID);
    //docRef.get().then((doc)=>{
        var buff = doc.data()["projectPeriod[1]"];
    //    buff.push([doc.projectPeriod[1]]);
    //})
    let end=new Date(buff[1]/10000,(buff[1]%10000)/100,(buff[1]%100));
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


