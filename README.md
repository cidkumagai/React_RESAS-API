# 都道府県別の総人口推移グラフを表示するSPA

> このサイトは[GitHub Pages](https://cidkumagai.github.io/React_RESAS-API/) で公開しています。

# 環境
・node v16.0.0
・create-react-app v5.0.1

# 要件
・RESAS(地域経済分析システム) APIの「都道府県一覧」からAPIを取得する
・APIレスポンスから都道府県一覧のチェックボックスを動的に生成する
・都道府県にチェックを入れると、RESAS APIから選択された都道府県の「人口構成」を取得する
・人口構成APIレスポンスから、X軸:年、Y軸:人口数の折れ線グラフを動的に生成して表示する
・都道府県一覧および総人口情報はRESAS APIのデータを用いる
・グラフはHighchartsを用いて描画する
・Google Chrome最新版で正しく動く


