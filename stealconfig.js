System
	.config(
	{
		map:
		{
			'bootstrap':	'bower_components/bootstrap/dist'
		,	'can':			'bower_components/canjs/amd/can'
		}
	,	paths:
		{
			'jquery':		'bower_components/jquery/dist/jquery.js'
		}
	,	meta:
		{
			'jquery':
			{
				exports: 'jQuery'
			}
		}
	}
);