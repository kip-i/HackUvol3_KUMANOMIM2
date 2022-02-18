/*firebaseの関数を書いたファイル*/ 
let db = firebase.firestore(); // データベースに関する機能の取得

function getProjectMembers(){
    let ID;
    //↑プロジェクトidの取得が分からない
    ID = getParam()
    db.collection("project").collection(ID).get().then((query)=>{
        var buff = [];
        query.forEach((doc)=>{
            var data = doc.data();
            buff.push([doc.projectMemberName]);
        });
    })
    .catch((error)=>{
        console.log("データの取得に失敗しました(${error})");
    });
    return buff;//参加者の名前が入った配列を返す
}

function getProjectperiodStart(){
    let ID;
    //↑プロジェクトidの取得が分からない
    start = new date();
    
    var docRef=db.collction("project").doc(ID);

    docRef.get().then((doc)=>{
        var buff = [];
        buff.push([doc.projectPeriod[0]]);
    })

    start(buff[0]/10000,(buff[0]%10000)/100,(buff[0]%100));
    return start;
}

function getProjectPeriodFinish(){
    let ID;
    //↑プロジェクトidの取得が分からない
    end = new date();

    var docRef = db.collection("project").doc(ID);
    docRef.get().then((doc)=>{
        var buff = [];
        buff.push([doc.projectPeriod[1]]);
    })
    end(buff[1]/10000,(buff[1]%10000)/100,(buff[1]%100));
    return end;
}

function getProjectMemberSchedule(menberIndex){
    var projectSchedule = [];

    db.collection("project").document(ID).collection(projectMenberPeriod).whhere("menberIndex","==",menberIndex)
    .get()
    .then((querySnapshot) =>{
        queruSnapshot.forEach((doc) => {
            var data = doc.data();
            projectSchedule.push([data.projectSchedule]);
        });
    }).catch((error) => {
        console.log("データの取得に失敗しました(${error})");
    })
    return projectSchedule[0];
}