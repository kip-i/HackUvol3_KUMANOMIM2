//author:takuma
//kumanomiM2

/*url取得部分*/
function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//書き込み	set
//更新	update
//読み取り	onおよびonce
//削除	removeか、nullを書き込む

//データベースに関する
//let db = firebase.firestore();

/*あるプロジェクトの期間のあるユーザーのマイスケジュールを返す*/
async function getUserSchedule(userId){
    /*あるプロジェクトIDのプロジェクトの開始日、終了日を取得する*/
    var projectId = getParam("project");
    var period = [];
    period = await db.collection("project").doc(projectId).get()
    .then((querySnapshot)=>{
        return querySnapshot.data()["projectPeriod"];
    })
    /*あるユーザーIDをもつユーザーのプロジェクトの期間のマイスケジュールを取得する*/
    var projectPeriodMySchedule = [];
    console.log(userId);
    projectPeriodMySchedule = await db.collection("account").doc(userId).collection("myScheduleId")
    .where("date", ">=", period[0]).where("date", "<=", period[1]).orderBy("date").get()
    .then(async (querySnapshot)=>{
        let kari = [];
            kari = await querySnapshot.docs.map((doc) => {
                let data = doc.data()["mySchedule"];
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
    })
    console.log(projectPeriodMySchedule);
    return projectPeriodMySchedule;
}

/*function setJoinMenber(memberName,newSchedule){
    var projectId = getParam("project");

    db.collection("project").doc(projectId).set({
        projectMemberName:memberName
    })
    .then(function() {
        console.log("memberName successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document(memberName): ", error);
    });

    db.collection("project").doc(projectId).collection(projectMemberPeriod).set({
        projectSchedule:newSchedule
    })
    .then(function() {
        console.log("newSchedule successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document(newScedule): ", error);
    });

    return null;
}*/
/*わかりやすくするために仮引数memberIndexを改めmemIndexと名付けた*/
/*function setLoginMember(memIndex,schedule){
    var projectId = getParam("project");

    db.collection("project").doc(projectId).collection(projectMemberPeriod).set({
        memberIndex:memIndex,
        projectSchedule:schedule
    })
    .then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });

    return null;
}
*/
////////////////////////////////////////////////
function setJoinMember(memIndex,memberName,newSchedule){
    console.log("set");
    setprojectData("",memIndex,memberName,newSchedule);

    /*
    //データベースから名前の配列を取得してから、配列の要素を追加して、それをsetしないとだめでは？
    var projectId = getParam("project");
    var data;
    //名前の配列を取得
    let StringMenbaerName = db.collection("project").doc(projectId).get()
    .then((querySnapshot) => {
        var buff = querySnapshot.docs.map(doc=>{
            data = doc.data()["projectMenberName"];
        })
        data = data + [memberName];     //新たにメンバーを追加
   })
   .catch((error)=>{
       console.log("データの取得失敗");
   })
    db.collection("project").doc(projectId).set({
        projectMemberName:data
    })
    .then(function() {
        console.log("memberName successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document(memberName): ", error);
    });
    //名前の設定ここまで
    db.collection("project").doc(projectId).collection(projectMemberPeriod).add({
        menberId: "0",
        projectSchedule:newSchedule,
        memberIndex:(data.length - 1)
    })
    .then(function() {
        console.log("newSchedule successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document(newScedule): ", error);
    });
    return null;
    */
}

/*わかりやすくするために仮引数memberIndexを改めmemIndexと名付けた*/
async function setLoginMember(userId,memIndex,projectSchedule,mySchedule){
    //var projectId = getParam("project");
    //var userId = null;

    //uidの取得
    /*userId = await firebase.auth().onAuthStateChanged(function (user) {
        var id = null;
        if (user) {
            id = firebase.auth().currentUser.uid;
        }
        return id;
    });
*/
    var memberName =await db.collection("account").doc(userId).get()
    .then((querySnapshot) =>{
        console.log("start");
        var buff =  querySnapshot.data()["name"];
        console.log(buff);
        return buff;  
    }).catch((error) => {
        console.log("データの取得に失敗しました(${error})");
    })
    console.log(mySchedule);
    let schedule=await diffSchedule(userId,projectSchedule,mySchedule);
    setprojectData(userId,memIndex,memberName,schedule);


    /*
    db.collection("project").doc(projectId).collection(projectMemberPeriod).set({
        memberIndex:memIndex,
        projectSchedule:schedule
    })
    .then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
    return null;
    */
}


function setprojectData(userId,memIndex,memberName,newSchedule){
    var projectId = getParam("project");
    console.log("kokomade");
    //データベースから名前の配列を取得してから、配列の要素を追加して、それをsetしないとだめでは？
    //名前の配列を取得
    var documentId;
    if(memIndex==0){
        documentId=db.collection("project").doc(projectId).collection("projectMemberPeriod").doc().id;
    }
    
    db.collection("project").doc(projectId).update({
        memberId: firebase.firestore.FieldValue.arrayUnion(userId),
        projectMemberName:firebase.firestore.FieldValue.arrayUnion(memberName)
    })
    .then(function(){
        db.collection("account").doc(userId).update({
            joinProject: firebase.firestore.FieldValue.arrayUnion(projectId)
        })
    })
   .catch((error)=>{
       console.log("データの取得失敗");
   })

    db.collection("project").doc(projectId).collection("projectMemberPeriod").add({
        memberId: userId,
        projectSchedule:newSchedule,
        memberIndex:memIndex
    })
    .then(function() {
        console.log("newSchedule successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document(newScedule): ", error);
    });

    if(memIndex==0){
        db.collection("project").doc(projectId).update({
            memberId: firebase.firestore.FieldValue.arrayRemove(""),
            projectMemberName:firebase.firestore.FieldValue.arrayRemove("")
        })
       .catch((error)=>{
           console.log("データの取得失敗");
       })
    
        db.collection("project").doc(projectId).collection("projectMemberPeriod").doc(documentId).delete();
        console.log("delete");
    }
}