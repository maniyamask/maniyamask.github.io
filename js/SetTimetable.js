//コマの値（時限、曜日）
var period = 0;
var weekday = 0;

//設定単位数
var initGrades = 0;

//キャップ単位数
const capGrades = 24;

//テスト用Json
var testData;

$(document).ready(function () {

    //JSON取得関数
    setPreference();

    //初期設定コマ取得関数
    getInitFrame();

    //時間割の単位数を取得
    initGrades = getTotalGrade();
    $('#main-content__txt-grades').text(initGrades + '単位');

    //押下したボタンに対応するコマの値を引数にしてモーダルを表示
    $('#btn-mon1').on('click', function () {
        period = 0;
        weekday = 0;
        //モーダルを表示し、リストの講義データを取得
        getClassList(period, weekday);
    });
    $('#btn-tue1').on('click', function () {
        period = 0;
        weekday = 1;
        getClassList(period, weekday);
    });
    $('#btn-wed1').on('click', function () {
        period = 0;
        weekday = 2;
        getClassList(period, weekday);
    });
    $('#btn-thu1').on('click', function () {
        period = 0;
        weekday = 3;
        getClassList(period, weekday);
    });
    $('#btn-fri1').on('click', function () {
        period = 0;
        weekday = 4;
        getClassList(period, weekday);
    });
    $('#btn-sat1').on('click', function () {
        period = 0;
        weekday = 5;
        getClassList(period, weekday);
    });
    $('#btn-mon2').on('click', function () {
        period = 1;
        weekday = 0;
        getClassList(period, weekday);
    });
    $('#btn-tue2').on('click', function () {
        period = 1;
        weekday = 1;
        getClassList(period, weekday);
    });
    $('#btn-wed2').on('click', function () {
        period = 1;
        weekday = 2;
        getClassList(period, weekday);
    });
    $('#btn-thu2').on('click', function () {
        period = 1;
        weekday = 3;
        getClassList(period, weekday);
    });
    $('#btn-fri2').on('click', function () {
        period = 1;
        weekday = 4;
        getClassList(period, weekday);
    });
    $('#btn-sat2').on('click', function () {
        period = 1;
        weekday = 5;
        getClassList(period, weekday);
    });
    $('#btn-mon3').on('click', function () {
        period = 2;
        weekday = 0;
        getClassList(period, weekday);
    });
    $('#btn-tue3').on('click', function () {
        period = 2;
        weekday = 1;
        getClassList(period, weekday);
    });
    $('#btn-wed3').on('click', function () {
        period = 2;
        weekday = 2;
        getClassList(period, weekday);
    });
    $('#btn-thu3').on('click', function () {
        period = 2;
        weekday = 3;
        getClassList(period, weekday);
    });
    $('#btn-fri3').on('click', function () {
        period = 2;
        weekday = 4;
        getClassList(period, weekday);
    });
    $('#btn-sat3').on('click', function () {
        period = 2;
        weekday = 5;
        getClassList(period, weekday);
    });
    $('#btn-mon4').on('click', function () {
        period = 3;
        weekday = 0;
        getClassList(period, weekday);
    });
    $('#btn-tue4').on('click', function () {
        period = 3;
        weekday = 1;
        getClassList(period, weekday);
    });
    $('#btn-wed4').on('click', function () {
        period = 3;
        weekday = 2;
        getClassList(period, weekday);
    });
    $('#btn-thu4').on('click', function () {
        period = 3;
        weekday = 3;
        getClassList(period, weekday);
    });
    $('#btn-fri4').on('click', function () {
        period = 3;
        weekday = 4;
        getClassList(period, weekday);
    });
    $('#btn-mon5').on('click', function () {
        period = 3;
        weekday = 5;
        getClassList(period, weekday);
    });
    $('#btn-mon5').on('click', function () {
        period = 4;
        weekday = 0;
        getClassList(period, weekday);
    });
    $('#btn-tue5').on('click', function () {
        period = 4;
        weekday = 1;
        getClassList(period, weekday);
    });
    $('#btn-wed5').on('click', function () {
        period = 4;
        weekday = 2;
        getClassList(period, weekday);
    });
    $('#btn-thu5').on('click', function () {
        period = 4;
        weekday = 3;
        getClassList(period, weekday);
    });
    $('#btn-fri5').on('click', function () {
        period = 4;
        weekday = 4;
        getClassList(period, weekday);
    });
    $('#btn-sat5').on('click', function () {
        period = 4;
        weekday = 5;
        getClassList(period, weekday);
    });

    //モーダル表示時に閉じるボタン、またはモーダル外をクリックした場合はモーダルクローズ
    $('.js-modal-close').on('click', function () {
        $('.js-modal').fadeOut();
        return false;
    });

    //確定ボタン押下時
    $('#main-content__btn-confirm').on('click', function () {
        //キャップ単位数を超過している場合は処理を終了
        if (initGrades > 24) {
            alert('キャップ単位数を超過しているので確定できませんでした。');
            return false;
        }

        //取得した講義コードの格納配列を初期化
        var codeArray = new Array();

        //時間割のコマ数ループ
        for (var i = 1, len_A = 5; i <= len_A; ++i) {
            for (var j = 1, len_B = 6; j <= len_B; ++j) {
                //曜日変換関数
                var convWek = toWeekdayName(j - 1, 'English');

                //チェック対象のコマに設定された講義コードを取得
                var classCode = getClassCodeAtCell(convWek, i);

                ////講義コードが設定されている場合は講義コードを取得
                if (classCode) {
                    codeArray.push(classCode);
                }
            }
        }
        // 重複を除去した配列を取得
        var codeArrayUnique = codeArray.filter(function (x, i, self) {
            return self.indexOf(x) === i;
        });
        //講義コードの取得確認用のテストメッセージ
        var testMsg = '取得講義コード：\n';
        const outputCode = codeArrayUnique.reduce(function (a, b) { return a + '\n' + b });
        alert(testMsg + outputCode);

        return codeArrayUnique;
    });
});

