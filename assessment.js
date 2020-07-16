'use strict';
//UIパーツとの紐付け
const userNameInput = document.getElementById('user-name');
const assessmentButton = document.getElementById('assessment');
const resultDivided = document.getElementById('result-area');
const tweetDivided = document.getElementById('tweet-area');

/**
* 指定した要素の子どもを全て削除する
* @param {HTMLElement} element HTMLの要素
*/
function removeallChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
};

assessmentButton.onclick = () => {
    const userName = userNameInput.value;
    if (userName.length === 0) { // 名前が空の時は処理を終了する
        return;
    }

    //診断結果表示エリアの作成
    removeallChildren(resultDivided);
    const header = document.createElement('h3');
    header.innerText = '診断結果';
    resultDivided.appendChild(header);

    const paragraph = document.createElement('p');
    const result = assessment(userName);
    paragraph.innerText = result;
    resultDivided.appendChild(paragraph);

    // TODO ツイートエリアの作成
    removeallChildren(tweetDivided);
    const anchor = document.createElement('a');
    const hrefValue = 'https://twitter.com/intent/tweet?button_hashtag=あなたの今日の運勢&ref_src=twsrc%5Etfw';

    anchor.setAttribute('href', hrefValue);
    anchor.className = 'twitter-hashtag-button';
    anchor.setAttribute('data-text', result);
    anchor.innerText = 'Tweet #あなたの今日の運勢';

    tweetDivided.appendChild(anchor);

    const script = document.createElement('script');
    script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
    script.setAttribute('charset', 'utf-8');
    tweetDivided.appendChild(script);

};
//テキストフィールドでEnterキー押下でも診断する
userNameInput.onkeydown = (event) => {
    if (event.key === 'Enter') {
        assessmentButton.onclick();
    }
};


//診断結果のパターン
const answers = [
    '{userName}の今日の運勢は「大吉」です。いつもと違う場所で運命的な出会いがあります。',
    '{userName}の今日の運勢は「吉」です。仕事や勉強がうまくいくでしょう。',
    '{userName}の今日の運勢は「中吉」です。食事を味わって食べると運気UP。',
    '{userName}の今日の運勢は「小吉」です。お金を無駄遣いしてしまわないよう注意しましょう。',
    '{userName}の今日の運勢は「末吉」です。周囲と協力して困難を乗り越えましょう。',
    '{userName}の今日の運勢は「凶」です。深呼吸するのが開運のコツです。',
    '{userName}の今日の運勢は「大凶」です。外出したときは寄り道をせずにまっすぐ帰りましょう。',
];
function assessment(userName) {
    //名前の全文字のコード番号を取得して足し合わせる
    let sumOfCharCode = 0;
    for (let i = 0; i < userName.length; i++) {
        sumOfCharCode = sumOfCharCode + userName.charCodeAt(i);
    }

    //年月日の数字を取得してsumOfCharCodeに足し、sumOfAllとする
    var today = new Date(); //日付オブジェクトを作る
    let sumOfYMD = today.getFullYear() + today.getMonth() + today.getDate(); //年+月+日
    let sumOfAll = sumOfCharCode + sumOfYMD;
 
    // 足した結果を、診断結果のパターンの数で割ったあまりを取得する。
    const index = sumOfAll % answers.length;

    // 余りを診断結果の配列の添字として、該当する結果の文字列を取得する。
    let result = answers[index];

    
    // 正規表現を使った置き換え
    result = result.replace(/\{userName\}/g, userName);
    return result;
   
}

//テスト
console.assert(
    assessment('太郎') === '太郎の今日の運勢は「凶」です。深呼吸するのが開運のコツです。',
    '診断結果の文言の特定の部分を名前に置き換える処理が正しくありません。'
);
console.assert(
    assessment('太郎') === assessment('太郎'),
    '「同じ名前なら、同じ診断結果を出力する」処理が正しくありません。'
);
