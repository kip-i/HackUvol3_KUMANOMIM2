

/*firebaseの関数を書いたファイル*/
/*編集者：小塚 */

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
        menberId:  ["1"],
        projectName: projectName,
        projectPeiriod: [startTime,endTime],
        projectDecisionName: 0,
        projectmenberName: ["1"]
    })
}

/*my日程を保存する関数.小塚*/
function setMySchedule( uid, mySchedule){

    for(let k = 0;k < 60;k++){
      for(let l = 0; l < 144;l++){
        mySchedule[k*144 + l] = 0;
      }
    }
    
    var today = new Date();     //今日の日付
    var scheduleDate;           //登録する日時をintの形で入れておく変数
    var scheduleId = [];        //ドキュメントのIDを入れておく配列
    var i = 0;
   
    //ドキュメントのIDをすべて取得
    db.collection("account").doc(uid).collection("myScheduleId").orderBy("date").get()
    .then(
        (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                //var data = doc.data();
                console.log(doc.id);
                scheduleId[i] = doc.id;
                i++;
            });

            var index = 0;  //配列は全部つながっているので分ける時に使用するインデックス
            //ループして全部更新
            for(i = 0;i < 60;i++,index = index + 144){
              
              var stringDay = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
              scheduleDate = transDateToInt(stringDay);   //日付の指定
             
              //データの保存
              db.collection("account").doc(uid).collection("myScheduleId").doc(scheduleId[i]).set({
                date: scheduleDate,
                mySchedule: mySchedule.slice(index,index + 144)
              })
              
              today.setDate(today.getDate() + 1);     //日付を1日進める
            }
        }).catch((error) => {
        console.log("データ取得失敗(${error})");
    });
}

/*my日程を取得する関数.小塚*/
async function getMySchedule(uid) {

    var today = new Date();     //今日の日付を取得
    var finalDay = new Date();
    var stringDay;
    finalDay.setDate(finalDay.getDate() + 59);    //登録可能な一番遠い日付を入れておく
    stringDay = today.getFullYear() + "-" + (today.getMonth() + 1)+ "-" + today.getDate();

    var intToday = transDateToInt(stringDay);      //今日の日付をintの形に変換

    var pastDataId = [];     //過去の日付のドキュメントIDを入れる配列
    var defaultPeriod = [];  //初期状態の日程
    var i = 0;               //ループ用

    //初期状態の生成
    for (i = 0; i < 144; i++) {
        defaultPeriod[i] = 1;
    }

    i = 0;  //iの初期化
    var idBuff = [];
    console.log(i);
    console.log(uid);
    //過去の日付のデータ検索.ドキュメントIDを保存
    db.collection("account").doc(uid).collection("myScheduleId").where("date", "<", intToday).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                //var data = doc.data();
                console.log(doc.id);
                pastDataId[i] = doc.id;
                i++;
            });

            //過去のデータを更新
            for (i = 0; i < pastDataId.length; i++) {
                console.log("データ更新開始");
                stringDay = finalDay.getFullYear() + "-" + (finalDay.getMonth() + 1) + "-" + finalDay.getDate();
                var intDate = transDateToInt(stringDay);
                //過去のデータのドキュメントを入力されていない日付のデータとして更新
                db.collection("account").doc(uid).collection("myScheduleId").doc(pastDataId[i]).set({
                    date: intDate,
                    mySchedule: defaultPeriod
                })
                finalDay.setDate(finalDay.getDate() - 1);
            }
        }).catch((error) => {
            console.log("データ取得失敗(${error})");
        });

    var mySchedule = [];      //今日から順にデータを入れておく
    var data;

    console.log("データ取得開始");
    //日付で昇順にして日程を取得
    mySchedule = await db.collection("account").doc(uid).collection("myScheduleId").orderBy("date").get()
        .then(async (querySnapshot) => {
            let kari = [];
            kari = await querySnapshot.docs.map((doc) => {
                data = doc.data()["mySchedule"];
                let temp = [];
                console.log("でーた取得中");
                //値渡しで日程をコピー
                for (var k = 0; k < 144; k++) {
                    temp[k] = data[k];
                }
                return temp;
            });

            let returnSchedule = [];

            for(let i = 0;i < kari.length;i++){
                for(let k = 0;k < kari[i].length;k++){
                    returnSchedule[i*144 + k] = kari[i][k];
                }
            }
            return returnSchedule;

        }).catch((error) => {
            console.log("データ取得失敗(${error})");
        });

    console.log(mySchedule);
    return mySchedule;
}