//モーダルのクリアを押下時
$(document).on('click', '.frame-delete', function () {
    clearFrame(period, weekday);
});

//モーダルの講義リストを押下時
$(document).on('click', '.class-list li', function () {
    //押下したリストから講義名、時間、担当者名、講義コード、単位数を取得
    var click1 = $(this).find('#list-1').text().substring(6);
    var click2 = $(this).find('#list-2').text().substring(6);
    var click3 = $(this).find('#list-3').text().substring(6);
    var click4 = $(this).find('#list-4').text().substring(6);
    var click5 = $(this).find('#list-5').text().substring(6);
    var click6 = $(this).find('#list-6').text().substring(6);

    //重複コマクリア関数を呼び出し
    clearFrame(period, weekday);

    //時間割設置関数を呼び出し
    setTimetable(click1, click2, click3, click4, click5, click6);

    //モーダルクローズ
    $('.js-modal').fadeOut();

    //時間割の単位数を再取得
    initGrades = getTotalGrade();
    $('#main-content__txt-grades').text(initGrades + '単位');
    return false;
});

//Json取得関数
function setPreference() {
    $.ajaxSetup({ async: false });//同期通信(json取ってくるまで待つ)
    $.getJSON("../testdata.json", function (data) {
        testData = data;
    });
    $.ajaxSetup({ async: true });
}

//初期設定コマ取得関数
function getInitFrame() {
    for (var item in testData) {
        const activeItem = testData[item];
        if (!activeItem.input) {
            continue;
        }
        //押下したリストから講義名、時間、担当者名、講義コード、単位数を取得
        var init1 = activeItem.name;
        var init2 = '';
        for (var j = 0, len = activeItem.koma.length; j < len; ++j) {
            init2 += activeItem.koma[j] + ',';
        }
        init2 = init2.slice(0, -1);
        var init3 = activeItem.charge;
        var init4 = activeItem.type;
        var init5 = activeItem.code;
        var init6 = activeItem.grade;

        //時間割設置関数を呼び出し
        setTimetable(init1, init2, init3, init4, init5, init6);
    }
    return false;
}

