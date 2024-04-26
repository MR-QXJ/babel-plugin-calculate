import { Decimal } from 'decimal.js';

/**
 * 四舍五入
 * @param num 原数字
 * @param place 小数点保留位数
 */
export function toFixed(num, place) {
	return Number(new Decimal(Number(num)).toFixed(place));
}

/** 乘法确保精度 */
export function decMul(...args) {
	return decCalc('mul', ...args);
}

/** 除法确保精度 */
export function decDiv(...args) {
	return decCalc('div', ...args);
}

/** 减法确保精度 */
export function decSub(...args) {
	return decCalc('sub', ...args);
}

/** 加法确保精度 */
export function decAdd(...args) {
	return decCalc('add', ...args);
}

/** 截取小数位，再进行舍入 */
export function fixedBit(num, split = 2, place = 0) {
	const str = String(num || 0);
	const arr = str.split('.');
	const placeNum = arr[1];
	let res = num;
	if (arr.length === 2) {
		// 设为null不截取
		if (split !== null) {
			arr[1] = placeNum.substring(0, split);
		}

		res = arr.join('.');
	}

	return toFixed(parseFloat(res) || 0, place);
}

/** decimal计算 */
function decCalc(method, ...args) {
	if (args.length === 1) {
		return args[0];
	}

	const dec = args.reduce((pre, next, index) => {
		const preVal = index === 1 ? new Decimal(Number(pre)) : pre;
		return preVal[method](new Decimal(Number(next)));
	});

	return dec.toNumber();
}
