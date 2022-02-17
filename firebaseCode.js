/*firebaseの関数を書いたファイル*/

let db = firebase.firestore(); // データベースに関する機能の取得

/*プロジェクトを作成する関数.小塚*/
/*
*projectName            :String
*projectStartPeriod     :Date
*projectEndPeriod       :Date
*/
function createProject( projectName, projectStartPeriod, projectEndPeriod,projectUrl){
    var startTime = (projectStartPeriod.getFullYear * 10000) + (projectStartPeriod.getMonth * 100) + (projectStartPeriod.getDate);
    var endTime = (projectEndPeriod.getFullYear * 10000) + (projectEndPeriod.getMonth * 100) + (projectEndPeriod.getDate);
    var url = nill;

    db.collection("project").add({
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
    
    db.collection("accont").document(uid).collection("mySchedule").add({
        date: scheduleDate,
        mySchedule: mySchedule
    })
}

/*my日程を取得する関数*/
function getMySchedule(date, uid){

    var mySchedule = [];

    db.collection("accont").document(uid).collection("mySchedule").where("date","==",date).get()
    .then(
        (querySnapshot) => {
            mySchedule;
            querySnapshot.forEach((doc) => {
                var data = doc.data();
                mySchedule.push([doc.id,data.mySchedule,data.date]);
        });
    }).catch((error) => {
        console.log("データ取得失敗(${error})");
    });

    return mySchedule[1];
}