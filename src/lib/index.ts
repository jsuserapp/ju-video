import axios from 'axios';
import { Dialog, QVueGlobals } from 'quasar';
import CryptoJS from 'crypto-js';
import baseX from 'base-x';

export const api = axios.create({ baseURL: '/api' });

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
export function remove<T>(array: T[], obj: T) {
  const index = array.indexOf(obj);
  if (index === -1) return false;
  array.splice(index, 1);
  return true;
}
export function formatInteger(i: number, n: number) {
  let str = '' + i;
  for (let k = 0; k < n - str.length; k++) {
    str = '0' + str;
  }
  return str;
}
export function notifyOk($q: QVueGlobals, msg: string) {
  if (!$q) {
    return;
  }
  $q.notify({
    color: 'green-4',
    textColor: 'white',
    icon: 'check_circle',
    message: msg,
    position: 'top',
  });
}
export function notifyError($q: QVueGlobals, msg: string) {
  if (!$q) {
    return;
  }
  $q.notify({
    color: 'red-5',
    textColor: 'white',
    icon: 'cancel',
    message: msg,
    position: 'top',
  });
}
export function showConfirm(title: string, msg: string, onYes: () => void) {
  Dialog.create({
    title: title ? title : '确认',
    message: msg,
    html: true,
    persistent: true,
    ok: {
      label: '确定',
      color: 'green',
    },
    cancel: {
      label: '取消',
      color: 'grey',
    },
  }).onOk(() => {
    onYes();
  });
}
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const base58 = baseX(BASE58_ALPHABET);
/**
 * 计算字符串的 SHA-256 哈希值，并返回 Base58 编码
 * @param message 输入字符串
 * @returns Base58 编码的哈希值
 */
export function sha1(message: string): string {
  const hash = CryptoJS.SHA1(message);
  const hashBytes = Uint8Array.from(CryptoJS.enc.Hex.parse(hash.toString()).words.flatMap(word => [
    (word >> 24) & 0xff,
    (word >> 16) & 0xff,
    (word >> 8) & 0xff,
    word & 0xff,
  ]));
  return base58.encode(hashBytes);
}
