import dayjs from 'dayjs';

export function trim(str: string) {
  return str.trim();
}

export function formatDate(str?: Date) {
  if (!str) {
    return '-';
  }
  return dayjs(str).format('DD/MM/YYYY hh:mm:ss');
}

export const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};