//合計単位数取得関数
function getTotalGrade() {

    //取得した講義コードの格納配列を初期化
    var codeArray = new Array();

    const timeTable = document.getElementsByClassName('timetable__table')[0];
    //時間割のコマ数ループ
    for (let i = 0; i < timeTable.rows.length; i++) {
        const activeRow = timeTable.rows[i];
        for (let j = 0; j < activeRow.cells.length; j++) {
            //曜日変換関数
            var convWek = toWeekdayName(j - 1, 'English');

            //チェック対象のコマに設定された講義コードを取得
            var classCode = getClassCodeAtCell(convWek, i);

            //チェック対象のコマに設定された単位数を数値として取得
            var grade = $('#' + convWek + i + '-grade').val();

            //講義コードが設定されている場合は講義コードと単位数を取得
            if (classCode) {
                codeArray.push(classCode + '&' + grade);
            }
        }
    }
    // 重複を除去した配列を取得
    var gradeArrayUnique = codeArray.filter(function (x, i, self) {
        return self.indexOf(x) === i;
    });

    const totalGrade = gradeArrayUnique.map(function (a) { return a.split('&')[1]; }).reduce(function (a, b) { return Number(a) + Number(b); });
    //キャップ単位を超えている場合は赤文字で表示
    if (totalGrade > capGrades) {
        $('#main-content__txt-grades').css('color', 'red');
    } else {
        $('#main-content__txt-grades').css('color', 'black');
    }
    return totalGrade;
}

//講義データのリスト取得関数
function getClassList(peri, wek) {

    //曜日変換関数
    var convWek = toWeekdayName(wek, 'Japanese');

    //時限の値が0（1限）からなので、1増加
    var numPeri = peri + 1;

    //曜日+時限で判定用のコマ文字列を設定
    var checkFrame = convWek + numPeri;

    var classArray = new Array();

    //講義データを取得
    for (var item in testData) {
        const activeItem = testData[item];
        //講義が持つコマの個数ループ
        for (var i = 0, len = activeItem.koma.length; i < len; ++i) {
            //コマが一致した場合は取得した講義データを配列に格納
            if (activeItem.koma[i] != checkFrame) {
                continue;
            }
            var className = '講義名　　:' + activeItem.name;
            var targetKoma = '';
            //分解された開講時間を再びカンマ区切りで結合
            for (var j = 0, len = activeItem.koma.length; j < len; ++j) {
                targetKoma += activeItem.koma[j] + ',';
            }
            targetKoma = '開講時限　:' + targetKoma.slice(0, -1);
            var chargeName = '担当　　　:' + activeItem.charge;
            var classType = '単位種別　:' + activeItem.type;
            var classCode = '講義コード:' + activeItem.code;
            var gradeNum = '単位数　　:' + activeItem.grade;

            classArray.push([className, targetKoma, chargeName, classType, classCode, gradeNum]);
        }
    }

    //リストの要素を初期化
    $('ul.class-list').empty();

    //講義データが1件以上ある場合はリストにコマクリアを作成
    if (classArray.length >= 1) {
        //コマクリアボタンをリストに出力
        $('ul.class-list').append('<li class="frame-delete">');
        $('.frame-delete').append('<a href="#"class="str-delete">');
        $('.str-delete').append('<span class="str-delete__list-1" id="list-1"></span><br>');
        $('.str-delete').append('<span class="str-delete__list-2" id="list-2"></span><br>');
        $('.str-delete').append('<span class="str-delete__list-3" id="list-3">クリア</span><br>');
    }

    //講義データをリストとして出力
    for (var i = 0, len = classArray.length; i < len; ++i) {
        $('ul.class-list').append('<li class="data-' + (i + 1) + '">');
    }
    for (var i = 0, len = classArray.length; i < len; ++i) {
        $('li.data-' + (i + 1)).append('<a href="#"class="str-' + (i + 1) + '">');
    }
    for (var i = 0, len = classArray.length; i < len; ++i) {
        for (var j = 0; j <= 5; ++j) {
            $('a.str-' + (i + 1)).append('<span class="str-' + (i + 1) + '__list-' + (j + 1) + '" id="list-' + (j + 1) + '">' + classArray[i][j] + '</span><br>');
        }
    }

    //モーダルオープン
    $('.js-modal').fadeIn();
    return false;
}

