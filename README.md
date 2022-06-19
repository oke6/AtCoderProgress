# 概要 #

AtCoderの進捗をslackに通知してるGASのソース

### 構成概要 ###
 - 本ソースをGASにpush
 - claspがtypescriptのソースをコンパイルしてデプロイしてくれる
 - デプロイされたソースは毎日10:00 - 11:00に実行されるようにトリガーを設定済み
 - gasのURLは下記
 - https://script.google.com/home/projects/1oWlh5yOOHmTYDAz3ZaG816AYb3UfOVDFZk6Is_oe3VO7U7pO_Y30aHnZ/edit

 ### 開発時の動作確認方法 ###
 - `clasp login` にてログインする
 - 指定のscriptの編集権限のあるアカウントでログインする必要あり
 - 修正後に `clasp push` でソースをデプロイする（このときに勝手にtsからコンパイルして変換される）
 - gasのUI上で関数の実行ができる

### Github Actionsによるデプロイ ###
 - mainブランチにpushされた場合、Github ActionsによりGASスクリプトの自動デプロイを行います。
 - ログイン情報はRepository Secretsに設定している内容をもとに定義しています
※詳細は「action.yml」を確認  
※claspの仕様については割愛 
  
### Repository Secretsに定義する変数 ###
ログイン情報などは直接記載せずにSECRETSから取得する
  
| SECRETS変数   | 説明 | 
| :------------- | :----: | 
| ACCESS_TOKEN  |   clasp loginで作成される.clasprc.jsonに記載   | 
| CLIENT_ID     |  〃 | 
| CLIENT_SECRET |  〃 | 
| ID_TOKEN      |  〃 | 
| REFRESH_TOKEN |  〃 | 
  
  
### GASのScript Propertyに定義する変数 ###
| SECRETS変数   | 説明 | 
| :------------- | :----: | 
| SLACK_TOKEN  |  slackの任意のワークスペースに通知するためのtoken<br>作成したslack appの設定ページで確認可能  | 