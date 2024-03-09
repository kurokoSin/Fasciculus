/**
 * HTMLエスケープ（replace方式）
 * @param {String} str 処理対象文字列
 * @returns {String} エスケープ済み文字列
 * @private
 */
const escapeHTML = (str) => {
	return str.replace(/&/g,"&amp;")
			.replace(/</g,"&lt;")
			.replace(/>/g,"&gt;")
			.replace(/"/g,"&quot;")
			.replace(/'/g,"&#39;")
			.replace(/\r\n|\n/g,"<br/>");
};

const unescapeHTML = (str) => {
	return str.replace(/&amp;/g,"&")
			.replace(/&lt;/g,"<")
			.replace(/&gt;/g,">")
			.replace(/&quot;/g,'"')
			.replace(/&#39;/g,"'")
			.replace(/<br\/>/g, "\r\n");
};
