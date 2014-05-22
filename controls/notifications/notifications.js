define(
	[
	'lib/util'
,	'lib/styles'
, 	'bootstrap-growl'
	]
,	function()
	{
		can.Control(
			'Frame.Notification'
		,	{
				defaults: {}
			}
		,	{
				newNotification: function() {
					var options = {
						ele: "body",
						type: "info",
						allow_dismiss: false,
						position: {
							from: "top",
							align: "right"
						},
						offset: 20,
						spacing: 10,
						z_index: 1031,
						fade_in: 400,
						delay: 5000,
						pause_on_mouseover: false,
						onGrowlShow: null,
						onGrowlShown: null,
						onGrowlClose: null,
						onGrowlClosed: null
					}

					$.growl('message', options)
				}

			,	'.open-notification-1 click': function(el,ev){
					this.newNotification()
				}
			}
		)
	}
)