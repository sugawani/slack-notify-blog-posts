**Guide Outline**:

- [Slack blog posts notifier](#slack-blog-posts-notifier)
- [各種トリガーの説明](#各種トリガーの説明)
  - [MonthlyTrigger](#monthlytrigger)
- [使い方](#使い方)
  - [slack cli のインストール](#slack-cli-のインストール)
  - [環境変数の設定](#環境変数の設定)
    - [通知先チャンネル](#通知先チャンネル)
    - [zenn の publication](#zenn-の-publication)
    - [wantedly の 企業 ID](#wantedly-の-企業-id)
- [ローカルでの実行](#ローカルでの実行)
- [slack platform 上での実行](#slack-platform-上での実行)
  - [環境変数の設定](#環境変数の設定-1)
    - [通知先チャンネル](#通知先チャンネル-1)
    - [zenn の publication](#zenn-の-publication-1)
    - [wantedly の 企業 ID](#wantedly-の-企業-id-1)
  - [デプロイ](#デプロイ)

# Slack blog posts notifier

Zenn/Wantedly に先月投稿された記事を Slack に通知するボットです  
[Slack Platform](https://api.slack.com/start/overview)の仕組みで動いています

# 各種トリガーの説明

## MonthlyTrigger

毎月月初月曜日に起動します  
変更したい場合は Frequency の値を変更してください  
https://api.slack.com/automation/triggers/scheduled

# 使い方

## slack cli のインストール

https://api.slack.com/automation/quickstart
こちらを参考にインストールしてください

## 環境変数の設定  
### 通知先チャンネル

`.env` ファイルの `NOTIFY_CHANNEL_ID` に通知先チャンネル ID を追記してください  
チャンネル ID はチャンネル詳細下部に `Channel ID: XXXXXXXX` の形で記載されています

### zenn の publication

`.env` ファイルの `PUBLICATION_NAME` に取得する zenn publication ID を追記してください  
publication ID は https://zenn.dev/p/xxxxx の形で記載されています

### wantedly の 企業 ID

`.env` ファイルの `COMPANY_ID` に取得する企業の company ID を追記してください  
company ID は https://www.wantedly.com/companies/xxxxx の形で記載されています


# ローカルでの実行

`slack run` を実行し、動かしたい Trigger を指定してください  
他の Trigger も同時に実行したい場合は `slack trigger create` で動かしたい Trigger を指定してください

# slack platform 上での実行

## 環境変数の設定  
### 通知先チャンネル

`slack env add NOTIFY_CHANNEL_ID XXXXXXX` を実行し、通知先のチャンネル ID を環境変数に設定してください  
チャンネル ID はチャンネル詳細下部に `Channel ID: XXXXXXXX` の形で記載されています

### zenn の publication

`slack env add PUBLICATION_NAME XXXXXXX` を実行し、取得する zenn publication ID を環境変数に設定してください  
publication ID は https://zenn.dev/p/xxxxx の形で記載されています

### wantedly の 企業 ID

`slack env add COMPANY_ID XXXXXXX` を実行し、取得する企業の company ID を環境変数に設定してください  
company ID は https://www.wantedly.com/companies/xxxxx の形で記載されています

## デプロイ

`slack deploy` を実行し、動かしたい Trigger を指定してください