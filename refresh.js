const input = [-67, 35, 22, 90, 76, 91, -25, -20, -12, -75, 78, -51];

Array.prototype.swap = function (i, j) {
	const temp = this[i];
	this[i] = this[j];
	this[j] = temp;
};

function bubble(arr) {
	const list = new Array(...arr);
	const length = list.length;
	let passes = length - 1;
	while (passes) {
		let swaps = 0;
		for (let i = 0; i <= passes; i++) {
			if (list[i] > list[i + 1]) {
				list.swap(i, i + 1);
				swaps++;
			}
		}
		if (!swaps) break;
		passes--;
	}
	return list;
}

function selection(arr) {
	const list = new Array(...arr);
	const length = list.length;

	let least = 0;
	let placed = 0;
	while (placed < length) {
		for (let i = placed; i < length; i++) {
			if (list[i] < list[least]) {
				least = i;
			}
		}
		list.swap(placed, least);
		placed++;
	}

	return list;
}

function insertion(arr) {
	const list = new Array(...arr);
	const length = list.length;

	for (let i = 0; i < length; i++) {
		let j = i - 1;
		const elem = list[i];
		while (j >= 0 && list[j] > elem) {
			list[j + 1] = list[j];
			j--;
		}
		list[j + 1] = elem;
	}
	return list;
}

Array.prototype.sort = function () {
	function merge(A1, A2) {
		let i = 0,
			j = 0;
		const list = [];
		while (i < A1.length && j < A2.length) {
			if (A1[i] < A2[j]) {
				list.push(A1[i]);
				i++;
			} else {
				list.push(A2[j]);
				j++;
			}
		}
		return [...list, ...A1.slice(i), ...A2.slice(j)];
	}
	const length = this.length;
	if (length < 2) {
		return [...this];
	}
	const mid = Math.floor(length / 2);
	return merge(this.slice(0, mid).sort(), this.slice(mid).sort());
};

//[-67, 35, 22, 90, 76, 91, -25, -20, -12, -75, 78, -51];
//[-67, 35, 22, 90, 76, 91, -51, -20, -12, -75, 78, -25];
// [-67, 35, 22, 90, 76, 91, -51, -20, -12, -75, 78] [-25]
Array.prototype.quickSort = function () {
	const sort = function (arr = [], floor = 0, ceil = 0) {
		if (arr.length < 2 || floor >= ceil) return arr;
		const pivotIndex = Math.floor(floor + (ceil - floor) / 2);
		const pivot = arr[pivotIndex];
		arr.swap(pivotIndex, ceil);
		let i = floor;
		let j = i;
		while (i < ceil) {
			if (arr[i] < pivot) {
				arr.swap(i, j);
				j++;
			}
			i++;
		}
		arr.swap(j, ceil);
		sort(arr, floor, j - 1);
		sort(arr, j + 1, ceil);
		return arr;
	};
	return sort(this, 0, this.length - 1);
};

console.log(input.quickSort());

Array.prototype.deflate = function (depth = 1) {
	if (this.length < 1 || depth <= 0) return [...this];
	let list = [...this];
	let needFlattening;
	const flatten = (arr) => {
		let wasflattened = false;
		const list = [];
		for (let i = 0; i < arr.length; i++) {
			if (Array.isArray(arr[i])) {
				list.push(...arr[i]);
				if (!wasflattened) wasflattened = true;
			} else {
				list.push(arr[i]);
			}
		}
		return [list, wasflattened];
	};
	let iterations = depth;
	do {
		[list, needFlattening] = flatten(list);
		if (!needFlattening) break;
		iterations--;
	} while (iterations);
	return list;
};

Array.prototype.deflateRecursively = function (depth = 1) {
	if (depth <= 0 || this.length < 1) return [...this];
	else if (depth === Infinity) return this.deflate(depth);
	let list = [];
	for (let i = 0; i < this.length; i++) {
		const element = this[i];
		if (Array.isArray(element)) {
			list.push(...element.deflateRecursively(depth - 1));
		} else {
			list.push(element);
		}
	}
	return [...list];
};

Function.prototype.attach = function () {
	var context = arguments[0];
	var ctx = context ? Object(context) : globalThis;
	var key = this.name || "anon" + Date.now();
	var params = new Array();
	for (var i = 1; i < arguments.length; i++) {
		params.push(arguments[i]);
	}
	var fn = this;
	function bound() {
		var result;
		var finalArguments = new Array();
		for (var i = 0; i < params.length; i++) {
			finalArguments.push(params[i]);
		}
		for (var i = 0; i < arguments.length; i++) {
			finalArguments.push(arguments[i]);
		}
		ctx[key] = fn;
		result = ctx[key](...finalArguments);
		delete ctx[key];
		return result;
	}
	return bound;
};

Function.prototype.call = function () {
	var ctx = arguments[0] ? Object(arguments[0]) : window || self;
	var params = new Array();
	var key = "__context__" + Date.now() + Math.random().toString(36);
	for (let i = 1; i < arguments.length; i++) {
		params.push(arguments[i]);
	}
	ctx[key] = this;
	var result = ctx[key](...params);
	delete ctx[key];
	return result;
};

Function.prototype.apply = function () {
	var ctx = arguments[0] ? Object(arguments[0]) : window || self;
	var params = arguments[1] || [];
	var key = "__context__" + Date.now() + Math.random().toString(36);
	ctx[key] = this;
	var result = ctx[key](...params);
	delete ctx[key];
	return result;
};

function curriedSum(i, j) {
	return function (a, b) {
		return function (c, d) {
			const A = parseFloat(a);
			const B = parseFloat(b);
			const I = parseFloat(i);
			const J = parseFloat(j);
			const C = parseFloat(c);
			const D = parseFloat(d);
			if (
				isNaN(A) ||
				isNaN(B) ||
				isNaN(I) ||
				isNaN(J) ||
				isNaN(C) ||
				isNaN(D)
			) {
				throw new Error();
			}

			return I + J + A + B + C + D;
		};
	};
}
console.log(curriedSum(1, 2)(3, 4)(5, 6));

function deepClone(value, seen = new Map()) {
	if (typeof value !== "object" || value === null) {
		return value;
	}

	if (seen.has(value)) {
		return seen.get(value);
	}

	let cloned;

	if (Array.isArray(value)) {
		cloned = [];
		seen.set(value, cloned);
		for (const item of value) {
			cloned.push(deepClone(item, seen));
		}
	} else if (value instanceof Set) {
		cloned = new Set();
		seen.set(value, cloned);
		for (const item of value) {
			cloned.add(deepClone(item, seen));
		}
	} else if (value instanceof Map) {
		cloned = new Map();
		seen.set(value, cloned);
		for (const [k, v] of value) {
			cloned.set(deepClone(k, seen), deepClone(v, seen));
		}
	} else {
		// Assume plain object
		cloned = {};
		seen.set(value, cloned);
		for (const key in value) {
			if (Object.hasOwn(value, key)) {
				cloned[key] = deepClone(value[key], seen);
			}
		}
	}

	return cloned;
}

function compare(prev, current) {
	if (!prev || !current || prev.length !== current.length) return false;
	return JSON.stringify(prev) === JSON.stringify(current);
}

function memoize(fn) {
	let computed;
	let prevProps = [];

	const memorisedFn = function (...params) {
		// Check if params match prevProps
		if (computed && compare(params, prevProps)) {
			return computed;
		}

		// Compute new result and update computed
		const result = fn(...params);
		computed = result;
		prevProps = params;
		return result;
	};

	// Add clear method
	memorisedFn.clear = function () {
		computed = null;
		prevProps = null;
	};

	return memorisedFn;
}
