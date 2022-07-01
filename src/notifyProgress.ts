declare const SlackApp: {
  create(token: unknown): {
    postMessage(channelId: string, message: string, options: unknown): void;
  };
};

const ICON_MUSCLE = ':muscle';
const ICON_HUKKIN = ':hukkin6ldk';

const SLACK_TOKEN = PropertiesService.getScriptProperties().getProperty('SLACK_TOKEN');
const CHANNEL_ID = '#90_atcoder_progress';
const slackApp = SlackApp.create(SLACK_TOKEN);

// see below link for detailed info
// https://github.com/kenkoooo/AtCoderProblems/blob/master/doc/api.md
const HOST_URL = 'https://kenkoooo.com/atcoder/atcoder-api';
const ENDPOINT_AC = '/v3/user/ac_rank';
const ENDPOINT_RATED_POINT_SUM = '/v3/user/rated_point_sum_rank';

// Using GSS instead of DB
// https://docs.google.com/spreadsheets/d/1iZuu8x86Ux4PUt_pZlutGNZVzed6iilR43W1xtWo4Eo/edit#gid=0
const GSS_ID = '1iZuu8x86Ux4PUt_pZlutGNZVzed6iilR43W1xtWo4Eo';
const SHEET_NAME = 'data';
const ROW_AC = '3';
const ROW_SCORE = '4';

type User = {
  name: string;
  gssCol: string;
};

const USER_DATA: User[] = [
  { name: 'ken0828', gssCol: 'C' },
  { name: 'megahighball_t', gssCol: 'D' },
  { name: 'thanai', gssCol: 'E' },
];

// こいつを10:00 - 11:00で定時実行する
// TODO 10:00ピッタリにやる場合は、午前1時とかに時間指定のトリガー作るトリガーをセットすればできそう。
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dailyNotification = () => {
  slackApp.postMessage(CHANNEL_ID, '昨日の10:00からの精進量になります。', { icon_emoji: ICON_MUSCLE });
  USER_DATA.forEach((user) => postDataToSlack(user.name));
};

const postDataToSlack = (userName: string) => {
  const acResponse = UrlFetchApp.fetch(getAcUrl(userName));
  const acCount = JSON.parse(acResponse.getContentText()).count;

  const scoreResponse = UrlFetchApp.fetch(getScoreUrl(userName));
  const score = JSON.parse(scoreResponse.getContentText()).count;

  const cellAc = getAcCell(userName);
  const cellScore = getScoreCell(userName);

  const spreadSheet = SpreadsheetApp.openById(GSS_ID).getSheetByName(SHEET_NAME);
  if (spreadSheet == null) {
    console.log('failed to get Google Spread Sheet object.');
    return;
  }

  // get previous data from GSS
  const prevAcCount = parseInt(spreadSheet.getRange(cellAc).getValue(), 10);
  const prevScore = parseInt(spreadSheet.getRange(cellScore).getValue(), 10);

  const acDiff = acCount - prevAcCount;
  const scoreDiff = score - prevScore;

  let message = `【 *${userName}* 】\n`;
  if (acDiff > 0) {
    message += `AC数      ：${acDiff}\n総得点   ：${scoreDiff}`;
  } else {
    message += getAbuseComment();
  }
  slackApp.postMessage(CHANNEL_ID, message, { icon_emoji: ICON_HUKKIN });
  console.log(message);

  // set current data to GSS
  spreadSheet.getRange(cellAc).setValue(acCount);
  spreadSheet.getRange(cellScore).setValue(score);
};

const getAcCell = (userName: string) => getCol(userName) + ROW_AC;

const getScoreCell = (userName: string) => getCol(userName) + ROW_SCORE;

const getCol = (userName: string) => {
  const userData = USER_DATA.filter((user) => user.name === userName)[0];
  if (userData != null) return userData.gssCol;
  throw Error(`${userName}という名前のユーザーはいませんよ？`);
};

const getAcUrl = (userName: string) => `${HOST_URL}${ENDPOINT_AC}?user=${userName}`;

const getScoreUrl = (userName: string) => `${HOST_URL}${ENDPOINT_RATED_POINT_SUM}?user=${userName}`;

const getAbuseComment = () => {
  const comments = [
    '精進しないカスです',
    '生きてる価値がありません',
    '衰退あるのみです',
    'やる気あるの？',
    'あなたは一生平凡な人生です',
    '来世頑張ろう'
  ];
  const message = `精進記録なし。\n${comments[Math.floor(Math.random() * comments.length)]}`;
  return message;
};
