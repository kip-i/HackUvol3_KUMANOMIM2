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
function getUserSchedule(uid){
    /*あるプロジェクトIDのプロジェクトの開始日、終了日を取得する*/
    var projectId = getParam("project");
    var period = [];
    period = db.collection("project").doc(projectId).doc("projectPeriod").get();
    /*あるユーザーIDをもつユーザーのプロジェクトの期間のマイスケジュールを取得する*/
    var projectPeriodMySchedule = [];
    projectPeriodMySchedule = db.collection("account").doc(uid).collection("myScheduleId").where("date", ">=", period[0])
                                                                                          .where("date", "<=", period[1]).get();
    return projectPeriodMySchedule;
}

function setJoinMenber(memberName,newSchedule){
    
    setprojectData("0",memberName,newSchedule);

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
async function setLoginMember(memIndex,schedule){
    var projectId = getParam("project");
    var userid = null;

    //uidの取得
    userid = await firebase.auth().onAuthStateChanged(function (user) {
        var id = null;
        if (user) {
            id = firebase.auth().currentUser.uid;
        }
        return id;
    });

    var data;
    var menberName =await db.collection("project").doc(projectId).get()
    .then(async(querySnapshot) =>{
        console.log("start");
        
        var buff = await querySnapshot.docs.map(doc=>{
            data = doc.data()["name"];
            return data;
        })
        console.log(buff);
        return buff;
        
    }).catch((error) => {
        console.log("データの取得に失敗しました(${error})");
    })

    setprojectData(userid,menberName,schedule);


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


function setprojectData(userid,memberName,newSchedule){
    var projectId = getParam("project");
        
    //データベースから名前の配列を取得してから、配列の要素を追加して、それをsetしないとだめでは？
    var nameData;
    var idData;
    //名前の配列を取得
    let StringMenbaerName =db.collection("project").doc(projectId).get()
    .then((querySnapshot) => {
        querySnapshot.docs.map(doc=>{
            nameData = doc.data()["projectMenberName"];
            idData = doc.data()["projectMenberName"];
        })

        nameData = nameData + [memberName];     //新たにメンバーを追加
        idData = idData + [userid];             //id追加
   })
   .catch((error)=>{
       console.log("データの取得失敗");
   })

   //データの更新
    db.collection("project").doc(projectId).set({
        memberId: idData,
        projectMemberName:nameData
    })
    .then(function() {
        console.log("memberName successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document(memberName): ", error);
    });
    //名前の設定ここまで


    db.collection("project").doc(projectId).collection(projectMemberPeriod).add({
        menberId: userid,
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
}