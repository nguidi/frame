import	'can/control'
import	'can/construct/super'
import	'can/control/plugin'
import	'app/styles/typeahead.css!'

can.Control(
	'Typeahead'
,	{
	//	Nombre del plugin
		pluginName:	'typeahead'
	//	Opciones por defecto
	,	defaults:
		{
			source:		[]
		,	sourceKey:	undefined
		,	minLength:	3
		,	timeout:	400
		,	template:	'<ul class="dropdown-menu">{{#items}}<li>{{.}}</li>{{/items}}</ul>'
		,	updater:	undefined
		,	matcher:	undefined
		,	sorter:		undefined
		,	highlighter:undefined	
		}
	}
,	{
	//	Funciones de la instancia (Publicas)
		init: function(element, options)
		{
			(options.source)
			
			this.$menu
			=	can.$('<div>')
					.addClass('typeahead-menu')	
					.appendTo(
						this.element.parent()
					)
		}
	,	_build_menu: function(items)
		{
			var	self
			=	this
			,	fragment
			=	new can.mustache(
					this.options.template
				)
			this.$menu.html(
				fragment(
					{
						items:	can.map(
										items
									,	function(item)
										{
											return	item instanceof can.Map
													?	item.attr(self.options.sourceKey)
													:	item
										}
								)
					}
				)
			)

			this.show()
		}
	,	_filter: function(query)
		{
			console.log(query)
		}
	,	search: function(query)
		{
			if	(can.isArray(this.options.source))
				this.filter(query)
			else
				this.options.source(query)
					.then(
						can.proxy(this._build_menu,this)	
					)
		}
	,	show: function()
		{
			this.$menu.find('ul').css('display','block')
		}
	,	hide: function()
		{
			this.$menu.find('ul').css('display','none')
		}
	,	'keyup': function(el, ev)
		{
			var	self = this
			this.searchTimer && clearTimeout(this.searchTimer)
			if	(can.$(el).val().length >= this.options.minLength)
				this.searchTimer
				=	setTimeout(
						function()
						{
							self.search(can.$(el).val())
						}
					,	this.options.timeout
					)
		}
	,	'focus': function(el, ev)
		{
			if	(can.$(el).val().length >= this.options.minLength)
				this.show()
		}
	,	'blur': function(el, ev)
		{
			this.hide()
		}
	}
)