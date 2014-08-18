define(
	[
		'lib/util'
	,	'growl'
	]
,	function()
	{
		can.Control(
			'Frame.Notify'
		,	{
				defaults:
				{
					msg_options:
					{
						icon:			''
					,	title:			''
					,	message:		''
					,	url:			''
					}
				,	grl_options:
					{
						element:		'body'
					,	type:			'info'
					,	allow_dismiss:	true
					,	placement:
						{
							from:		'bottom'
						,	align:		'right'
						}
					,	offset:			20
					,	spacing:		10
					,	z_index:		2031
					,	delay:			5000
					,	timer:			1000
					,	url_target:		'_blank'
					,	mouse_over: 	false
					,	animate:
						{
							enter:		'animated fadeInDown'
						,	exit:		'animated fadeOutUp'
						}
					,	icon_type:		'class'
					,	template:	'<div data-growl="container" class="growl-noty alert" role="alert"><button type="button" class="close" data-growl="dismiss"><span aria-hidden="true">×</span><span class="sr-only">Cerrar</span></button><span class="noty-icon" data-growl="icon"></span><span class="noty-title" data-growl="title"></span><span class="noty-message" data-growl="message"></span><a href="#" data-growl="url"></a></div>'
					}
				}
			}
		,	{
				//	Lanza la notificacion
				notify: function(msg_options,grl_options)
				{
					$.growl(
						_.assign(
							{}
						,	this.options.msg_options
						,	msg_options
						)
					,	_.assign(
							{}
						,	this.options.grl_options
						,	grl_options
						)
					)
				}
				//	Notificacion custom
			,	'frame.notify': function(el,ev,growl_options)
				{
					this
						.notify(
							_.pick(
								growl_options
							,	['title','message','url','icon']
							)
						,	_.pick(
								growl_options
							,	['type','allow_dismiss','placement','offset','spacing','z_index','icon_type','template']
							)
						)
				}
				//	Notificacion del tipo Success
			,	'frame.notify.success': function(el,ev,msg)
				{
					this
						.notify(
							{
								message:	msg
							,	icon:		'fa fa-check'
							}
						,	{
								type:		'success'
							}
						)
				}
				//	Notificacion del tipo Info
			,	'frame.notify.info': function(el,ev,msg)
				{
					this
						.notify(
							{
								message:	msg
							,	icon:		'fa fa-question'
							}
						,	{
								type:		'info'
							}
						)
				}
				//	Notificacion del tipo Warning
			,	'frame.notify.warning': function(el,ev,msg)
				{
					this
						.notify(
							{
								message:	msg
							,	icon:		'fa fa-exclamation'
							}
						,	{
								type:		'warning'
							}
						)
				}
				//	Notificacion del tipo Danger
			,	'frame.notify.danger': function(el,ev,msg)
				{
					this
						.notify(
							{
								message:	msg
							,	icon:		'fa fa-warning'
							}
						,	{
								type:		'danger'
							}
						)
				}
			}
		)
	}
)