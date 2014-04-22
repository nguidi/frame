define(
	[
		'lib/util'
	]
,	function()
	{
		can.Control(
			'TableControl'
		,	{
				defaults:
				{
					view: false
				,	data: []
				}
			}
		,	{
				init: function(element,options)
				{
					can.append(
						element
					,	can.view(
							options.view
						,	options.data
						)
					)
				}
			}
		)
	}
)