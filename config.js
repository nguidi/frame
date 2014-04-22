require
	.config(
		{
			map:
			{
				'*':
				{
					'css':	'bower_components/require-css/css'
				} 
			}
		,   paths:
			{
				jquery:		'bower_components/jquery/dist/jquery.min'
			,	can:		'bower_components/canjs/amd/can'
			,	bootstrap:	'bower_components/bootstrap/dist'
			,	fontawesome:'bower_components/fontawesome'
			,	localstorage:'bower_components/canjs-localstorage/can.localstorage'
			}
		}
	)