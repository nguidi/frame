define(
	[
		'lib/util'
	,	'can/route'
	]
,	function()
	{
		can.Control(
			'Frame.Menu'
		,	{
				defaults:
				{
				/*
				//	OPCIONES DEL MENU
					options:
					[
						{
							name:	//	NOMBRE
						,	label:	//	TITULO
						,	options:
							[
								...
							]	
						}
					,	...
					]
				*/
					options:		[]
				,	route:			false
				,	default_option:	false
				,	event_prefix:	'menu'
				}
			}
		,	{
				init: function(element,options)
				{
					this.menuOptions
					=	new can.Map(options.options)

					can.append(
						element
					,	can.view(
							options.view
						,	this.menuOptions
						)
					)

					if	(options.route)
						can
							.route
								.bind(
									options.route
								, 	can.proxy(this._render_content,this)
								)

					if	(options.default_option)
						this.updateHash(options.default_option)
				}

			,	_render_content: function(routeObject,newRoute,oldRoute)
				{
					this
						.element
							.trigger(
								this.options.event_prefix+'.'+newRoute
							)
				}

			,	updateControlData: function(data)
				{
					if	(!_.isEmpty(data.default_option))
						this.updateHash(data.default_option)
				}

			,	updateHash: function(routeKey)
				{
					can
						.route
							.attr(
								this.options.route
							,	routeKey
							)

					this.activateLI(routeKey)
				}

			,	activateLI: function(key)
				{
					if	(!_.isEmpty(this.$active))
						this.$active.removeClass('active')

					this.$active
					=	this.element.find('li a[menu-key='+key+']').parent()

					this.$active.addClass('active')
				}

			,	'li:not(".active") a click': function(el,ev)
				{
					if	(!_.isEmpty(can.$(el).attr('menu-key')))
						this.updateHash(can.$(el).attr('menu-key'))
				}

			,	'frame.menu.update': function(el,ev,data)
				{
					this
						.menuOptions
							.attr(data.viewData)

					if	(!_.isEmpty(data.controlData))
						this.updateControlData(data.controlData)
				}
			}
		)
	}
)