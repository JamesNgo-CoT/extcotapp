window.cc = window.cc || {};

cc.Extended_CotApp = function () {
	cot_app.apply(this, arguments);
	this.utilityItem = null;
}

cc.Extended_CotApp.prototype = Object.create(cot_app.prototype);

cc.Extended_CotApp.prototype.setUtility = function (item) {
	this.utilityItem = item;
	this._renderUtility();
	return this;
}

cc.Extended_CotApp.prototype._renderUtility = function() {
	var container = $("#app-utility");
	if (container.length)
		container.children('div').empty().append(this.utilityItem);
};

cc.Extended_CotApp.prototype.render = function(onAfterRender, contentUrl) {
	onAfterRender = onAfterRender || function() {};
	
	var dis = this;
	cot_app.prototype.render.call(this, function() {
		$('#app-breadcrumb > div.row > div.col-xs-12.hidden-xs.hidden-print')
			.removeClass('col-xs-12')
			.addClass('col-xs-auto')
			.after([
				'<div class="hidden-print col-xs-auto">',
					'<div id="app-utility">',
						'<div></div>',
					'</div>',
				'</div>'
			].join(''));
		
		if (contentUrl)
			dis.setContent(contentUrl);
		
		dis._renderUtility();
		
		onAfterRender();
	});
};

cc.Extended_CotApp.prototype.setContent = function(content) {
	if (typeof content === 'object') {
		cot_app.prototype.setContent.apply(this, content);
		return;
	}
	
	var dis = this;
	$('<div>').load(contentUrl, function() {
		var $dis = $(this);
		
		$('head').append($dis.find('style'));
		
		var $breadcrumb = $dis.find('#breadcrumb > li');
		if ($breadcrumb) {
			dis.setBreadcrumb($.map($breadcrumb, function(item, index) {
				return { name: $(item).text(), link: $(item).find('a:first').attr('href')};
			}), true);
		}
		
		var $utility = $dis.find('#utility');
		if ($utility)
			dis.setUtility($utility.html());
		
		var $title = $dis.find('h1:first');
		if ($title)
			dis.setTitle($title.text());
		
		var content = {};
		var $top = $dis.find('#content-top');
		if ($top)
			content.top = $top.html());
		
		var $left = $dis.find('#content-left');
		if ($left)
			content.left = $left.html();
		
		var $right = $dis.find('#content-right');
		if ($right)
			content.right = $right.html();
		
		var $bottom = $dis.find('#content-bottom');
		if ($bottom)
			content.bottom = $bottom.html();
		
		dis.setContent(content);
		
		$('body').append($dis.find('script[title]'));
	});
}