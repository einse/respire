/**
 * Calendar is a part of Respire:
 * https://github.com/einse/respire
 */

var Calendar = {
	/**
	 * today(format);
	 * 
	 * Returns the present day in various formats.
	 * 
	 * The date used in all examples for this function
	 * is October 1, 2016.
	 */
	today: function (format) {
		var d = new Date();
		var day = d.getDate();
		var month = d.getMonth();
		var year = d.getFullYear();
		var ru = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
			'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
		
		/**
		 * I. Verbal output of month
		 */
		
		// Output example: 1 октября 2016
		if (format === 'ru') {
			month = ru[month];
			return day + ' ' + month + ' ' + year;
		}
		
		/**
		 * II. Numeric output of month
		 */

		// Actual number of the month
		month = month + 1;
		// Leading zero for one-digit month
		if (month < 10) {
			month = '0' + month;
		}
		
		// Leading zero for one-digit day
		if (day < 10) {
			day = '0' + day;
		}
		
		// Output example: 2016年10月01日
		if (format === 'ja') {
			return year + '年' + month + '月' + day + '日';
		}
		
		// Output example: 01.10.2016
		if (format === '' || format === '.') {
			return day + '.' + month + '.' + year;
		}
		
		// Output example: 2016.10.01
		if (format === 'r' || format === 'r.') {
			return year + '.' + month + '.' + day;
		}
		
		// Output example: 2016-10-01
		// This format is ISO standard. Learn more:
		// http://www.w3schools.com/js/js_date_formats.asp
		if (format === 'r-' || format === 'iso') {
			return year + '-' + month + '-' + day;
		}
		
		// Output example: 2016/10/01
		if (format === 'r/') {
			return year + '/' + month + '/' + day;
		}
		
		// Output example: 10/01/2016
		if (format === 'a/') {
			return month + '/' + day + '/' + year;
		}
		
		// Default: ISO.
		// Output example: 2016-10-01
		// This format is ISO standard. Learn more:
		// http://www.w3schools.com/js/js_date_formats.asp
		return year + '-' + month + '-' + day;
	},
	isLeapYear: function (yearString) {
		var year = Number(yearString);
		var _isLeapYear = false;
		if (year % 400 === 0)
		{
			_isLeapYear = true;
		} else {
			if (year % 4 === 0) {
				_isLeapYear = true;
			}
			if (year % 100 === 0) {
				_isLeapYear = false;
			}
		}
		return _isLeapYear;
	},
	/**
	 * isValid(dateString);
	 * 
	 * Returns an object which contains 3 numbers:
	 * {
	 *   year,
	 *   month,
	 *   day
	 * },
	 * or 'false', whether dateString represents 
	 * a correct date (using Proleptic Gregorian Calendar).
	 * 
	 * The parameter dateString should contain
	 * an ISO-formatted date. For example: "2016-01-03"
	 * (leading zeros are optional) for October 3, 2016.
	 * 
	 * Dates under 1000-01-01 are not supported: therefore
	 * Calendar.isValid('999-12-31') {or earlier} will return false;
	 */
	isValid: function (dateString) {
		var dayCount = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		var monthNumberJS;
		var isLeapYear = false;
		var parsed;
		
		if (typeof dateString !== 'string') {
			console.error('dateString is not a string!');
			return false;
		}
		
		/** 
		 * Parsing the dateString
		 * (Only positive numbers will pass.)
		 */
		parsed = dateString.split('-');
		if (parsed.length !== 3) {
			//~ console.log('array length');
			return false;
		}
		for (var value in parsed) {
			parsed[value] = Number(parsed[value]);
			if (parsed[value] === 0) {
				//~ console.log('zero');
				return false;
			}
			if (isNaN(parsed[value])) {
				//~ console.log('type', typeof parsed[value], parsed[value]);
				return false;
			}
		}
		
		/**
		 * Year number test
		 */
		if (parsed[0] < 1000) {
			console.error("Calendar.js: Dates under 1000 CE are not supported.");
			return false;
		}
		
		/** 
		 * Leap year test
		 */
		isLeapYear = false;
		if (parsed[0] % 400 === 0)
		{
			isLeapYear = true;
		} else {
			if (parsed[0] % 4 === 0) {
				isLeapYear = true;
			}
			if (parsed[0] % 100 === 0) {
				isLeapYear = false;
			}
		}
		
		/** 
		 * Month number test
		 */
		if (parsed[1] > 12) {
			//~ console.log('month > 12');
			return false;
		}
		
		/**
		 * Day number test
		 */
		monthNumberJS = parsed[1] - 1;
		if (parsed[2] > dayCount[monthNumberJS]) {
			if (monthNumberJS === 1 && parsed[2] === 29 && isLeapYear) {
				return {
					year: parsed[0],
					month: parsed[1],
					day: parsed[2]
				};
			}
			//~ console.log('day test failed');
			return false;
		}
		
		return {
			year: parsed[0],
			month: parsed[1],
			day: parsed[2]
		};
	},
	/**
	 * prev(dateString);
	 * 
	 * Yesterday of 'dateString', both ISO-formatted.
	 */
	prev: function (dateString) {
		var dateObject = this.isValid(dateString);
		//~ console.log(dateObject);
		var day;
		var month;
		var year;
		var prevDate;
		var monthNumberJS;
		var dayCountBis = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		var dayString;
		var monthString;
		if (dateObject) {
			day = dateObject.day - 1;
			month = dateObject.month;
			year = dateObject.year;
			
			if (month < 10) {
				monthString = '0' + month;
			} else {
				monthString = '' + month;
			}
			if (day < 10) {
				dayString = '0' + day;
			} else {
				dayString = '' + day;
			}
			prevDate = year + '-' + monthString + '-' + dayString;
			
			if (this.isValid(prevDate)) {
				return prevDate;
			} else {
				if (day === 0) {
					month = month - 1;
					if (month === 0) {
						year = year - 1;
						month = 12;
						day = 31;
					}
					monthNumberJS = month - 1;
					day = dayCountBis[monthNumberJS];
				}
				
				/**
				 * Check for 2100.02.29, 1900.02.29, 1800.02.29...
				 */
				if (month === 2 && day === 29) { 
					if (this.isLeapYear(year)) {
						day = 29;
					} else {
						day = 28;
					}
				}
				
				if (month < 10) {
					monthString = '0' + month;
				} else {
					monthString = '' + month;
				}
				if (day < 10) {
					dayString = '0' + day;
				} else {
					dayString = '' + day;
				}
				return year + '-' + monthString + '-' + dayString;
			}
		}
		console.error("Couldn't get the previous date");
		return '';
	},
	/**
	 * next(dateString);
	 * 
	 * Tomorrow of 'dateString', both ISO-formatted.
	 */
	next: function (dateString) {
		var dateObject = this.isValid(dateString);
		//~ console.log(dateObject);
		var day;
		var month;
		var year;
		var nextDate;
		var monthNumberJS;
		var dayCountBis = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		var dayString;
		var monthString;
		if (dateObject) {
			day = dateObject.day + 1;
			month = dateObject.month;
			year = dateObject.year;
			
			if (month < 10) {
				monthString = '0' + month;
			} else {
				monthString = '' + month;
			}
			if (day < 10) {
				dayString = '0' + day;
			} else {
				dayString = '' + day;
			}
			nextDate = year + '-' + monthString + '-' + dayString;
			
			if (this.isValid(nextDate)) {
				return nextDate;
			} else {
				monthNumberJS = month - 1;
				if (day > dayCountBis[monthNumberJS]) {
					day = 1;
					month = month + 1;
					if (month > 12) {
						year = year + 1;
						month = 1;
					}
				}
				
				/**
				 * Check for a leap year.
				 */
				if (month === 2 && day === 29) { 
					if (this.isLeapYear(year)) {
						day = 29;
					} else {
						day = 1;
						month = 3;
					}
				}
				
				if (month < 10) {
					monthString = '0' + month;
				} else {
					monthString = '' + month;
				}
				if (day < 10) {
					dayString = '0' + day;
				} else {
					dayString = '' + day;
				}
				return year + '-' + monthString + '-' + dayString;
			}
		}
		console.error("Couldn't get the next date");
		return '';
	}
};

var C$ = Calendar;
