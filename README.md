Multi Player Game Library
=====

このライブラリはMilkcocoa( https://mlkcca.com ) を利用しています。
またサンプルにはenchant.js( https://github.com/wise9/enchant.js )を利用しています。

# DEMO

http://milk-cocoa.github.io/multiplay-game-with-milkcocoa/examples/rpg/

# HOT TO START

```
npm install
gulp serve
```

# HOT TO USE

### 初期化について

ますMilkcocoaにつなぎ、プログラムの一通りの初期化が終わったらinitを呼びます。
例えばenchant.jsではgame.onloadの中でinit関数を呼びます。

```
    var milkcocoaGame = new MultiPlayerGame("{your-app-id}.mlkcca.com");

    milkcocoaGame.init();

```

### マスターオブジェクトについて

マスターオブジェクトとレプリカオブジェクトという概念があります。
マスターオブジェクトは、このプログラムが動いているクライアントで作成されたオブジェクトです。
レプリカオブジェクトは別のクライアントで作成されたマスターの複製です。
基本的にパラメータの更新はマスターだけ行い、レプリカはデータの更新通知を受け取るだけです。

```
var masterObject = milkcocoaGame.createObject('master_unique_id', {
    x : 100,
    y : 200
});

masterObject.onUpdate(function(params) {
    //player.x = params.x;
    //player.y = params.y;
});

```


update関数でマスターオブジェクトを更新します。

```
masterObject.update({
    x : 0,
    y : 50
});

```


### レプリカオブジェクトについて

```
milkcocoaGame.onCreatedObject(function(replObj) {
	//replObj.getParams()でparameを取得できます。
    character.x = replObj.getParams().x;
    character.y = replObj.getParams().y;

    replObj.onUpdate(function(params) {
    	//別のクライアントにてこのレプリカが更新されると呼ばれます。
    });
    replObj.onDestroyHandler(function() {
    	//別のクライアントにてこのレプリカが削除されると。
    });
});
```

### その他


getNumOfReplsはレプリカの数を返します。一つのクライアントが一つのマスターオブジェクトを作成した場合。この数字+1がプレイヤー数となります。

```
milkcocoaGame.getNumOfRepls()
```

# License

MIT License


ライブラリはenchantjsを利用しています。
画像等はenchantのexamplesを利用しています。

https://github.com/wise9/enchant.js