//時間割設置関数
function setTimetable(cl1, cl2, cl3, cl4, cl5, cl6) {

    //複数コマものを分割
    var targetFrame = cl2.split(',');

    //コマ数ループ
    for (i = 0, len = targetFrame.length; i < len; ++i) {

        //曜日と時限を取得
        var wek = targetFrame[i].substr(0, 1);
        var peri = targetFrame[i].substr(1, 1);

        //曜日の値を文字列に変換
        var convWek;
        switch (wek) {
            case '月':
                convWek = 'mon';
                break;
            case '火':
                convWek = 'tue';
                break;
            case '水':
                convWek = 'wed';
                break;
            case '木':
                convWek = 'thu';
                break;
            case '金':
                convWek = 'fri';
                break;
            case '土':
                convWek = 'sat';
                break;
        }

        //曜日+時限でコマを指定
        var embedName = '#class-element-' + convWek + peri + '__name';
        var embedCharge = '#class-element-' + convWek + peri + '__charge';
        var embedType = '#class-element-' + convWek + peri + '__type';
        var embedCode = '#class-element-' + convWek + peri + '__code';
        var embedGrade = '#class-element-' + convWek + peri + '__grade';
        var hiddenCode = '#' + convWek + peri + '-classcode';
        var hiddenGrade = '#' + convWek + peri + '-grade';

        //入力内容の設定
        var inputName = '講義名　　：' + cl1;
        var inputCharge = '担当　　　：' + cl3;
        var inputType = '単位種別　：' + cl4;
        var inputCode = '講義コード：' + cl5;
        var inputGrade = '単位数　　：' + cl6;
        var inputCodeVal = cl5;
        var inputGradeVal = cl6;

        //時間割に講義名、担当者名、種類、講義コード、単位数を入力
        $(embedName).text(inputName);
        $(embedCharge).text(inputCharge);
        $(embedType).text(inputType);
        $(embedCode).text(inputCode);
        $(embedGrade).text(inputGrade);
        $(hiddenCode).val(inputCodeVal);
        $(hiddenGrade).val(inputGradeVal);

    }
    return false;
}

//重複コマクリア関数
function clearFrame(peri, wek) {

    //曜日変換関数
    var convWek = toWeekdayName(wek, 'English');

    //時限が0スタートなので1増加
    var numPeri = peri + 1;

    //チェック対象のコマに設定された講義コードを取得
    var initCode = getClassCodeAtCell(convWek, numPeri);

    //空白の場合処理を終了
    if (initCode == '') {
        return false;
    }

    //時間割のコマ数ループ
    const timeTable = document.getElementsByClassName('timetable__table')[0];
    //時間割のコマ数ループ
    for (let i = 0; i < timeTable.rows.length; i++) {
        const activeRow = timeTable.rows[i];
        for (let j = 0; j < activeRow.cells.length; j++) {
            //曜日変換関数
            convWek = toWeekdayName(j - 1, 'English');

            //判定対象のコマの講義コードを取得
            var checkCode = getClassCodeAtCell(convWek, i);

            //講義コードと一致しているコマをクリア
            if (checkCode == initCode) {
                //時間割表の要素を取得
                var embedName = '#class-element-' + convWek + i + '__name';
                var embedCharge = '#class-element-' + convWek + i + '__charge';
                var embedType = '#class-element-' + convWek + i + '__type';
                var embedCode = '#class-element-' + convWek + i + '__code';
                var embedGrade = '#class-element-' + convWek + i + '__grade';
                var hiddenCode = '#' + convWek + i + '-classcode';
                var hiddenGrade = '#' + convWek + i + '-grade';

                //時間割に講義名、担当者名、講義コード、単位数をクリア
                $(embedName).empty();
                $(embedCharge).empty();
                $(embedType).empty();
                $(embedCode).empty();
                $(embedGrade).empty();
                $(hiddenCode).val('');
                $(hiddenGrade).val(0);
            }
        }
    }
    return false;
}

//曜日変換関数
function toWeekdayName(weekdayCode, language) {

    return getWeekdayArray(language)[weekdayCode];

}

function getWeekdayArray(language) {

    if (language.toLowerCase() === 'japanese') {
        return ['月', '火', '水', '木', '金', '土'];
    }
    return ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

}

//講義コード取得関数
function getClassCodeAtCell(wekday, period) {

    return $('#' + wekday + period + '-classcode').val();

}