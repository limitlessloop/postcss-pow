import postcss from 'postcss';

export default postcss.plugin('postcss-sqrt', () => {

	return (root) => {
		root.walkRules(rule => {
			let isMatch = false
			const fnArgs = {}

			rule.walkDecls(decl => {
				const SQRT_REGEX = /pow\(([^)]+.+?)\)/

				// Check if decl has a sqrt function inside it
				isMatch = SQRT_REGEX.exec(decl.value) ? true : false;

				// If it does grab the value of the function
				if (isMatch) {
					let matches = SQRT_REGEX.exec(decl.value);
					const args = matches[1].split(',')
					fnArgs.base = args[0].trim()
					fnArgs.power = parseInt(args[1].trim(), 10)
				}

				// Replace the function with css variable that calculates square root
				decl.value = decl.value.replace(SQRT_REGEX, function () {
					if (fnArgs.power > 0) {
						let string = '(' + fnArgs.base
						for (let i = 0; i < (fnArgs.power - 1); i++) {
							string += ' * ' + fnArgs.base;
						}
						return string + ')'
					} else if (fnArgs.power === 0) {

						return 1
					} else {
						fnArgs.power = Math.abs(fnArgs.power)
						let string = '(1 / (' + fnArgs.base
						for (let i = 0; i < (fnArgs.power - 1); i++) {
							string += ' * ' + fnArgs.base;
						}
						return string + '))'
					}
				})

			})

		})
	};
});
