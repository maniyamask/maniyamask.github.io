//ダイエーAPI取得変数
var daieiData;

//Mapに表示するダイエーマーカー
const daieiMarker = 'img/daieiIcon.png'

//Mapに表示するラーメン屋マーカー
const ramenMarker = 'img/ramenIcon.png'

//Mapの施設情報
var infowindow;

//Mapのマーカー格納配列
var markers = [];

//Map情報
var map;

$(document).ready(function () {

    //ダイエーAPIからJSONを取得
    $.ajaxSetup({ async: false });//同期通信(json取ってくるまで待つ)
    //以下のJSONは「http://www.daiei.co.jp/」より店舗名と住所を取得し加工
    $.getJSON('https://jsondata.okiba.me/v1/json/LyzNg200519013700', function (data) {
        daieiData = data;
    });
    $.ajaxSetup({ async: true });

    //初期マップ描画（神戸三宮店）
    getLocation(34.695124, 135.196433,'ダイエー神戸三宮店・イオンフードスタイル');

    //都道府県名プルダウンリスト選択
    $('.location').on('change', function () {

        //店名プルダウンリストクリア
        $('.name').empty();

        // 選択されている都道府県を取得
        const selectedLocation = $('select[name="location"] option:selected').text();

        //「選択してください」のリストを出力
        $('.name').append('<option value="name-0">店舗名を選択してください</option>');

        //店舗情報の数だけループ
        for (let shop in daieiData) {
            
            const activeItem = daieiData[shop];

            const activeShopLocation = activeItem.Location;
            const activeShopName = activeItem.Name;

            //htmlタグ出力用のカウンタ
            let count = 0;

            // 選択した県名に存在するダイエーの店舗を出力
            if (activeShopLocation === selectedLocation) {
                $('.name').append('<option value="name-' + + count + '">' + activeShopName + '</option>');

                count += 1;
            }
        }
        return false;
    });
});

//店舗名プルダウンリスト再選択
$(document).on('change', '.name', function () {

    // 選択されている店舗名を取得
    const selectedName = $('select[name="name"] option:selected').text();

    //選択した店舗から緯度経度を取得
    const selectedShopLat = getLatAndLng(selectedName, 'lat'); //緯度
    const selectedShopLng = getLatAndLng(selectedName, 'lng'); //経度

    //店舗名が選択されている場合
    if (selectedName !== "店舗名を選択してください") {
        //マップ描画
        getLocation(selectedShopLat, selectedShopLng, selectedName);
        // ボタンを有効化
        $('#search_btn').prop('disabled', false);
    }

    return false;
});

//緯度経度を取得
function getLatAndLng(shopName, geo) {
    //店舗情報の数だけループ
    for (let shop in daieiData) {

        const activeItem = daieiData[shop];

        const activeShopName = activeItem.Name;
        const activeShopLat = activeItem.lat;
        const activeShopLng = activeItem.lng;

        // 選択した店舗が位置を取得する
        if (activeShopName === shopName) {
            //緯度を取得する場合
            if (geo === 'lat') {
                return Number(activeShopLat);
            }
            //経度を取得する場合
            if (geo === 'lng') {
                return Number(activeShopLng);
            }
        }
    }
}

function getLocation(lat, lng,name) {
    // 緯度経度を取得
    const latitude = lat;
    const longitude = lng;
    const latlng = new google.maps.LatLng(latitude, longitude);
    
    // 緯度経度を中心にマップを生成
    map = new google.maps.Map(document.getElementById('googleMap'), {
        center: latlng,
        zoom: 16
    });
    
    //ダイエーのマーカーを設置
    createDaieiMarker(latlng,name);
    
    //ダイエーから1キロ以内のラーメン屋を検索
    infowindow = new google.maps.InfoWindow();
    const service = new google.maps.places.PlacesService(map);
    service.textSearch({
        location: latlng,
        radius: 100,
        query: 'ラーメン'
    }, callback);

}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (let i = 0; i < results.length; i++) {
            createRamenMarker(results[i]);
        }
    }
}

//地図上にダイエーのマーカーを生成
function createDaieiMarker(place,shopName) {
    const marker = new google.maps.Marker({
        map: map,
        position: place,
        icon: new google.maps.MarkerImage(
            daieiMarker,
            new google.maps.Size(50, 50),    //マーカー画像のサイズ
            new google.maps.Point(0, 0),     //位置（0,0で固定）
            new google.maps.Point(30, 50), //位置（任意の調整値）
        )
    });

    markers.push(marker);

    //地図上のマーカーをクリックした際の動作、吹き出しの中身
    google.maps.event.addListener(marker, 'mouseover', function () {
        infowindow.setContent('<div><strong>' + shopName + '</strong></div>');
        infowindow.open(map, this);
    });
}

//地図上にラーメン屋のマーカーを生成
function createRamenMarker(place) {
    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        icon: new google.maps.MarkerImage(
            ramenMarker,
            new google.maps.Size(50, 50),    //マーカー画像のサイズ
            new google.maps.Point(0, 0),     //位置（0,0で固定）
            new google.maps.Point(30, 50), //位置（任意の調整値）
        )
    });
    
    markers.push(marker);

    //地図上のマーカーをクリックした際の動作、吹き出しの中身
    google.maps.event.addListener(marker, 'mouseover', function () {
        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + '住所: ' + place.formatted_address + '<br>' + '評価: ' + place.rating + '</div>');
        infowindow.open(map, this); 
    });
}

//マーカーを消す
function clearMarkerAll(map) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}
