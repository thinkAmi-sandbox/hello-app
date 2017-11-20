$(function() {
    window.onload = function () {
        // モーダルの画面を開くイベントを割り当てる
        $("#set_user").on("click", openModal);
        // Todoを作るイベントも割り当てる
        $("#add").on("click", createTodo);
        // Todoを表示する
        show_todos();
    };

    function openModal(){
        // 元々の画面の機能を無効化する
        $("#set_user").off("click");
        // モーダルの画面を有効化する
        $("#update_user").on("click", updateUser);
        $("#modal_step1").css("display", "block");
    }

    function updateUser(){
        new_user_name = $("#new_user").val();
        user_data = {
            "user_name": new_user_name
        };
        $.ajax({
            url: "/todo/api/user",
            type: "post",
            // JSON.stringify()しないと、Flask側で処理できない
            data: JSON.stringify(user_data),
            contentType: 'application/json',
            dataType: 'json'
        }).done(function(data, textStatus, jqXHR){
            // 成功した時はステップ2の画面を表示する
            // ステップ1の機能を無効化する
            $("#update_user").off("click");
            $("#modal_step1").css("display", "none");
            // ステップ2の機能を有効化する
            $("#close_user").on("click", finishModal);
            $("#modal_step2").css("display", "block");
            // 元々の画面にユーザ名を反映しておく
            $("#user_name").text(new_user_name);
        }).fail(function(jqXHR, textStatus, errorThrown){
            // エラーの時は、モーダルにエラーを表示する
            $("#modal_message").text("ユーザ名の更新に失敗しました")
        }).always(function () {
            console.log(new_user_name);
        });
    }

    function finishModal(){
        // ステップ2の機能を無効化する
        $("#close_user").off("click");
        $("#modal_step2").css("display", "none");
        // 再度、モーダルを開けるようにする
        $("#set_user").on("click", openModal);
    }

    function createTodo(){
        // formの値なので、jQuery.val()メソッドを使う
        content = $("#content").val();
        todo = {
            "content": content
        };
        $.ajax({
            url: "/todo/api/todo/create",
            type: "post",
            data: JSON.stringify(todo),
            contentType: 'application/json',
            dataType: 'json'
        }).done(function(data, textStatus, jqXHR){
            window.alert('ok');
        }).fail(function(jqXHR, textStatus, errorThrown){
            // エラーの時は、モーダルにエラーを表示する
            $("#modal_message").text("ユーザ名の更新に失敗しました")
        }).always(function () {
            console.log(new_user_name);
        });
    }

    function show_todos() {
        content = $("#content").val();
        todo = {
            "content": content
        };
        $.ajax({
            url: "/todo/api/todo",
            type: "get"
            // contentType: 'application/json',
            // dataType: 'json'
        }).done(function(data, textStatus, jqXHR){
            console.log(data);
            var todos = '';
            var dones = '';
            for (var key in data){
                var content = data[key]['content'];
                if (data[key]['is_done']){
                    dones += '<li id="todo_' + key + '">' + content + '</li>';
                }
                else {
                    todos += '<li id="done_' + key + '">' + content + '</li>';
                }
            }
            $("#todo_list").append(todos);
            $("#done_list").append(dones);
        });
    }
    
    // $("#todo_form").submit(function(){
    //     // formの値なので、jQuery.val()メソッドを使う
    //     window.alert($("#todo").val());
    //
    //     // こんな感じで変数に入れても良い
    //     var todo = $("#todo");
    //     window.alert(todo.val());
    //
    //     if (todo.val() === ""){
    //         // type="submit"なので、submitイベントでfalseを返すと、submitをキャンセルできる
    //         $("#message").text('todoに何か入力してください');
    //         return false
    //     }
    //     else {
    //         $("#message").text("");
    //     }
    // });
});
