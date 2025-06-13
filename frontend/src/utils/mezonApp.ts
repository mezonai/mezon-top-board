import { AppStatus } from "@app/enums/AppStatus.enum";

export function mapStatusToColor(status: number) {
  switch (status) {
    case AppStatus.PENDING:
      return 'orange';
    case AppStatus.APPROVED:
      return 'green';
    case AppStatus.REJECTED:
      return 'red';
    case AppStatus.PUBLISHED:
      return 'blue';
    default:
      return 'gray';
  }
}

export function mapStatusToText(status: number) {
  switch (status) {
    case AppStatus.PENDING:
      return 'Pending';
    case AppStatus.APPROVED:
      return 'Approved';
    case AppStatus.REJECTED:
      return 'Rejected';
    case AppStatus.PUBLISHED:
      return 'Published';
    default:
      return 'Unknown';
  }
}

export function randomColor(type: string = 'normal', index?: number) {
  const presetColors = {
    'normal': [
      'magenta',
      'red',
      'volcano',
      'orange',
      'gold',
      'lime',
      'green',
      'cyan',
      'blue',
      'geekblue',
      'purple',
    ],
    'light': [
      '#ffadd2',
      '#ff7875',
      '#ff9c6e',
      '#ffc069',
      '#ffe58f',
      '#d3f261',
      '#73d13d',
      '#87e8de',
      '#91d5ff',
      '#adc6ff',
      '#d3adf7',
    ],
    'dark': [
      '#c41d7f',
      '#cf1322',
      '#d4380d',
      '#d46b08',
      '#d48806',
      '#7cb305',
      '#389e0d',
      '#08979c',
      '#0050b3',
      '#10239e',
      '#391085',
    ],
  }

  const typeSelection = (type in Object.keys(presetColors) ? type : 'normal') as keyof typeof presetColors;
  const colorSelection = presetColors[typeSelection];

  if (index !== undefined) {
    return colorSelection[index % colorSelection.length];
  }

  return colorSelection[Math.floor(Math.random() * colorSelection.length)];
}

export const getMezonInstallLink = (type: 'app' | 'bot' = 'bot', mezonAppId?: string): string => {
  const baseURL =
    type === 'app'
      ? 'https://mezon.ai/developers/app/install/'
      : 'https://mezon.ai/developers/bot/install/'

  return (mezonAppId) ? `${baseURL}${mezonAppId}` : `${baseURL}`;
}
