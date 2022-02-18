/*firebaseの関数を書いたファイル*/

let db = firebase.firestore(); // データベースに関する機能の取得

/*プロジェクトを作成する関数.小塚*/
/*
*projectName            :String
*projectStartPeriod     :Date
*projectEndPeriod       :Date
*/
function createProject( projectName, projectStartPeriod, projectEndPeriod,projectId){

    /*日時をyyyymmdd(y:年,m:月,d:日)の形に変換*/
    var startTime = (projectStartPeriod.getFullYear * 10000) + (projectStartPeriod.getMonth * 100) + (projectStartPeriod.getDate);
    var endTime = (projectEndPeriod.getFullYear * 10000) + (projectEndPeriod.getMonth * 100) + (projectEndPeriod.getDate);
    
    //データベースにドキュメントを更新.決まっていいない値はnullか0
    db.collection("project").doc(projectId).set({
        URL: url,
        menberId:  [""],
        projectName: projectName,
        projectPeiriod: [startTime,endTime],
        projectDecisionName: 0,
        projectmenberName: [""]
    })
}

/*my日程を保存する関数.小塚*/
function setMySchedule( uid, mySchedule, date){
    
    var scheduleDate =  (date.getFullYear * 10000) + (date.getMonth * 100) + (date.getDate);
    
    db.collection("account").doc(uid).collection("mySchedule").add({
        date: scheduleDate,
        mySchedule: mySchedule
    })
}

/*my日程を取得する関数*/
function getMySchedule(date, uid){


    var today = new Date();     //今日の日付を取得

    var intToday = (today.getFullYear * 10000) + (today.getMonth * 100) + (today.getDate);      //今日の日付をintの形に変換

    var pastDataId = [];    //過去の日付のドキュメントIDを入れる配列
    var i = 0;              //ループ用

    //過去の日付のデータ検索
    db.collection("account").doc(uid).collection("myScheduleId").where("date","<",intToday).get()
    .then(
        (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var data = doc.data();
                pastDataId[i] = data.id;
                i++;
        });
    }).catch((error) => {
        console.log("データ取得失敗(${error})");
    });

    var mySchedule = [[]];
   

    db.collection("account").doc(uid).collection("myScheduleId").where("date","==",date).get()
    .then(
        (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var data = doc.data();
                mySchedule[i].push([doc.id,data.mySchedule,data.date]);
                i++;
        });
    }).catch((error) => {
        console.log("データ取得失敗(${error})");
    });

    return mySchedule[1];
}